"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Search, Filter, Eye, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

const mockProperties = [
  {
    id: "1",
    title: "Luxury Downtown Condo",
    owner: "0x1234...5678",
    price: "$250,000",
    status: "active",
    verificationStatus: "verified",
    location: "Miami, FL",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Suburban Family Home",
    owner: "0x2345...6789",
    price: "$180,000",
    status: "pending",
    verificationStatus: "pending",
    location: "Orlando, FL",
    createdAt: "2024-01-18",
  },
  {
    id: "3",
    title: "Commercial Office Space",
    owner: "0x3456...7890",
    price: "$450,000",
    status: "sold",
    verificationStatus: "verified",
    location: "Tampa, FL",
    createdAt: "2024-01-10",
  },
]

export function PropertyManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedProperty, setSelectedProperty] = useState<any>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "sold":
        return <Badge className="bg-blue-100 text-blue-800">Sold</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            Verified
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Property Management</CardTitle>
          <CardDescription>Manage and verify property listings</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Properties Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">{property.title}</TableCell>
                    <TableCell className="font-mono text-sm">{property.owner}</TableCell>
                    <TableCell>{property.price}</TableCell>
                    <TableCell>{getStatusBadge(property.status)}</TableCell>
                    <TableCell>{getVerificationBadge(property.verificationStatus)}</TableCell>
                    <TableCell>{property.location}</TableCell>
                    <TableCell>{property.createdAt}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedProperty(property)}>
                            <Eye className="mr-1 h-4 w-4" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Property Details</DialogTitle>
                            <DialogDescription>Review and manage property listing</DialogDescription>
                          </DialogHeader>
                          {selectedProperty && (
                            <div className="space-y-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <Label>Title</Label>
                                  <Input value={selectedProperty.title} readOnly />
                                </div>
                                <div>
                                  <Label>Price</Label>
                                  <Input value={selectedProperty.price} readOnly />
                                </div>
                                <div>
                                  <Label>Owner</Label>
                                  <Input value={selectedProperty.owner} readOnly />
                                </div>
                                <div>
                                  <Label>Location</Label>
                                  <Input value={selectedProperty.location} readOnly />
                                </div>
                              </div>
                              <div>
                                <Label>Verification Status</Label>
                                <Select defaultValue={selectedProperty.verificationStatus}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="verified">Verified</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Admin Notes</Label>
                                <Textarea placeholder="Add verification notes..." />
                              </div>
                              <div className="flex gap-2">
                                <Button className="bg-green-600 hover:bg-green-700">
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve
                                </Button>
                                <Button variant="destructive">
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
