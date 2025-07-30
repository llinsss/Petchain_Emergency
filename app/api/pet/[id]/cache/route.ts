import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"

/**
 * API endpoint to cache pet data from blockchain
 * POST /api/pet/[id]/cache
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const petId = params.id
    const petData = await request.json()

    // Validate required fields
    const requiredFields = ["ownerAddress", "name", "breed", "age"]
    for (const field of requiredFields) {
      if (!petData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Cache the pet data
    const cachedPet = await DatabaseService.cachePetData({
      petId,
      ownerAddress: petData.ownerAddress,
      name: petData.name,
      breed: petData.breed,
      age: petData.age,
      emergencyContact: petData.emergencyContact || "",
      emergencyMessage: petData.emergencyMessage || "",
      medicalDataPublic: petData.medicalDataPublic || false,
    })

    return NextResponse.json({
      success: true,
      pet: cachedPet,
    })
  } catch (error) {
    console.error("Error caching pet data:", error)
    return NextResponse.json({ error: "Failed to cache pet data" }, { status: 500 })
  }
}

/**
 * Get cached pet data
 * GET /api/pet/[id]/cache
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const petId = params.id
    const cachedPet = await DatabaseService.getCachedPetData(petId)

    if (!cachedPet) {
      return NextResponse.json({ error: "Pet not found in cache" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      pet: cachedPet,
    })
  } catch (error) {
    console.error("Error fetching cached pet data:", error)
    return NextResponse.json({ error: "Failed to fetch cached pet data" }, { status: 500 })
  }
}
