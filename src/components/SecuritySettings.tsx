import { Separator } from '@/components/ui/separator'

export default function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Security & Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your password and security settings.
        </p>
      </div>
      <Separator />
      <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">Security settings content coming soon</p>
      </div>
    </div>
  )
}
