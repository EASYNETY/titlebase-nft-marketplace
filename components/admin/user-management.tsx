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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, Eye, Shield, ShieldCheck, ShieldX } from "lucide-react"

const mockUsers = [
  {
    id: "1",
    address: "0x1234567890123456789012345678901234567890",
    email: "john@example.com",
    kycStatus: "verified",
    accountType: "smart",
    joinedAt: "2024-01-15",
    lastActive: "2024-01-20",
    propertiesOwned: 3,
    totalVolume: "$750,000",
  },
  {
    id: "2",
    address: "0x2345678901234567890123456789012345678901",
    email: "sarah@example.com",
    kycStatus: "pending",
    accountType: "wallet",
    joinedAt: "2024-01-18",
    lastActive: "2024-01-19",
    propertiesOwned: 1,
    totalVolume: "$180,000",
  },
  {
    id: "3",
    address: "0x3456789012345678901234567890123456789012",
    email: "mike@example.com",
    kycStatus: "rejected",
    accountType: "smart",
    joinedAt: "2024-01-10",
    lastActive: "2024-01-12",
    propertiesOwned: 0,
    totalVolume: "$0",
  },
]

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [kycFilter, setKycFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const getKycBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800">
            <ShieldCheck className="mr-1 h-3 w-3" />
            Verified
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Shield className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800">
            <ShieldX className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getAccountTypeBadge = (type: string) => {
    return type === "smart" ? (
      <Badge className="bg-blue-100 text-blue-800">Smart Account</Badge>
    ) : (
      <Badge variant="outline">Wallet</Badge>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage users and KYC verification</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={kycFilter} onValueChange={setKycFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by KYC" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All KYC Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>KYC Status</TableHead>
                  <TableHead>Account Type</TableHead>
                  <TableHead>Properties</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32&query=user avatar`} />
                          <AvatarFallback>{user.email.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.email}</p>
                          <p className="text-sm text-muted-foreground">Joined {user.joinedAt}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {user.address.slice(0, 6)}...{user.address.slice(-4)}
                    </TableCell>
                    <TableCell>{getKycBadge(user.kycStatus)}</TableCell>
                    <TableCell>{getAccountTypeBadge(user.accountType)}</TableCell>
                    <TableCell>{user.propertiesOwned}</TableCell>
                    <TableCell>{user.totalVolume}</TableCell>
                    <TableCell>{user.lastActive}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                            <Eye className="mr-1 h-4 w-4" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>User Details</DialogTitle>
                            <DialogDescription>Review and manage user account</DialogDescription>
                          </DialogHeader>
                          {selectedUser && (
                            <div className="space-y-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                                  <p>{selectedUser.email}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                                  <p className="font-mono text-sm">{selectedUser.address}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">KYC Status</p>
                                  {getKycBadge(selectedUser.kycStatus)}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Account Type</p>
                                  {getAccountTypeBadge(selectedUser.accountType)}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Properties Owned</p>
                                  <p>{selectedUser.propertiesOwned}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Total Volume</p>
                                  <p>{selectedUser.totalVolume}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button className="bg-green-600 hover:bg-green-700">
                                  <ShieldCheck className="mr-2 h-4 w-4" />
                                  Verify KYC
                                </Button>
                                <Button variant="destructive">
                                  <ShieldX className="mr-2 h-4 w-4" />
                                  Reject KYC
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
