"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Verified,
  TrendingUp,
  FileText,
  Shield,
  Heart,
  Share,
  Users,
  DollarSign,
  Calculator,
  PieChart,
} from "lucide-react"

const propertyData = {
  id: "1",
  title: "Modern Downtown Condo",
  location: "San Francisco, CA",
  fullAddress: "123 Market Street, San Francisco, CA 94105",
  totalValue: 850000,
  totalShares: 1000,
  availableShares: 650,
  sharePrice: 850,
  minInvestment: 1000,
  maxInvestment: 50000,
  monthlyRevenue: 4250,
  annualYield: 6.2,
  images: [
    "/modern-downtown-condo-exterior.png",
    "/modern-condo-living-room.png",
    "/modern-condo-kitchen.png",
    "/modern-condo-bedroom.png",
  ],
  isVerified: true,
  currentInvestors: 23,
  description:
    "Stunning modern condominium in the heart of downtown San Francisco. This property features floor-to-ceiling windows, premium finishes, and breathtaking city views. Located in a luxury building with concierge services and rooftop amenities.",
  details: {
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    yearBuilt: 2018,
    propertyType: "Condominium",
    lotSize: "N/A",
  },
  titleInfo: {
    propertyId: "SF-2024-001",
    legalDescription: "Unit 1205, Building A, Market Square Condominiums",
    jurisdiction: "San Francisco County, California",
    documentHash: "0x1234...5678",
    verifiedBy: "SF County Recorder",
    verificationDate: "2024-01-15",
  },
  revenueHistory: [
    { month: "Jan 2024", revenue: 4100, yield: 5.8 },
    { month: "Feb 2024", revenue: 4250, yield: 6.1 },
    { month: "Mar 2024", revenue: 4300, yield: 6.2 },
  ],
  topInvestors: [
    { address: "0x1234...5678", shares: 85, percentage: 8.5 },
    { address: "0x2345...6789", shares: 72, percentage: 7.2 },
    { address: "0x3456...7890", shares: 68, percentage: 6.8 },
  ],
}

export default function PropertyDetailPage() {
  const params = useParams()
  const [selectedImage, setSelectedImage] = useState(0)
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [calculatedShares, setCalculatedShares] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    const amount = Number.parseFloat(investmentAmount) || 0
    const shares = Math.floor(amount / propertyData.sharePrice)
    setCalculatedShares(shares)
  }, [investmentAmount])

  const handleInvest = () => {
    // Implement investment logic
    console.log("Invest:", investmentAmount, "shares:", calculatedShares)
  }

  const fundingProgress = ((propertyData.totalShares - propertyData.availableShares) / propertyData.totalShares) * 100

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative">
            <Image
              src={propertyData.images[selectedImage] || "/placeholder.svg"}
              alt={propertyData.title}
              width={800}
              height={400}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />

            {/* Action buttons overlay */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setIsFavorited(!isFavorited)}>
                <Heart className={`w-4 h-4 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Button variant="secondary" size="sm">
                <Share className="w-4 h-4" />
              </Button>
            </div>

            {/* Verification badge */}
            {propertyData.isVerified && (
              <Badge className="absolute top-4 left-4 bg-green-500 hover:bg-green-600">
                <Verified className="w-3 h-3 mr-1" />
                Verified Title
              </Badge>
            )}
          </div>

          {/* Thumbnail gallery */}
          <div className="flex gap-2 overflow-x-auto">
            {propertyData.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  selectedImage === index ? "border-primary" : "border-transparent"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`View ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Property Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{propertyData.title}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{propertyData.location}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Investment Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Property Value</span>
                    <span className="font-bold">${propertyData.totalValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price per Share</span>
                    <span className="font-bold">${propertyData.sharePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Available Shares</span>
                    <span className="font-bold">{propertyData.availableShares.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Investors</span>
                    <span className="font-bold">{propertyData.currentInvestors}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Funding Progress</span>
                    <span className="text-sm text-muted-foreground">{fundingProgress.toFixed(1)}%</span>
                  </div>
                  <Progress value={fundingProgress} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Revenue & Returns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Revenue</span>
                    <span className="font-bold text-green-600">${propertyData.monthlyRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Annual Yield</span>
                    <span className="font-bold text-green-600">{propertyData.annualYield}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Min Investment</span>
                    <span className="font-medium">${propertyData.minInvestment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Investment</span>
                    <span className="font-medium">${propertyData.maxInvestment.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Investment Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Investment Amount ($)</label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    min={propertyData.minInvestment}
                    max={propertyData.maxInvestment}
                  />
                  <div className="text-xs text-muted-foreground">
                    Min: ${propertyData.minInvestment.toLocaleString()} • Max: $
                    {propertyData.maxInvestment.toLocaleString()}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Shares to Purchase</label>
                  <div className="h-10 px-3 py-2 border rounded-md bg-muted flex items-center">
                    <span className="font-medium">{calculatedShares.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {calculatedShares > 0 &&
                      `${((calculatedShares / propertyData.totalShares) * 100).toFixed(2)}% ownership`}
                  </div>
                </div>
              </div>

              {calculatedShares > 0 && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg space-y-2">
                  <h4 className="font-medium">Projected Monthly Returns</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Monthly Income:</span>
                      <div className="font-bold text-green-600">
                        ${((propertyData.monthlyRevenue * calculatedShares) / propertyData.totalShares).toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Annual Income:</span>
                      <div className="font-bold text-green-600">
                        ${((propertyData.monthlyRevenue * 12 * calculatedShares) / propertyData.totalShares).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={handleInvest}
                size="lg"
                className="w-full"
                disabled={!calculatedShares || calculatedShares > propertyData.availableShares}
              >
                {calculatedShares > propertyData.availableShares
                  ? "Not Enough Shares Available"
                  : `Invest $${investmentAmount || "0"}`}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Property Details Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="investors">Investors</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="title">Title Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Property Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{propertyData.description}</p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Key Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Bedrooms</span>
                    <span className="font-medium">{propertyData.details.bedrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bathrooms</span>
                    <span className="font-medium">{propertyData.details.bathrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Square Feet</span>
                    <span className="font-medium">{propertyData.details.sqft.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Year Built</span>
                    <span className="font-medium">{propertyData.details.yearBuilt}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Verification Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Verified className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Title Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Legal Documents Complete</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Blockchain Secured</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="investors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Current Investors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{propertyData.currentInvestors}</div>
                    <div className="text-sm text-muted-foreground">Total Investors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{propertyData.totalShares - propertyData.availableShares}</div>
                    <div className="text-sm text-muted-foreground">Shares Sold</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{fundingProgress.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Funded</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Top Investors</h4>
                  {propertyData.topInvestors.map((investor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium">#{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-mono text-sm">{investor.address}</div>
                          <div className="text-xs text-muted-foreground">{investor.percentage}% ownership</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{investor.shares} shares</div>
                        <div className="text-xs text-muted-foreground">
                          ${(investor.shares * propertyData.sharePrice).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Revenue History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ${propertyData.monthlyRevenue.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Current Monthly Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{propertyData.annualYield}%</div>
                    <div className="text-sm text-muted-foreground">Annual Yield</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Recent Performance</h4>
                  {propertyData.revenueHistory.map((entry, index) => (
                    <div key={index} className="flex justify-between items-center py-3 border-b last:border-b-0">
                      <span className="font-medium">{entry.month}</span>
                      <div className="text-right">
                        <div className="font-medium">${entry.revenue.toLocaleString()}</div>
                        <div className="text-sm text-green-600">{entry.yield}% yield</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="title" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Title Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Property ID</span>
                    <p className="font-mono text-sm">{propertyData.titleInfo.propertyId}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Legal Description</span>
                    <p className="text-sm">{propertyData.titleInfo.legalDescription}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Jurisdiction</span>
                    <p className="text-sm">{propertyData.titleInfo.jurisdiction}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Document Hash</span>
                    <p className="font-mono text-sm break-all">{propertyData.titleInfo.documentHash}</p>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <span className="text-sm text-muted-foreground">Verified By</span>
                      <p className="text-sm">{propertyData.titleInfo.verifiedBy}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Verification Date</span>
                      <p className="text-sm">{propertyData.titleInfo.verificationDate}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Property Type</span>
                      <span className="font-medium">{propertyData.details.propertyType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bedrooms</span>
                      <span className="font-medium">{propertyData.details.bedrooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bathrooms</span>
                      <span className="font-medium">{propertyData.details.bathrooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Square Feet</span>
                      <span className="font-medium">{propertyData.details.sqft.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Year Built</span>
                      <span className="font-medium">{propertyData.details.yearBuilt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lot Size</span>
                      <span className="font-medium">{propertyData.details.lotSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Full Address</span>
                      <span className="font-medium text-right">{propertyData.fullAddress}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <MobileNav />
    </div>
  )
}
