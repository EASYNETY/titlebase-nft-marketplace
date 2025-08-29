"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CryptoPayment } from "./crypto-payment"
import { FiatPayment } from "./fiat-payment"
import { EscrowOptions } from "./escrow-options"
import { CreditCard, Wallet, Shield } from "lucide-react"

interface PaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  property: {
    id: string
    title: string
    price: string
    seller: string
    image: string
  }
  onPaymentComplete: (paymentResult: any) => void
}

export function PaymentModal({ open, onOpenChange, property, onPaymentComplete }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<"crypto" | "fiat">("crypto")
  const [escrowEnabled, setEscrowEnabled] = useState(true)
  const [escrowPeriod, setEscrowPeriod] = useState(7)

  const marketplaceFee = (Number.parseFloat(property.price.replace(/[$,]/g, "")) * 0.01).toLocaleString()
  const totalAmount = (Number.parseFloat(property.price.replace(/[$,]/g, "")) * 1.01).toLocaleString()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Purchase</DialogTitle>
          <DialogDescription>Choose your payment method and complete the transaction</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Property Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <img
                  src={property.image || "/placeholder.svg"}
                  alt={property.title}
                  className="h-20 w-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{property.title}</h3>
                  <p className="text-sm text-muted-foreground">Seller: {property.seller}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">Verified Title</Badge>
                    <Badge className="bg-blue-100 text-blue-800">KYC Verified</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Property Price</span>
                <span className="font-semibold">{property.price}</span>
              </div>
              <div className="flex justify-between">
                <span>Marketplace Fee (1%)</span>
                <span>${marketplaceFee}</span>
              </div>
              {escrowEnabled && (
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Escrow Protection
                  </span>
                  <span className="text-green-600">Free</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount</span>
                <span>${totalAmount}</span>
              </div>
            </CardContent>
          </Card>

          {/* Escrow Options */}
          <EscrowOptions
            enabled={escrowEnabled}
            onEnabledChange={setEscrowEnabled}
            period={escrowPeriod}
            onPeriodChange={setEscrowPeriod}
          />

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as any)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="crypto" className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    Cryptocurrency
                  </TabsTrigger>
                  <TabsTrigger value="fiat" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Traditional Payment
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="crypto" className="mt-6">
                  <CryptoPayment
                    amount={totalAmount}
                    recipient={property.seller}
                    propertyId={property.id}
                    escrowEnabled={escrowEnabled}
                    escrowPeriod={escrowPeriod}
                    onPaymentComplete={onPaymentComplete}
                  />
                </TabsContent>

                <TabsContent value="fiat" className="mt-6">
                  <FiatPayment
                    amount={totalAmount}
                    propertyId={property.id}
                    escrowEnabled={escrowEnabled}
                    onPaymentComplete={onPaymentComplete}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-blue-900">Secure Transaction</p>
                  <p className="text-sm text-blue-700">
                    Your payment is protected by blockchain technology and smart contract escrow. Funds are only
                    released when both parties confirm the transaction or after the escrow period expires.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
