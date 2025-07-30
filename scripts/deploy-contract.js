/**
 * Deployment script for PetChain smart contract
 * Run with: node scripts/deploy-contract.js
 */

const { ethers, network, run } = require("hardhat")
const fs = require("fs")
const path = require("path")

async function main() {
  console.log("🚀 Deploying PetChain smart contract...")

  // Get the contract factory
  const PetChain = await ethers.getContractFactory("PetChain")

  // Deploy the contract
  console.log("📦 Deploying contract...")
  const petChain = await PetChain.deploy()

  // Wait for deployment to complete
  await petChain.waitForDeployment()

  const contractAddress = await petChain.getAddress()
  console.log("✅ PetChain deployed to:", contractAddress)

  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    network: network.name,
    chainId: network.config.chainId,
    deployedAt: new Date().toISOString(),
    deployer: (await ethers.getSigners())[0].address,
  }

  // Write deployment info to file
  const deploymentPath = path.join(__dirname, "../deployments", `${network.name}.json`)
  fs.mkdirSync(path.dirname(deploymentPath), { recursive: true })
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2))

  console.log("📄 Deployment info saved to:", deploymentPath)

  // Update .env.local file
  const envPath = path.join(__dirname, "../.env.local")
  let envContent = ""

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf8")
  }

  // Update or add contract address
  const contractAddressLine = `NEXT_PUBLIC_PETCHAIN_CONTRACT_ADDRESS=${contractAddress}`

  if (envContent.includes("NEXT_PUBLIC_PETCHAIN_CONTRACT_ADDRESS=")) {
    envContent = envContent.replace(/NEXT_PUBLIC_PETCHAIN_CONTRACT_ADDRESS=.*/, contractAddressLine)
  } else {
    envContent += `\n${contractAddressLine}\n`
  }

  fs.writeFileSync(envPath, envContent)
  console.log("🔧 Updated .env.local with contract address")

  // Verify contract if on a public network
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("🔍 Verifying contract on block explorer...")
    try {
      await run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      })
      console.log("✅ Contract verified successfully")
    } catch (error) {
      console.log("❌ Contract verification failed:", error.message)
    }
  }

  console.log("\n🎉 Deployment completed successfully!")
  console.log(`📋 Contract Address: ${contractAddress}`)
  console.log(`🌐 Network: ${network.name}`)
  console.log(`⛽ Gas Used: ${(await petChain.deploymentTransaction()).gasLimit}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error)
    process.exit(1)
  })
