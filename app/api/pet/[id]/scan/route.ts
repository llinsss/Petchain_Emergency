import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"
import { headers } from "next/headers"

/**
 * API endpoint to log QR code scans
 * POST /api/pet/[id]/scan
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const petId = params.id
    const headersList = headers()
    const forwardedFor = headersList.get("x-forwarded-for")
    const realIp = headersList.get("x-real-ip")
    const scannerIp = forwardedFor?.split(",")[0] || realIp || "127.0.0.1"

    // Get optional data from request body
    const body = await request.json().catch(() => ({}))
    const { scannerAddress, location } = body

    // Log the scan
    const scanLog = await DatabaseService.logScan(petId, scannerIp, scannerAddress, location)

    // Get cached pet data to check if we should send notification
    const petData = await DatabaseService.getCachedPetData(petId)

    if (petData) {
      // TODO: Send push notification to owner
      console.log(`QR scan logged for pet ${petData.name} (${petId})`)
    }

    return NextResponse.json({
      success: true,
      scanId: scanLog.id,
      timestamp: scanLog.timestamp,
    })
  } catch (error) {
    console.error("Error logging scan:", error)
    return NextResponse.json({ error: "Failed to log scan" }, { status: 500 })
  }
}

/**
 * Get scan history for a pet (owner only)
 * GET /api/pet/[id]/scan
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const petId = params.id
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    // TODO: Verify owner authorization
    const scanHistory = await DatabaseService.getScanHistory(petId, limit)
    const scanCount = await DatabaseService.getScanCount(petId)

    return NextResponse.json({
      success: true,
      scans: scanHistory,
      totalCount: scanCount,
    })
  } catch (error) {
    console.error("Error fetching scan history:", error)
    return NextResponse.json({ error: "Failed to fetch scan history" }, { status: 500 })
  }
}
