"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Wallet, CheckCircle, AlertCircle } from "lucide-react"
import { SUPPORTED_TOKENS } from "@/lib/config/payments"
import { useAuth } from "@/lib/hooks/use-auth"

interface CryptoPaymentProps {
  amount: string
  recipient: string
  propertyId: string
  escrowEnabled: boolean
  escrowPeriod: number
  onPaymentComplete: (result: any) => void
}

export function CryptoPayment({
  amount,
  recipient,
  propertyId,
  escrowEnabled,
  escrowPeriod,
  onPaymentComplete,
}: CryptoPaymentProps) {
  const { user, isConnected } = useAuth()
  const [selectedToken, setSelectedToken] = useState("USDC")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")

  const handlePayment = async () => {
    if (!isConnected || !user) {
      return
    }

    setIsProcessing(true)
    setPaymentStatus("processing")

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const result = {
        success: true,
        transactionHash: `0x${Math.random().toString(16).slice(2).padStart(64, "0")}`,
        paymentId: `crypto_${Date.now()}`,
        escrowId: escrowEnabled ? `escrow_${Date.now()}` : undefined,
        token: selectedToken,
        amount,
      }

      setPaymentStatus("success")
      onPaymentComplete(result)
    } catch (error) {
      console.error("Payment error:", error)
      setPaymentStatus("error")
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isConnected) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Wallet className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-900">Wallet Not Connected</p>
              <p className="text-sm text-yellow-700">Please connect your wallet to make a crypto payment.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (paymentStatus === "success") {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Payment Successful!</p>
              <p className="text-sm text-green-700">
                Your transaction has been submitted to the blockchain. You will receive a confirmation shortly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (paymentStatus === "error") {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-medium text-red-900">Payment Failed</p>
              <p className="text-sm text-red-700">
                There was an error processing your payment. Please try again or contact support.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="mt-3 bg-transparent"
            onClick={() => {
              setPaymentStatus("idle")
              setIsProcessing(false)
            }}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Token Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Payment Token</label>
        <Select value={selectedToken} onValueChange={setSelectedToken}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(SUPPORTED_TOKENS).map(([key, token]) => (
              <SelectItem key={key} value={key}>
                <div className="flex items-center gap-2">
                  <img src={token.icon || "/placeholder.svg"} alt={token.symbol} className="h-5 w-5" />
                  <span>{token.symbol}</span>
                  <span className="text-muted-foreground">- {token.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span>Amount</span>
            <span className="font-semibold">
              ${amount} ({selectedToken})
            </span>
          </div>
          <div className="flex justify-between">
            <span>Recipient</span>
            <span className="font-mono text-sm">
              {recipient.slice(0, 6)}...{recipient.slice(-4)}
            </span>
          </div>
          {escrowEnabled && (
            <div className="flex justify-between">
              <span>Escrow Period</span>
              <Badge className="bg-blue-100 text-blue-800">{escrowPeriod} days</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Button */}
      <Button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full bg-blue-600 hover:bg-blue-700"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <Wallet className="mr-2 h-4 w-4" />
            Pay with {selectedToken}
          </>
        )}
      </Button>

      {/* Transaction Info */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Transaction will be processed on Base network</p>
        <p>• Gas fees will be calculated automatically</p>
        <p>• You will receive a confirmation once the transaction is mined</p>
        {escrowEnabled && <p>• Funds will be held in escrow for {escrowPeriod} days for buyer protection</p>}
      </div>
    </div>
  )
}
