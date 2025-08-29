"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { PropertyGrid } from "@/components/marketplace/property-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, TrendingUp, Shield, Zap, ArrowRight } from "lucide-react"

// Mock data for demonstration
const featuredProperties = [
  {
    id: "1",
    title: "Modern Downtown Condo",
    location: "San Francisco, CA",
    price: "2.5 ETH",
    assessedValue: "$850,000",
    image: "/modern-downtown-condo.png",
    isVerified: true,
    isAuction: false,
  },
  {
    id: "2",
    title: "Luxury Beach House",
    location: "Malibu, CA",
    price: "5.2 ETH",
    assessedValue: "$1,200,000",
    image: "/luxury-beach-house.png",
    isVerified: true,
    isAuction: true,
    auctionEndTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    currentBid: "4.8 ETH",
  },
  {
    id: "3",
    title: "Historic Brownstone",
    location: "Brooklyn, NY",
    price: "3.1 ETH",
    assessedValue: "$950,000",
    image: "/historic-brownstone.png",
    isVerified: true,
    isAuction: false,
  },
  {
    id: "4",
    title: "Mountain Cabin Retreat",
    location: "Aspen, CO",
    price: "1.8 ETH",
    assessedValue: "$650,000",
    image: "/mountain-cabin-retreat.png",
    isVerified: false,
    isAuction: true,
    auctionEndTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    currentBid: "1.6 ETH",
  },
]

const stats = [
  { label: "Total Volume", value: "$24.5M", change: "+12.3%" },
  { label: "Properties Listed", value: "1,247", change: "+8.7%" },
  { label: "Active Auctions", value: "89", change: "+15.2%" },
  { label: "Verified Titles", value: "892", change: "+5.4%" },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-balance">
              Own Real Estate as <span className="text-primary">Digital Assets</span>
            </h1>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Trade verified title-backed NFTs on Base. Secure, transparent, and accessible real estate investment.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search by location, property type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-lg"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8">Search</Button>
            </div>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="secondary" className="px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Verified Titles
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Gasless Trading
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              Live Auctions
            </Badge>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className="text-xs text-green-600 font-medium">{stat.change}</div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Featured Properties */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Featured Properties</h2>
              <p className="text-muted-foreground">Discover premium real estate opportunities</p>
            </div>
            <Button variant="outline" className="hidden md:flex bg-transparent">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <PropertyGrid properties={featuredProperties} loading={loading} />

          <div className="text-center md:hidden">
            <Button variant="outline" className="w-full bg-transparent">
              View All Properties
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>

        {/* How It Works */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Simple, secure, and transparent real estate trading</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <CardTitle>Browse & Discover</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Explore verified real estate properties with complete title documentation and transparent pricing.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <CardTitle>Bid or Buy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Participate in live auctions or purchase properties at fixed prices using cryptocurrency.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🏠</span>
                </div>
                <CardTitle>Own & Trade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Receive your title-backed NFT and trade it freely on the marketplace or hold as an investment.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <MobileNav />
    </div>
  )
}
