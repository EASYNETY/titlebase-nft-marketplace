"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { MapPin, Verified, TrendingUp, FileText, Shield, Heart, Share } from "lucide-react"

// Mock property data
const propertyData = {
  id: "1",
  title: "Modern Downtown Condo",
  location: "San Francisco, CA",
  fullAddress: "123 Market Street, San Francisco, CA 94105",
  price: "2.5 ETH",
  assessedValue: "$850,000",
  currentBid: "2.3 ETH",
  images: [
    "/modern-downtown-condo-exterior.png",
    "/modern-condo-living-room.png",
    "/modern-condo-kitchen.png",
    "/modern-condo-bedroom.png",
  ],
  isVerified: true,
  isAuction: false,
  auctionEndTime: null,
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
  priceHistory: [
    { date: "2024-01-01", price: "2.2 ETH" },
    { date: "2024-01-15", price: "2.4 ETH" },
    { date: "2024-02-01", price: "2.5 ETH" },
  ],
}

export default function PropertyDetailPage() {
  const params = useParams()
  const [selectedImage, setSelectedImage] = useState(0)
  const [bidAmount, setBidAmount] = useState("")
  const [isFavorited, setIsFavorited] = useState(false)

  const handleBuyNow = () => {
    // Implement buy now logic
    console.log("Buy now clicked")
  }

  const handlePlaceBid = () => {
    // Implement bid logic
    console.log("Place bid:", bidAmount)
  }

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

          {/* Price and Action */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-primary">{propertyData.price}</div>
              <div className="text-sm text-muted-foreground">Assessed Value: {propertyData.assessedValue}</div>
            </div>

            <div className="flex gap-3">
              {propertyData.isAuction ? (
                <div className="flex gap-2 w-full md:w-auto">
                  <Input
                    placeholder="Enter bid amount"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handlePlaceBid} className="shrink-0">
                    Place Bid
                  </Button>
                </div>
              ) : (
                <Button onClick={handleBuyNow} size="lg" className="w-full md:w-auto">
                  Buy Now
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Property Details Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="title">Title Info</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
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

          <TabsContent value="details">
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

          <TabsContent value="title">
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

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Price History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {propertyData.priceHistory.map((entry, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <span className="text-sm text-muted-foreground">{entry.date}</span>
                      <span className="font-medium">{entry.price}</span>
                    </div>
                  ))}
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
