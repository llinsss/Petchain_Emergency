import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Plus,
  QrCode,
  Eye,
  Settings,
  Bell,
  TrendingUp,
  Shield,
  Calendar,
  MapPin,
  Stethoscope,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  // Mock data - in production, this would come from the database/blockchain
  const pets = [
    {
      id: "1",
      name: "Buddy",
      breed: "Golden Retriever",
      age: 3,
      scanCount: 47,
      lastScan: "2 hours ago",
      medicalDataPublic: true,
    },
    {
      id: "2",
      name: "Luna",
      breed: "Persian Cat",
      age: 2,
      scanCount: 23,
      lastScan: "1 day ago",
      medicalDataPublic: false,
    },
  ]

  const recentActivity = [
    {
      id: "1",
      type: "scan",
      petName: "Buddy",
      message: "QR code scanned in Central Park",
      timestamp: "2 hours ago",
      location: "New York, NY",
    },
    {
      id: "2",
      type: "update",
      petName: "Luna",
      message: "Medical data updated",
      timestamp: "1 day ago",
      location: "Dashboard",
    },
    {
      id: "3",
      type: "scan",
      petName: "Buddy",
      message: "Emergency access by veterinarian",
      timestamp: "3 days ago",
      location: "Animal Hospital",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-pink-500" />
              <span className="text-2xl font-bold text-gray-900">PetChain</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/setup">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Setup
                </Button>
              </Link>
              <Button size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pet Dashboard</h1>
            <p className="text-gray-600">Manage your pets' profiles and emergency access</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Pet
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Heart className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{pets.length}</p>
                  <p className="text-sm text-gray-600">Registered Pets</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Eye className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {pets.reduce((sum, pet) => sum + pet.scanCount, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total QR Scans</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">100%</p>
                  <p className="text-sm text-gray-600">Data Security</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">24/7</p>
                  <p className="text-sm text-gray-600">Emergency Access</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pet Profiles */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Your Pets</h2>
            {pets.map((pet) => (
              <Card
                key={pet.id}
                className="shadow-lg border-0 bg-white/80 backdrop-blur hover:shadow-xl transition-shadow"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                        {pet.name.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{pet.name}</CardTitle>
                        <p className="text-gray-600">
                          {pet.breed} • {pet.age} years old
                        </p>
                      </div>
                    </div>
                    <Badge variant={pet.medicalDataPublic ? "default" : "secondary"}>
                      {pet.medicalDataPublic ? (
                        <>
                          <Eye className="h-3 w-3 mr-1" />
                          Public
                        </>
                      ) : (
                        <>
                          <Shield className="h-3 w-3 mr-1" />
                          Private
                        </>
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-500" />
                      <span>{pet.scanCount} scans</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-500" />
                      <span>Last: {pet.lastScan}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/pet/${pet.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <QrCode className="h-4 w-4 mr-2" />
                        View QR
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur border-dashed border-gray-300 hover:border-blue-400 transition-colors">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Another Pet</h3>
                  <p className="text-gray-600 mb-4">Protect more of your furry family members</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Register Pet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Recent Activity</h2>
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-500" />
                  Activity Feed
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-full">
                      {activity.type === "scan" ? (
                        <Eye className="h-4 w-4 text-blue-600" />
                      ) : activity.type === "update" ? (
                        <Stethoscope className="h-4 w-4 text-green-600" />
                      ) : (
                        <Bell className="h-4 w-4 text-orange-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.petName}</p>
                      <p className="text-sm text-gray-600">{activity.message}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <Calendar className="h-3 w-3" />
                        {activity.timestamp}
                        <MapPin className="h-3 w-3 ml-2" />
                        {activity.location}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="text-center pt-4">
                  <Button variant="outline" size="sm">
                    View All Activity
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate New QR Code
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Stethoscope className="h-4 w-4 mr-2" />
                  Update Medical Info
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Bell className="h-4 w-4 mr-2" />
                  Notification Settings
                </Button>
                <Link href="/setup">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Settings className="h-4 w-4 mr-2" />
                    Setup Guide
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
