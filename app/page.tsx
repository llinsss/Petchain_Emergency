import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Shield, QrCode, Smartphone, Zap, ArrowRight, Star, Lock, Bell } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-pink-500" />
              <span className="text-2xl font-bold text-gray-900">PetChain</span>
              <Badge variant="secondary" className="ml-2">
                Beta
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/setup">
                <Button variant="outline">Setup</Button>
              </Link>
              <Link href="/dashboard">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge variant="outline" className="mb-4">
              🚀 Powered by Blockchain Technology
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Welcome to our platform</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Secure, decentralized pet medical records with emergency QR access. Never lose your pet's important health
              information again.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Register Your Pet
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pet/demo">
                <Button variant="outline" size="lg" className="flex items-center gap-2 bg-transparent">
                  <QrCode className="h-5 w-5" />
                  View Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image/QR Demo */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                      B
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">Buddy</h3>
                      <p className="text-gray-600">Golden Retriever • 3 years</p>
                    </div>
                  </div>
                  <div className="text-left space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Emergency Contact:</strong> +1 (555) 123-4567
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Special Notes:</strong> Friendly, loves treats, allergic to chicken
                    </p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="w-32 h-32 bg-white rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <QrCode className="h-16 w-16 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">Scan for emergency access</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose PetChain?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced blockchain technology meets pet care simplicity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Blockchain Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Your pet's data is secured on the blockchain with military-grade encryption and owner-controlled
                  access.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <QrCode className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>QR Emergency Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Instant access to critical pet information via QR codes - perfect for emergencies and lost pets.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Mobile First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Designed for mobile use with offline capabilities. Access your pet's info anywhere, anytime.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Bell className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Smart Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get notified when someone scans your pet's QR code. Track location and time for peace of mind.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle>Privacy Control</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  You control what information is public or private. Medical data visibility is always your choice.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Optimized for speed with smart caching. Access pet information instantly, even with slow connections.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How PetChain Works</h2>
            <p className="text-xl text-gray-600">Simple setup, powerful protection</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Register Your Pet</h3>
              <p className="text-gray-600">
                Create a secure profile with your pet's basic info, medical data, and emergency contacts.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Generate QR Tag</h3>
              <p className="text-gray-600">
                Get a unique QR code linked to your pet's blockchain profile. Print it for collars or tags.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Emergency Ready</h3>
              <p className="text-gray-600">
                Anyone can scan the QR code to access emergency info and contact you if your pet is found.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Pets Protected</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">QR Scans</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Emergency Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Pet Owners Say</h2>
            <p className="text-xl text-gray-600">Real stories from the PetChain community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "PetChain saved my dog's life! When Max got lost, a stranger scanned his QR tag and called me
                  immediately. The medical info helped the vet treat him quickly."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                    S
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Sarah Johnson</p>
                    <p className="text-sm text-gray-600">Dog Owner</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "As a veterinarian, I love how PetChain gives me instant access to a pet's medical history. It's
                  especially helpful in emergency situations."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    D
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Dr. Michael Chen</p>
                    <p className="text-sm text-gray-600">Veterinarian</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The peace of mind PetChain gives me is priceless. I know that if something happens to Luna, anyone
                  who finds her can get her the help she needs."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    E
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Emily Rodriguez</p>
                    <p className="text-sm text-gray-600">Cat Owner</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Protect Your Pet?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of pet owners who trust PetChain to keep their furry friends safe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/setup">
              <Button variant="outline" size="lg" className="flex items-center gap-2 bg-transparent">
                <Shield className="h-5 w-5" />
                Setup Guide
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-6 w-6 text-pink-500" />
                <span className="text-xl font-bold">PetChain</span>
              </div>
              <p className="text-gray-400">
                Decentralized pet medical records platform powered by blockchain technology.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/setup" className="hover:text-white transition-colors">
                    Setup Guide
                  </Link>
                </li>
                <li>
                  <Link href="/pet/demo" className="hover:text-white transition-colors">
                    Demo
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 PetChain. All rights reserved. Built with ❤️ for pet lovers.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
