import { useEffect, useState } from 'react'
import { useServices } from '@/hooks/useServices'
import type { Service } from '@/types'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import { LucideIcon } from './LucideIcon'

type Props = {
  selectedServiceIds: number[]
  onToggle: (serviceId: number) => void
}

export default function ServiceFilters({ selectedServiceIds, onToggle }: Props) {
  const { serviceService } = useServices()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true)
        const data = await serviceService.getAllServices()
        setServices(data)
      } catch (error) {
        console.error('Failed to load services:', error)
      } finally {
        setLoading(false)
      }
    }

    loadServices()
  }, [serviceService])

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-base">Services</h3>
        </div>
        <Separator />
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="ml-2 text-sm">Loading services...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-base">Services</h3>
        {selectedServiceIds.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            {selectedServiceIds.length}
          </Badge>
        )}
      </div>
      <Separator />
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-3">
          {services.map(service => {
            const id = `service-${service.id}`
            const isChecked = selectedServiceIds.includes(service.id)

            return (
              <div key={service.id} className="flex items-center space-x-2">
                <Checkbox id={id} checked={isChecked} onCheckedChange={() => onToggle(service.id)} />
                <Label
                  htmlFor={id}
                  className="text-sm font-normal cursor-pointer flex items-center gap-2 flex-1 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <LucideIcon name={service.icon} className="h-4 w-4" />
                  {service.name}
                </Label>
              </div>
            )
          })}
        </div>
      </ScrollArea>
      {selectedServiceIds.length > 0 && (
        <button
          onClick={() => selectedServiceIds.forEach(id => onToggle(id))}
          className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  )
}
