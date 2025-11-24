import { Separator } from '@/components/ui/separator'

export default function PaymentMethods() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Payment Methods</h3>
        <p className="text-sm text-muted-foreground">
          Manage your payment methods and billing information.
        </p>
      </div>
      <Separator />
      <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">Payment methods content coming soon</p>
      </div>
    </div>
  )
}
