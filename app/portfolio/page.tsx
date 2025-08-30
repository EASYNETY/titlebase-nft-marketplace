import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, DollarSign, Home, Coins } from "lucide-react"

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Portfolio</h1>
          <p className="text-slate-600">Track your title NFTs and fractional investments</p>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$245,680</div>
              <p className="text-xs text-muted-foreground">+12.5% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Title NFTs</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Properties owned</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fractional Shares</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Active investments</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,450</div>
              <p className="text-xs text-muted-foreground">From distributions</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="nfts" className="space-y-6">
          <TabsList>
            <TabsTrigger value="nfts">Title NFTs</TabsTrigger>
            <TabsTrigger value="fractional">Fractional Shares</TabsTrigger>
            <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          </TabsList>

          <TabsContent value="nfts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((id) => (
                <Card key={id} className="overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-slate-100 relative">
                    <Badge className="absolute top-3 left-3 bg-green-500 text-white">Owned</Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">Property #{id}</CardTitle>
                    <p className="text-sm text-slate-600">Residential Title NFT</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Purchase Price</span>
                        <span className="font-medium">${(75000 + id * 15000).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Current Value</span>
                        <span className="font-medium text-green-600">${(80000 + id * 16000).toLocaleString()}</span>
                      </div>
                      <Button className="w-full mt-4 bg-transparent" variant="outline">
                        Manage Property
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="fractional" className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3, 4].map((id) => (
                <Card key={id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Fractional Investment #{id}</h3>
                        <p className="text-sm text-slate-600">Commercial Property - 2.5% ownership</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${(5000 + id * 1000).toLocaleString()}</div>
                        <div className="text-sm text-green-600">+8.2% ROI</div>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        Claim Rewards
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: "Purchase", amount: "$75,000", date: "2024-01-15", status: "Completed" },
                    { type: "Distribution", amount: "$450", date: "2024-01-10", status: "Completed" },
                    { type: "Sale", amount: "$82,000", date: "2024-01-05", status: "Completed" },
                    { type: "Purchase", amount: "$3,500", date: "2024-01-01", status: "Completed" },
                  ].map((tx, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div>
                        <div className="font-medium">{tx.type}</div>
                        <div className="text-sm text-slate-600">{tx.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{tx.amount}</div>
                        <Badge variant="secondary" className="text-xs">
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
