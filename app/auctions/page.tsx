import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Gavel, TrendingUp } from "lucide-react"

export default function AuctionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Live Auctions</h1>
          <p className="text-slate-600">Bid on premium title-backed properties</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample auction items */}
          {[1, 2, 3, 4, 5, 6].map((id) => (
            <Card key={id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-slate-100 relative">
                <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                  <Clock className="w-3 h-3 mr-1" />
                  2h 15m left
                </Badge>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Gavel className="w-12 h-12 text-slate-400" />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">Property #{id}</CardTitle>
                <p className="text-sm text-slate-600">Premium residential title</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Current Bid</span>
                    <span className="font-bold text-lg">${(50000 + id * 10000).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Reserve</span>
                    <span className="text-sm">${(45000 + id * 10000).toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Place Bid</Button>
                    <Button variant="outline" size="icon">
                      <TrendingUp className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
