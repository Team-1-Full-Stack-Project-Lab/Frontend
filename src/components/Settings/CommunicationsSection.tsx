import { Separator } from '@/components/ui/separator'

export default function CommunicationsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Communications</h3>
        <p className="text-sm text-muted-foreground">Manage your email notifications and communication preferences.</p>
      </div>
      <Separator />
      <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">Communications content coming soon</p>
      </div>
    </div>
  )
}
