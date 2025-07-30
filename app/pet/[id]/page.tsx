import EmergencyTagAccess from "@/components/emergency-tag-access"

interface PageProps {
  params: {
    id: string
  }
}

export default function PetEmergencyPage({ params }: PageProps) {
  // In a real app, you would determine if the current user is the owner
  // by checking their wallet address against the pet's owner in the contract
  const isOwner = false // This would be determined by wallet connection

  return (
    <EmergencyTagAccess
      petId={params.id}
      isOwner={isOwner}
      contractAddress={process.env.NEXT_PUBLIC_PETCHAIN_CONTRACT_ADDRESS}
    />
  )
}
