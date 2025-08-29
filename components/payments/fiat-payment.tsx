"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, CreditCard, Building, CheckCircle, AlertCircle } from "lucide-react"

interface FiatPaymentProps {
  amount: string
  propertyId: string
  escrowEnabled: boolean
  onPaymentComplete: (result: any) => void
}

export function FiatPayment({ amount, propertyId, escrowEnabled, onPaymentComplete }: FiatPaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState("credit_card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")

  const handlePayment = async () => {
    setIsProcessing(true)
    setPaymentStatus("processing")

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const result = {
        success: true,
        paymentId: `fiat_${paymentMethod}_${Date.now()}`,
        method: paymentMethod,
        amount,
        escrowEnabled,
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

  if (paymentStatus === "success") {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Payment Successful!</p>
              <p className="text-sm text-green-700">
                Your payment has been processed successfully. You will receive a confirmation email shortly.
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
                There was an error processing your payment. Please check your payment details and try again.
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
      <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="credit_card" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Credit Card
          </TabsTrigger>
          <TabsTrigger value="bank_transfer" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Bank Transfer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="credit_card" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Credit Card Information</CardTitle>
              <CardDescription>Enter your card details to complete the payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input id="card-number" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardholder">Cardholder Name</Label>
                <Input id="cardholder" placeholder="John Doe" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bank_transfer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Bank Transfer Information</CardTitle>
              <CardDescription>Provide your bank account details for ACH transfer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="account-number">Account Number</Label>
                <Input id="account-number" placeholder="123456789" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="routing-number">Routing Number</Label>
                <Input id="routing-number" placeholder="021000021" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account-type">Account Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="account-holder">Account Holder Name</Label>
                <Input id="account-holder" placeholder="John Doe" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span>Amount</span>
            <span className="font-semibold">${amount}</span>
          </div>
          <div className="flex justify-between">
            <span>Processing Fee</span>
            <span>2.9% + $0.30</span>
          </div>
          {escrowEnabled && (
            <div className="flex justify-between">
              <span>Escrow Protection</span>
              <span className="text-green-600">Free</span>
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
            {paymentMethod === "credit_card" ? (
              <CreditCard className="mr-2 h-4 w-4" />
            ) : (
              <Building className="mr-2 h-4 w-4" />
            )}
            Pay ${amount}
          </>
        )}
      </Button>

      {/* Security Notice */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Your payment information is encrypted and secure</p>
        <p>• Processing typically takes 1-3 business days</p>
        {escrowEnabled && <p>• Funds will be held in escrow until transaction completion</p>}
      </div>
    </div>
  )
}
