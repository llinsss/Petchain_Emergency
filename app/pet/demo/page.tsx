import EmergencyTagAccess from "@/components/emergency-tag-access"

export default function DemoPage() {
  return (
    <EmergencyTagAccess petId="demo" isOwner={false} contractAddress="0x1234567890123456789012345678901234567890" />
  )
}
