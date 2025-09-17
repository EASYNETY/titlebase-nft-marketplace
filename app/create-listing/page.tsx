
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { propertiesApi } from "@/lib/api/client"
import { marketplaceApi } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function CreateListingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [propertyData, setPropertyData] = useState({
    title: "",
    description: "",
    address: "",
    property_type: "",
    square_footage: "",
    bedrooms: "",
    bathrooms: "",
    year_built: "",
    lot_size: "",
    images: [] as File[],
  })
  const [listingData, setListingData] = useState({
    listing_type: "fixed_price",
    price: "",
    end_time: "",
  })

  const handlePropertyChange = (field: string, value: string) => {
    setPropertyData(prev => ({ ...prev, [field]: value }))
  }

  const handleListingChange = (field: string, value: string) => {
    setListingData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPropertyData(prev => ({ ...prev, images: Array.from(e.target.files || []) }))
    }
  }

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Authentication Required", description: "Please sign in to create a listing", variant: "destructive" })
      return
    }

    setLoading(true)

    try {
      // Step 1: Create Property
      const propertyPayload = {
        title: propertyData.title,
        description: propertyData.description,
        address: propertyData.address,
        property_type: propertyData.property_type,
        square_footage: propertyData.square_footage ? parseInt(propertyData.square_footage) : undefined,
        bedrooms: propertyData.bedrooms ? parseInt(propertyData.bedrooms) : undefined,
        bathrooms: propertyData.bathrooms ? parseInt(propertyData.bathrooms) : undefined,
        year_built: propertyData.year_built ? parseInt(propertyData.year_built) : undefined,
        lot_size: propertyData.lot_size ? parseInt(propertyData.lot_size) : undefined,
        images: propertyData.images,
      }

      const propertyResponse = await propertiesApi.createProperty(propertyPayload)
      const propertyId = propertyResponse.id

      // Step 2: Create Listing
      const listingPayload = {
        propertyId,
        price: parseFloat(listingData.price),
        listingType: listingData.listing_type,
        duration: listingData.listing_type === "auction" ? 7 : undefined, // 7 days default
      }

      if (listingData.listing_type === "auction" && listingData.end_time) {
        listingPayload.end_time = listingData.end_time
      }

      await marketplaceApi.createListing(listingPayload)

      toast({ title: "Success", description: "Your property listing has been created!" })
      router.push("/marketplace")
    } catch (error) {
      toast({ title: "Error", description: "Failed to create listing. Please try again.", variant: "destructive" })
      console.error("Create listing error:", error)
    } finally {
      setLoading(false)
    }
  }

  const isPropertyComplete = propertyData.title && propertyData.description && propertyData.address && propertyData.property_type && listingData.price

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Create New Property Listing</h1>
          <p className="text-muted-foreground">Fill