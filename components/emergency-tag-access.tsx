"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Heart,
  Shield,
  QrCode,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  AlertTriangle,
  Stethoscope,
  Bell,
  Save,
  Copy,
  CheckCircle,
} from "lucide-react"
import { QRCodeCanvas } from 'qrcode.react';
import Web3 from "web3"
import ScanAnalytics from "./scan-analytics"

// Contract ABI (simplified for demo - in production, import from compiled contract)
const CONTRACT_ABI = [
  {
    inputs: [{ name: "petId", type: "uint256" }],
    name: "getPublicPetInfo",
    outputs: [
      { name: "name", type: "string" },
      { name: "breed", type: "string" },
      { name: "age", type: "uint8" },
      { name: "photoHash", type: "string" },
      { name: "emergencyContact", type: "string" },
      { name: "emergencyMessage", type: "string" },
      { name: "medicalDataPublic", type: "bool" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "petId", type: "uint256" },
      { name: "emergencyContact", type: "string" },
      { name: "emergencyMessage", type: "string" },
    ],
    name: "updatePublicProfile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "petId", type: "uint256" },
      { name: "isPublic", type: "bool" },
    ],
    name: "toggleMedicalDataVisibility",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "petId", type: "uint256" }],
    name: "getMedicalData",
    outputs: [
      { name: "allergies", type: "string" },
      { name: "medications", type: "string" },
      { name: "conditions", type: "string" },
      { name: "vetContact", type: "string" },
      { name: "lastCheckup", type: "string" },
    ],
    stateMutability: "view",
    type: "function",
  },
]

interface PetProfile {
  name: string
  breed: string
  age: number
  photoHash: string
  emergencyContact: string
  emergencyMessage: string
  medicalDataPublic: boolean
}

interface MedicalData {
  allergies: string
  medications: string
  conditions: string
  vetContact: string
  lastCheckup: string
}

interface EmergencyTagAccessProps {
  petId?: string
  isOwner?: boolean
  contractAddress?: string
}

export default function EmergencyTagAccess({
  petId = "1",
  isOwner = true,
  contractAddress = "0x1234567890123456789012345678901234567890",
}: EmergencyTagAccessProps) {
  const [web3, setWeb3] = useState<Web3 | null>(null)
  const [contract, setContract] = useState<any>(null)
  const [account, setAccount] = useState<string>("")
  const [petProfile, setPetProfile] = useState<PetProfile | null>(null)
  const [medicalData, setMedicalData] = useState<MedicalData | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [scanCount, setScanCount] = useState(0)
  const [qrCopied, setQrCopied] = useState(false)

  // Form states for editing
  const [editingProfile, setEditingProfile] = useState(false)
  const [formData, setFormData] = useState({
    emergencyContact: "",
    emergencyMessage: "",
    medicalDataPublic: false,
  })

  // Initialize Web3 and contract
  useEffect(() => {
    initializeWeb3()
  }, [])

  // Load pet data when contract is ready
  useEffect(() => {
    if (contract && petId) {
      loadPetData()
    }
  }, [contract, petId])

  const initializeWeb3 = async () => {
    try {
      // Check if MetaMask is installed
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const web3Instance = new Web3((window as any).ethereum)
        setWeb3(web3Instance)

        // Request account access
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        })
        setAccount(accounts[0])

        // Initialize contract
        const contractInstance = new web3Instance.eth.Contract(CONTRACT_ABI, contractAddress)
        setContract(contractInstance)
      } else {
        setError("Please install MetaMask to interact with PetChain")
      }
    } catch (err) {
      setError("Failed to connect to wallet")
      console.error(err)
    }
  }

  const logScan = async (petId: string, scannerAddress?: string) => {
    try {
      await fetch(`/api/pet/${petId}/scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scannerAddress,
          location: "QR Code Access",
        }),
      })
    } catch (error) {
      console.error("Failed to log scan:", error)
    }
  }

  const loadPetData = async () => {
    if (!contract || !petId) return

    setLoading(true)
    setError("")

    try {
      // Log the scan if this is not the owner viewing
      if (!isOwner) {
        await logScan(petId, account)
      }

      // Load public pet information
      const publicInfo = await contract.methods.getPublicPetInfo(petId).call({
        from: account,
      })

      const profile: PetProfile = {
        name: publicInfo.name,
        breed: publicInfo.breed,
        age: Number.parseInt(publicInfo.age),
        photoHash: publicInfo.photoHash,
        emergencyContact: publicInfo.emergencyContact,
        emergencyMessage: publicInfo.emergencyMessage,
        medicalDataPublic: publicInfo.medicalDataPublic,
      }

      setPetProfile(profile)
      setFormData({
        emergencyContact: profile.emergencyContact,
        emergencyMessage: profile.emergencyMessage,
        medicalDataPublic: profile.medicalDataPublic,
      })

      // Try to load medical data if accessible
      if (profile.medicalDataPublic || isOwner) {
        try {
          const medical = await contract.methods.getMedicalData(petId).call({
            from: account,
          })

          setMedicalData({
            allergies: medical.allergies,
            medications: medical.medications,
            conditions: medical.conditions,
            vetContact: medical.vetContact,
            lastCheckup: medical.lastCheckup,
          })
        } catch (medicalErr) {
          console.log("Medical data not accessible")
        }
      }

      // Simulate scan count for demo
      setScanCount(Math.floor(Math.random() * 50) + 1)

      // Cache the pet data in the database
      if (publicInfo) {
        try {
          await fetch(`/api/pet/${petId}/cache`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ownerAddress: account, // This should be the actual owner address from contract
              name: publicInfo.name,
              breed: publicInfo.breed,
              age: Number.parseInt(publicInfo.age),
              emergencyContact: publicInfo.emergencyContact,
              emergencyMessage: publicInfo.emergencyMessage,
              medicalDataPublic: publicInfo.medicalDataPublic,
            }),
          })
        } catch (cacheError) {
          console.log("Failed to cache pet data:", cacheError)
        }
      }
    } catch (err) {
      setError("Failed to load pet data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!contract || !petId || !isOwner) return

    setSaving(true)
    setError("")
    setSuccess("")

    try {
      // Update public profile
      await contract.methods
        .updatePublicProfile(petId, formData.emergencyContact, formData.emergencyMessage)
        .send({ from: account })

      // Toggle medical data visibility if changed
      if (formData.medicalDataPublic !== petProfile?.medicalDataPublic) {
        await contract.methods.toggleMedicalDataVisibility(petId, formData.medicalDataPublic).send({ from: account })
      }

      setSuccess("Profile updated successfully!")
      setEditingProfile(false)
      await loadPetData() // Reload data
    } catch (err) {
      setError("Failed to update profile")
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const copyQRLink = () => {
    const qrUrl = `${window.location.origin}/pet/${petId}`
    navigator.clipboard.writeText(qrUrl)
    setQrCopied(true)
    setTimeout(() => setQrCopied(false), 2000)
  }

  const generateQRValue = () => {
    return `${window.location.origin}/pet/${petId}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Emergency Pet Access</h1>
          </div>
          <p className="text-gray-600">
            {isOwner ? "Manage your pet's emergency information" : "Emergency pet information"}
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pet Profile Card */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                Pet Profile
                {isOwner && (
                  <Badge variant="secondary" className="ml-auto">
                    <Eye className="h-3 w-3 mr-1" />
                    {scanCount} scans
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {petProfile && (
                <>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                      {petProfile.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{petProfile.name}</h3>
                      <p className="text-gray-600">
                        {petProfile.breed} • {petProfile.age} years old
                      </p>
                    </div>
                  </div>

                  {!editingProfile ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Phone className="h-4 w-4 text-blue-500 mt-1" />
                        <div>
                          <p className="font-medium text-gray-900">Emergency Contact</p>
                          <p className="text-gray-600">{petProfile.emergencyContact || "Not set"}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-green-500 mt-1" />
                        <div>
                          <p className="font-medium text-gray-900">Emergency Message</p>
                          <p className="text-gray-600">{petProfile.emergencyMessage || "Not set"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-red-500" />
                        <span className="font-medium text-gray-900">Medical Data:</span>
                        <Badge variant={petProfile.medicalDataPublic ? "default" : "secondary"}>
                          {petProfile.medicalDataPublic ? (
                            <>
                              <Eye className="h-3 w-3 mr-1" />
                              Public
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3 mr-1" />
                              Private
                            </>
                          )}
                        </Badge>
                      </div>

                      {isOwner && (
                        <Button onClick={() => setEditingProfile(true)} className="w-full mt-4">
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="emergencyContact">Emergency Contact</Label>
                        <Input
                          id="emergencyContact"
                          value={formData.emergencyContact}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              emergencyContact: e.target.value,
                            }))
                          }
                          placeholder="Phone number or contact info"
                        />
                      </div>

                      <div>
                        <Label htmlFor="emergencyMessage">Emergency Message</Label>
                        <Textarea
                          id="emergencyMessage"
                          value={formData.emergencyMessage}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              emergencyMessage: e.target.value,
                            }))
                          }
                          placeholder="Special instructions for emergencies"
                          rows={3}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="medicalPublic">Make medical data public</Label>
                        <Switch
                          id="medicalPublic"
                          checked={formData.medicalDataPublic}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                              ...prev,
                              medicalDataPublic: checked,
                            }))
                          }
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={handleSaveProfile} disabled={saving} className="flex-1">
                          {saving ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingProfile(false)
                            setFormData({
                              emergencyContact: petProfile.emergencyContact,
                              emergencyMessage: petProfile.emergencyMessage,
                              medicalDataPublic: petProfile.medicalDataPublic,
                            })
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* QR Code Card */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-blue-500" />
                Emergency QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-white rounded-lg shadow-inner">
                  <QRCodeCanvas value="https://example.com" />


                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">Scan this QR code to access emergency pet information</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyQRLink}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    {qrCopied ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Link
                      </>
                    )}
                  </Button>
                </div>

                {isOwner && (
                  <Alert className="border-blue-200 bg-blue-50">
                    <Bell className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      You'll receive notifications when someone scans this QR code
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Medical Data Card */}
        {medicalData && (petProfile?.medicalDataPublic || isOwner) && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-red-500" />
                Medical Information
                <Badge variant={petProfile?.medicalDataPublic ? "default" : "secondary"}>
                  {petProfile?.medicalDataPublic ? "Public" : "Owner Only"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Allergies</Label>
                <p className="text-gray-900 mt-1">{medicalData.allergies || "None reported"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Current Medications</Label>
                <p className="text-gray-900 mt-1">{medicalData.medications || "None"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Medical Conditions</Label>
                <p className="text-gray-900 mt-1">{medicalData.conditions || "None reported"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Veterinarian Contact</Label>
                <p className="text-gray-900 mt-1">{medicalData.vetContact || "Not provided"}</p>
              </div>
              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-700">Last Checkup</Label>
                <p className="text-gray-900 mt-1">{medicalData.lastCheckup || "Not recorded"}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {isOwner && petProfile && <ScanAnalytics petId={petId} ownerAddress={account} />}

        {/* Connection Status */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${web3 ? "bg-green-500" : "bg-red-500"}`}></div>
                <span className="text-sm text-gray-600">
                  {web3 ? `Connected to ${account.slice(0, 6)}...${account.slice(-4)}` : "Not connected"}
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                Blockchain Secured
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
