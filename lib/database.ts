import { neon } from "@neondatabase/serverless"

// Initialize Neon database connection with fallback for development
const getDatabaseConnection = () => {
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    // For build time, we'll use a mock connection
    // This allows the build to complete without requiring a real database
    console.warn('DATABASE_URL not found. Using mock database for build.')
    return null
  }
  
  return neon(databaseUrl)
}

const sql = getDatabaseConnection()

export interface User {
  id: string
  email: string
  wallet_address: string
  created_at: Date
  updated_at: Date
}

export interface PetCache {
  id: string
  pet_id: string
  owner_address: string
  name: string
  breed: string
  age: number
  emergency_contact: string
  emergency_message: string
  medical_data_public: boolean
  last_synced: Date
  created_at: Date
  updated_at: Date
}

export interface ScanLog {
  id: string
  pet_id: string
  scanner_address?: string
  scanner_ip: string
  location?: string
  timestamp: Date
}

/**
 * Database service for PetChain
 * Handles user accounts, pet data caching, and scan logging
 */
export class DatabaseService {
  /**
   * Create a new user account
   */
  static async createUser(email: string, walletAddress: string): Promise<User> {
    if (!sql) {
      // Mock response for development
      return {
        id: "mock-user-id",
        email,
        wallet_address: walletAddress,
        created_at: new Date(),
        updated_at: new Date(),
      }
    }

    const result = await sql`
      INSERT INTO users (email, wallet_address, created_at, updated_at)
      VALUES (${email}, ${walletAddress}, NOW(), NOW())
      RETURNING *
    `
    return result[0] as User
  }

  /**
   * Get user by wallet address
   */
  static async getUserByWallet(walletAddress: string): Promise<User | null> {
    if (!sql) {
      // Mock response for development
      return null
    }

    const result = await sql`
      SELECT * FROM users WHERE wallet_address = ${walletAddress} LIMIT 1
    `
    return (result[0] as User) || null
  }

  /**
   * Cache pet data from blockchain
   */
  static async cachePetData(petData: {
    petId: string
    ownerAddress: string
    name: string
    breed: string
    age: number
    emergencyContact: string
    emergencyMessage: string
    medicalDataPublic: boolean
  }): Promise<PetCache> {
    if (!sql) {
      // Mock response for development
      return {
        id: `mock-cache-${petData.petId}`,
        pet_id: petData.petId,
        owner_address: petData.ownerAddress,
        name: petData.name,
        breed: petData.breed,
        age: petData.age,
        emergency_contact: petData.emergencyContact,
        emergency_message: petData.emergencyMessage,
        medical_data_public: petData.medicalDataPublic,
        last_synced: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      }
    }

    const result = await sql`
      INSERT INTO pet_cache (
        pet_id, owner_address, name, breed, age, 
        emergency_contact, emergency_message, medical_data_public,
        last_synced, created_at, updated_at
      )
      VALUES (
        ${petData.petId}, ${petData.ownerAddress}, ${petData.name}, 
        ${petData.breed}, ${petData.age}, ${petData.emergencyContact}, 
        ${petData.emergencyMessage}, ${petData.medicalDataPublic},
        NOW(), NOW(), NOW()
      )
      ON CONFLICT (pet_id) 
      DO UPDATE SET
        name = EXCLUDED.name,
        breed = EXCLUDED.breed,
        age = EXCLUDED.age,
        emergency_contact = EXCLUDED.emergency_contact,
        emergency_message = EXCLUDED.emergency_message,
        medical_data_public = EXCLUDED.medical_data_public,
        last_synced = NOW(),
        updated_at = NOW()
      RETURNING *
    `
    return result[0] as PetCache
  }

  /**
   * Get cached pet data
   */
  static async getCachedPetData(petId: string): Promise<PetCache | null> {
    if (!sql) {
      // Mock response for development
      return null
    }

    const result = await sql`
      SELECT * FROM pet_cache WHERE pet_id = ${petId} LIMIT 1
    `
    return (result[0] as PetCache) || null
  }

  /**
   * Log QR code scan
   */
  static async logScan(petId: string, scannerIp: string, scannerAddress?: string, location?: string): Promise<ScanLog> {
    if (!sql) {
      // Mock response for development
      return {
        id: `mock-scan-${Date.now()}`,
        pet_id: petId,
        scanner_address: scannerAddress,
        scanner_ip: scannerIp,
        location,
        timestamp: new Date(),
      }
    }

    const result = await sql`
      INSERT INTO scan_logs (pet_id, scanner_address, scanner_ip, location, timestamp)
      VALUES (${petId}, ${scannerAddress}, ${scannerIp}, ${location}, NOW())
      RETURNING *
    `
    return result[0] as ScanLog
  }

  /**
   * Get scan history for a pet (owner only)
   */
  static async getScanHistory(petId: string, limit = 50): Promise<ScanLog[]> {
    if (!sql) {
      // Mock response for development
      return []
    }

    const result = await sql`
      SELECT * FROM scan_logs 
      WHERE pet_id = ${petId} 
      ORDER BY timestamp DESC 
      LIMIT ${limit}
    `
    return result as ScanLog[]
  }

  /**
   * Get scan count for a pet
   */
  static async getScanCount(petId: string): Promise<number> {
    if (!sql) {
      // Mock response for development
      return Math.floor(Math.random() * 50) + 1
    }

    const result = await sql`
      SELECT COUNT(*) as count FROM scan_logs WHERE pet_id = ${petId}
    `
    return Number(result[0].count)
  }

  /**
   * Get pets owned by a user
   */
  static async getUserPets(ownerAddress: string): Promise<PetCache[]> {
    if (!sql) {
      // Mock response for development
      return []
    }

    const result = await sql`
      SELECT * FROM pet_cache 
      WHERE owner_address = ${ownerAddress} 
      ORDER BY created_at DESC
    `
    return result as PetCache[]
  }

  /**
   * Search pets by name or breed (for emergency responders)
   */
  static async searchPets(query: string, limit = 20): Promise<PetCache[]> {
    if (!sql) {
      // Mock response for development
      return []
    }

    const result = await sql`
      SELECT * FROM pet_cache 
      WHERE (name ILIKE ${"%" + query + "%"} OR breed ILIKE ${"%" + query + "%"})
      AND medical_data_public = true
      ORDER BY name
      LIMIT ${limit}
    `
    return result as PetCache[]
  }

  /**
   * Get recent scan activity (for dashboard)
   */
  static async getRecentActivity(ownerAddress: string, limit = 10): Promise<any[]> {
    if (!sql) {
      // Mock response for development
      return []
    }

    const result = await sql`
      SELECT 
        sl.timestamp,
        sl.scanner_ip,
        sl.location,
        pc.name as pet_name,
        pc.pet_id
      FROM scan_logs sl
      JOIN pet_cache pc ON sl.pet_id = pc.pet_id
      WHERE pc.owner_address = ${ownerAddress}
      ORDER BY sl.timestamp DESC
      LIMIT ${limit}
    `
    return result
  }
}
