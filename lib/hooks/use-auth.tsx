"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { socialProviders } from "@/lib/auth/social-providers"

interface User {
  id: string
  address?: string
  email?: string
  name?: string
  avatar?: string
  provider: "wallet" | "social"
  socialProvider?: string
  isKYCVerified: boolean
  isWhitelisted: boolean
  smartAccountAddress?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (provider: string) => Promise<void>
  loginWithWallet: () => Promise<void>
  logout: () => Promise<void>
  createSmartAccount: () => Promise<string>
  updateKYCStatus: (verified: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const isAuthenticated = !!user

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session")
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.error("Session check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  useEffect(() => {
    // Handle wallet connection
    if (isConnected && address && !user) {
      handleWalletAuth(address)
    }
  }, [isConnected, address, user])

  const handleWalletAuth = async (walletAddress: string) => {
    try {
      const response = await fetch("/api/auth/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: walletAddress }),
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.error("Wallet auth failed:", error)
    }
  }

  const login = async (providerId: string) => {
    setIsLoading(true)
    try {
      const provider = socialProviders[providerId]
      if (!provider) throw new Error("Invalid provider")

      // Redirect to OAuth provider
      window.location.href = provider.getAuthUrl()
    } catch (error) {
      console.error("Social login failed:", error)
      setIsLoading(false)
    }
  }

  const loginWithWallet = async () => {
    setIsLoading(true)
    try {
      const connector = connectors[0] // Use first available connector
      if (connector) {
        connect({ connector })
      }
    } catch (error) {
      console.error("Wallet connection failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      if (isConnected) {
        disconnect()
      }
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const createSmartAccount = async (): Promise<string> => {
    if (!user) throw new Error("User not authenticated")

    try {
      const response = await fetch("/api/auth/smart-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) throw new Error("Smart account creation failed")

      const { smartAccountAddress } = await response.json()

      setUser((prev) => (prev ? { ...prev, smartAccountAddress } : null))

      return smartAccountAddress
    } catch (error) {
      console.error("Smart account creation failed:", error)
      throw error
    }
  }

  const updateKYCStatus = (verified: boolean) => {
    setUser((prev) => (prev ? { ...prev, isKYCVerified: verified } : null))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        loginWithWallet,
        logout,
        createSmartAccount,
        updateKYCStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
