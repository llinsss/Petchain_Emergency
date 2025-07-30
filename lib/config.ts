/**
 * Configuration file for PetChain application
 * Manages environment variables and network settings
 */

export interface NetworkConfig {
  chainId: number
  name: string
  rpcUrl: string
  blockExplorer: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
}

// Network configurations for different blockchains
export const NETWORKS: Record<string, NetworkConfig> = {
  ethereum: {
    chainId: 1,
    name: "Ethereum Mainnet",
    rpcUrl: "https://mainnet.infura.io/v3/YOUR_INFURA_KEY",
    blockExplorer: "https://etherscan.io",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
  },
  polygon: {
    chainId: 137,
    name: "Polygon Mainnet",
    rpcUrl: "https://polygon-rpc.com",
    blockExplorer: "https://polygonscan.com",
    nativeCurrency: {
      name: "Polygon",
      symbol: "MATIC",
      decimals: 18,
    },
  },
  bsc: {
    chainId: 56,
    name: "BNB Smart Chain",
    rpcUrl: "https://bsc-dataseed.binance.org",
    blockExplorer: "https://bscscan.com",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
  },
  localhost: {
    chainId: 31337,
    name: "Localhost",
    rpcUrl: "http://127.0.0.1:8545",
    blockExplorer: "http://localhost:8545",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
  },
}

// Application configuration
export const CONFIG = {
  // Contract Configuration
  CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_PETCHAIN_CONTRACT_ADDRESS || "",
  CHAIN_ID: Number.parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "1"),
  NETWORK_NAME: process.env.NEXT_PUBLIC_NETWORK_NAME || "ethereum",
  RPC_URL: process.env.NEXT_PUBLIC_RPC_URL || "",

  // IPFS Configuration
  IPFS_GATEWAY: process.env.NEXT_PUBLIC_IPFS_GATEWAY || "https://ipfs.io/ipfs/",
  PINATA_API_KEY: process.env.PINATA_API_KEY || "",
  PINATA_SECRET: process.env.PINATA_SECRET_API_KEY || "",

  // Neon Database Configuration
  DATABASE_URL: process.env.DATABASE_URL || "",

  // AWS Configuration
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET_NAME || "",
  AWS_REGION: process.env.AWS_REGION || "us-east-1",

  // Authentication Configuration
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "",

  // Email Configuration
  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: Number.parseInt(process.env.SMTP_PORT || "587"),
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",

  // Blockchain RPC URLs
  ETHEREUM_RPC_URL: process.env.ETHEREUM_RPC_URL || "",
  SEPOLIA_RPC_URL: process.env.SEPOLIA_RPC_URL || "",
  POLYGON_RPC_URL: process.env.POLYGON_RPC_URL || "",
  MUMBAI_RPC_URL: process.env.MUMBAI_RPC_URL || "",
  BSC_RPC_URL: process.env.BSC_RPC_URL || "",
  BSC_TESTNET_RPC_URL: process.env.BSC_TESTNET_RPC_URL || "",

  // API Keys
  ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY || "",
  POLYGONSCAN_API_KEY: process.env.POLYGONSCAN_API_KEY || "",
  BSCSCAN_API_KEY: process.env.BSCSCAN_API_KEY || "",

  // Development
  PRIVATE_KEY: process.env.PRIVATE_KEY || "",
  REPORT_GAS: process.env.REPORT_GAS || "",

  // Application Settings
  APP_NAME: "PetChain",
  APP_DESCRIPTION: "Decentralized Pet Medical Records Platform",
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || "https://petchain.app",
} as const

// Get current network configuration
export function getCurrentNetwork(): NetworkConfig {
  const networkName = CONFIG.NETWORK_NAME
  const network = NETWORKS[networkName]

  if (!network) {
    throw new Error(`Unsupported network: ${networkName}`)
  }

  return network
}

// Validate required environment variables
export function validateConfig(): void {
  const requiredVars = ["NEXT_PUBLIC_PETCHAIN_CONTRACT_ADDRESS", "NEXT_PUBLIC_CHAIN_ID", "NEXT_PUBLIC_NETWORK_NAME"]

  const missing = requiredVars.filter((varName) => !process.env[varName])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }

  // Validate contract address format
  if (CONFIG.CONTRACT_ADDRESS && !CONFIG.CONTRACT_ADDRESS.match(/^0x[a-fA-F0-9]{40}$/)) {
    throw new Error("Invalid contract address format")
  }
}

// Development helpers
export const isDevelopment = process.env.NODE_ENV === "development"
export const isProduction = process.env.NODE_ENV === "production"
export const isLocalNetwork = CONFIG.NETWORK_NAME === "localhost"
