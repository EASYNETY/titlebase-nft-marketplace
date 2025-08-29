"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/hooks/use-auth"
import { socialProviders } from "@/lib/auth/social-providers"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, loginWithWallet, isLoading } = useAuth()
  const [selectedMethod, setSelectedMethod] = useState<"wallet" | "social" | null>(null)

  const handleSocialLogin = async (providerId: string) => {
    setSelectedMethod("social")
    await login(providerId)
  }

  const handleWalletLogin = async () => {
    setSelectedMethod("wallet")
    await loginWithWallet()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-primary">
            Connect to Title Marketplace
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Social Login Options */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              Sign in with your social account for a seamless experience
            </p>

            <div className="grid gap-2">
              {Object.values(socialProviders).map((provider) => (
                <Button
                  key={provider.id}
                  variant="outline"
                  className="w-full justify-start gap-3 h-12 bg-transparent"
                  onClick={() => handleSocialLogin(provider.id)}
                  disabled={isLoading && selectedMethod === "social"}
                >
                  <span className="text-lg">{provider.icon}</span>
                  Continue with {provider.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">Connect your crypto wallet</p>

            <Button
              className="w-full h-12 bg-primary hover:bg-primary/90"
              onClick={handleWalletLogin}
              disabled={isLoading && selectedMethod === "wallet"}
            >
              {isLoading && selectedMethod === "wallet" ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connecting...
                </div>
              ) : (
                "Connect Wallet"
              )}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>By connecting, you agree to our Terms of Service and Privacy Policy.</p>
            <p>New users will automatically get a smart account for gasless transactions.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
