"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, Wallet, Database, Globe, Settings, Copy, ExternalLink } from "lucide-react"
import { CONFIG, validateConfig, getCurrentNetwork } from "@/lib/config"

interface SetupStep {
  id: string
  title: string
  description: string
  status: "pending" | "completed" | "error"
  required: boolean
}

export default function SetupWizard() {
  const [steps, setSteps] = useState<SetupStep[]>([
    {
      id: "env-vars",
      title: "Environment Variables",
      description: "Configure required environment variables",
      status: "pending",
      required: true,
    },
    {
      id: "wallet-connection",
      title: "Wallet Connection",
      description: "Connect to MetaMask wallet",
      status: "pending",
      required: true,
    },
    {
      id: "network-config",
      title: "Network Configuration",
      description: "Verify blockchain network settings",
      status: "pending",
      required: true,
    },
    {
      id: "contract-deployment",
      title: "Smart Contract",
      description: "Deploy or connect to PetChain contract",
      status: "pending",
      required: true,
    },
  ])

  const [walletAddress, setWalletAddress] = useState<string>("")
  const [contractAddress, setContractAddress] = useState<string>(CONFIG.CONTRACT_ADDRESS)
  const [networkInfo, setNetworkInfo] = useState<any>(null)

  useEffect(() => {
    checkSetupStatus()
  }, [])

  const checkSetupStatus = async () => {
    const updatedSteps = [...steps]

    // Check environment variables
    try {
      validateConfig()
      updatedSteps[0].status = "completed"
    } catch (error) {
      updatedSteps[0].status = "error"
    }

    // Check wallet connection
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: "eth_accounts",
        })
        if (accounts.length > 0) {
          setWalletAddress(accounts[0])
          updatedSteps[1].status = "completed"
        }
      } catch (error) {
        updatedSteps[1].status = "error"
      }
    }

    // Check network configuration
    try {
      const network = getCurrentNetwork()
      setNetworkInfo(network)
      updatedSteps[2].status = "completed"
    } catch (error) {
      updatedSteps[2].status = "error"
    }

    // Check contract
    if (CONFIG.CONTRACT_ADDRESS && CONFIG.CONTRACT_ADDRESS !== "0x1234567890123456789012345678901234567890") {
      updatedSteps[3].status = "completed"
    }

    setSteps(updatedSteps)
  }

  const connectWallet = async () => {
    try {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        })
        setWalletAddress(accounts[0])
        await checkSetupStatus()
      } else {
        alert("Please install MetaMask to continue")
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
    }
  }

  const getStepColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-green-200 bg-green-50"
      case "error":
        return "border-red-200 bg-red-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const allStepsCompleted = steps.every((step) => step.status === "completed")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Settings className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">PetChain Setup</h1>
          </div>
          <p className="text-gray-600">Complete these steps to get PetChain running</p>
        </div>

        {/* Progress Overview */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Setup Progress
              <Badge variant={allStepsCompleted ? "default" : "secondary"}>
                {steps.filter((s) => s.status === "completed").length} / {steps.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.id} className={`p-4 rounded-lg border-2 ${getStepColor(step.status)}`}>
                  <div className="flex items-center gap-3">
                    {getStepIcon(step.status)}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                    {step.required && (
                      <Badge variant="outline" className="text-xs">
                        Required
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Environment Variables */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-500" />
              Environment Variables
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Create a <code>.env.local</code> file in your project root with the following variables:
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Contract Address</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("NEXT_PUBLIC_PETCHAIN_CONTRACT_ADDRESS=")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <code className="text-xs text-gray-700">
                  NEXT_PUBLIC_PETCHAIN_CONTRACT_ADDRESS={CONFIG.CONTRACT_ADDRESS || "your_contract_address"}
                </code>
              </div>

              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Chain ID</Label>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard("NEXT_PUBLIC_CHAIN_ID=")}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <code className="text-xs text-gray-700">NEXT_PUBLIC_CHAIN_ID={CONFIG.CHAIN_ID}</code>
              </div>

              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Network Name</Label>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard("NEXT_PUBLIC_NETWORK_NAME=")}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <code className="text-xs text-gray-700">NEXT_PUBLIC_NETWORK_NAME={CONFIG.NETWORK_NAME}</code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Wallet Connection */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-purple-500" />
              Wallet Connection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {walletAddress ? (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-green-800">Wallet Connected</p>
                  <p className="text-sm text-green-600">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-gray-600">Connect your MetaMask wallet to interact with PetChain</p>
                <Button onClick={connectWallet} className="w-full">
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect MetaMask
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 3: Network Configuration */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-500" />
              Network Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {networkInfo ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-green-800">Network Configured</p>
                    <p className="text-sm text-green-600">{networkInfo.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-gray-600">Chain ID</Label>
                    <p className="font-medium">{networkInfo.chainId}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Currency</Label>
                    <p className="font-medium">{networkInfo.nativeCurrency.symbol}</p>
                  </div>
                </div>
              </div>
            ) : (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  Network configuration not found. Please check your environment variables.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Step 4: Contract Deployment */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-orange-500" />
              Smart Contract
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="contractAddress">Contract Address</Label>
              <div className="flex gap-2">
                <Input
                  id="contractAddress"
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  placeholder="0x..."
                  className="flex-1"
                />
                <Button variant="outline" onClick={() => copyToClipboard(contractAddress)} disabled={!contractAddress}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              {contractAddress && contractAddress !== "0x1234567890123456789012345678901234567890" ? (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div className="flex-1">
                    <p className="font-medium text-green-800">Contract Configured</p>
                    <p className="text-sm text-green-600">Ready to interact with PetChain</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`${networkInfo?.blockExplorer}/address/${contractAddress}`, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    Deploy the PetChain smart contract or enter an existing contract address.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Completion Status */}
        {allStepsCompleted && (
          <Card className="shadow-lg border-0 bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <CheckCircle className="h-12 w-12 mx-auto" />
                <h2 className="text-2xl font-bold">Setup Complete! 🎉</h2>
                <p className="text-green-100">
                  PetChain is now configured and ready to use. You can start managing pet profiles and emergency access.
                </p>
                <Button variant="secondary" className="mt-4" onClick={() => (window.location.href = "/dashboard")}>
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
