"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, MapPin, Clock, TrendingUp, Globe, RefreshCw, Calendar, Users } from "lucide-react"

interface ScanData {
  id: string
  timestamp: string
  scanner_ip: string
  location?: string
  pet_name: string
  pet_id: string
}

interface ScanAnalyticsProps {
  petId: string
  ownerAddress: string
}

export default function ScanAnalytics({ petId, ownerAddress }: ScanAnalyticsProps) {
  const [scanHistory, setScanHistory] = useState<ScanData[]>([])
  const [totalScans, setTotalScans] = useState(0)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadScanData()
  }, [petId])

  const loadScanData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/pet/${petId}/scan`)
      const data = await response.json()

      if (data.success) {
        setScanHistory(data.scans)
        setTotalScans(data.totalCount)
      }
    } catch (error) {
      console.error("Error loading scan data:", error)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await loadScanData()
    setRefreshing(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getLocationDisplay = (ip: string, location?: string) => {
    if (location) return location
    // Simple IP geolocation display (in production, use proper geolocation service)
    return `IP: ${ip.slice(0, 8)}...`
  }

  const getRecentScansCount = () => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    return scanHistory.filter((scan) => new Date(scan.timestamp) > oneDayAgo).length
  }

  if (loading) {
    return (
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalScans}</p>
                <p className="text-sm text-gray-600">Total Scans</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{getRecentScansCount()}</p>
                <p className="text-sm text-gray-600">Last 24 Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{new Set(scanHistory.map((s) => s.scanner_ip)).size}</p>
                <p className="text-sm text-gray-600">Unique Scanners</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scan History */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Recent Scan Activity
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={refreshing}
              className="flex items-center gap-2 bg-transparent"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {scanHistory.length === 0 ? (
            <div className="text-center py-8">
              <Eye className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No scans recorded yet</p>
              <p className="text-sm text-gray-400 mt-1">
                QR code scans will appear here when someone accesses your pet's emergency information
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {scanHistory.slice(0, 10).map((scan) => (
                <div key={scan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Eye className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">QR Code Scanned</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-3 w-3" />
                        {formatDate(scan.timestamp)}
                        <MapPin className="h-3 w-3 ml-2" />
                        {getLocationDisplay(scan.scanner_ip, scan.location)}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    <Globe className="h-3 w-3 mr-1" />
                    Emergency Access
                  </Badge>
                </div>
              ))}

              {scanHistory.length > 10 && (
                <div className="text-center pt-4">
                  <Button variant="outline" size="sm">
                    View All {totalScans} Scans
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
