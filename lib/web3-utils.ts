import Web3 from "web3"

export interface Web3Config {
  contractAddress: string
  chainId: number
  rpcUrl: string
}

export class PetChainWeb3 {
  private web3: Web3
  private contract: any
  private config: Web3Config

  constructor(config: Web3Config) {
    this.config = config
    this.web3 = new Web3(config.rpcUrl)
  }

  async connectWallet(): Promise<string> {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        // Request account access
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        })

        // Switch to correct network if needed
        await this.switchNetwork()

        this.web3 = new Web3((window as any).ethereum)
        return accounts[0]
      } catch (error) {
        throw new Error("Failed to connect wallet")
      }
    } else {
      throw new Error("MetaMask not found")
    }
  }

  private async switchNetwork(): Promise<void> {
    try {
      await (window as any).ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${this.config.chainId.toString(16)}` }],
      })
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        throw new Error("Please add the network to MetaMask")
      }
      throw switchError
    }
  }

  async getPetProfile(petId: string): Promise<any> {
    if (!this.contract) {
      throw new Error("Contract not initialized")
    }

    try {
      const result = await this.contract.methods.getPublicPetInfo(petId).call()
      return {
        name: result.name,
        breed: result.breed,
        age: Number.parseInt(result.age),
        photoHash: result.photoHash,
        emergencyContact: result.emergencyContact,
        emergencyMessage: result.emergencyMessage,
        medicalDataPublic: result.medicalDataPublic,
      }
    } catch (error) {
      throw new Error("Failed to fetch pet profile")
    }
  }

  async updatePublicProfile(
    petId: string,
    emergencyContact: string,
    emergencyMessage: string,
    fromAddress: string,
  ): Promise<string> {
    if (!this.contract) {
      throw new Error("Contract not initialized")
    }

    try {
      const tx = await this.contract.methods
        .updatePublicProfile(petId, emergencyContact, emergencyMessage)
        .send({ from: fromAddress })

      return tx.transactionHash
    } catch (error) {
      throw new Error("Failed to update profile")
    }
  }

  async toggleMedicalDataVisibility(petId: string, isPublic: boolean, fromAddress: string): Promise<string> {
    if (!this.contract) {
      throw new Error("Contract not initialized")
    }

    try {
      const tx = await this.contract.methods.toggleMedicalDataVisibility(petId, isPublic).send({ from: fromAddress })

      return tx.transactionHash
    } catch (error) {
      throw new Error("Failed to toggle medical data visibility")
    }
  }

  // Utility function to format addresses
  static formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Utility function to validate Ethereum address
  static isValidAddress(address: string): boolean {
    return Web3.utils.isAddress(address)
  }
}

// Default configuration for different networks
export const NETWORK_CONFIGS: Record<string, Web3Config> = {
  ethereum: {
    contractAddress: "0x1234567890123456789012345678901234567890",
    chainId: 1,
    rpcUrl: "https://mainnet.infura.io/v3/YOUR_INFURA_KEY",
  },
  polygon: {
    contractAddress: "0x1234567890123456789012345678901234567890",
    chainId: 137,
    rpcUrl: "https://polygon-rpc.com",
  },
  bsc: {
    contractAddress: "0x1234567890123456789012345678901234567890",
    chainId: 56,
    rpcUrl: "https://bsc-dataseed.binance.org",
  },
}
