"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { PropertyGrid } from "@/components/marketplace/property-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Search, SlidersHorizontal } from "lucide-react"

// Mock data
const allProperties = [
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
  {
    id: "5",
    title: "Urban Loft Space",
    location: "Chicago, IL",
    price: "2.2 ETH",
    assessedValue: "$780,000",
    image: "/urban-loft-space.png",
    isVerified: true,
    isAuction: false,
  },
  {
    id: "6",
    title: "Suburban Family Home",
    location: "Austin, TX",
    price: "1.9 ETH",
    assessedValue: "$620,000",
    image: "/suburban-family-home.png",
    isVerified: true,
    isAuction: false,
  },
]

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [filterType, setFilterType] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 10])
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)
  const [filteredProperties, setFilteredProperties] = useState(allProperties)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Apply filters
    let filtered = allProperties

    if (searchQuery) {
      filtered = filtered.filter(
        (property) =>
          property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.location.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (filterType !== "all") {
      if (filterType === "auction") {
        filtered = filtered.filter((property) => property.isAuction)
      } else if (filterType === "fixed") {
        filtered = filtered.filter((property) => !property.isAuction)
      } else if (filterType === "verified") {
        filtered = filtered.filter((property) => property.isVerified)
      }
    }

    setFilteredProperties(filtered)
  }, [searchQuery, filterType, priceRange])

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Page Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">Marketplace</h1>
            <p className="text-muted-foreground">Discover and trade verified real estate NFTs</p>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search properties, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="shrink-0">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="ending-soon">Ending Soon</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Badge
                  variant={filterType === "all" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setFilterType("all")}
                >
                  All
                </Badge>
                <Badge
                  variant={filterType === "auction" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setFilterType("auction")}
                >
                  Auctions
                </Badge>
                <Badge
                  variant={filterType === "fixed" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setFilterType("fixed")}
                >
                  Fixed Price
                </Badge>
                <Badge
                  variant={filterType === "verified" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setFilterType("verified")}
                >
                  Verified
                </Badge>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Price Range (ETH)</label>
                    <Slider value={priceRange} onValueChange={setPriceRange} max={10} step={0.1} className="w-full" />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>{priceRange[0]} ETH</span>
                      <span>{priceRange[1]} ETH</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Property Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Any type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residential">Residential</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="land">Land</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Location</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Any location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="california">California</SelectItem>
                          <SelectItem value="new-york">New York</SelectItem>
                          <SelectItem value="texas">Texas</SelectItem>
                          <SelectItem value="colorado">Colorado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {loading ? "Loading..." : `${filteredProperties.length} properties found`}
            </p>
          </div>

          <PropertyGrid properties={filteredProperties} loading={loading} />
        </div>
      </main>

      <MobileNav />
    </div>
  )
}
