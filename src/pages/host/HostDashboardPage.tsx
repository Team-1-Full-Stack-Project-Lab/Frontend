import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, MapPin, Plus } from 'lucide-react'
import { StatsCard } from '@/components/Host/StatsCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { useServices } from '@/hooks/useServices'
import type { Stay } from '@/types'

export default function HostDashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { stayService } = useServices()
  const [stays, setStays] = useState<Stay[]>([])
  const [loading, setLoading] = useState(true)

  const loadStays = async () => {
    if (!user?.company) return

    try {
      setLoading(true)
      const result = await stayService.getAllStays({ companyId: user.company.id, size: 100 })
      setStays(result.content)
    } catch (error) {
      console.error('Error loading stays:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStays()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const totalStays = stays.length
  const totalUnits = stays.reduce((sum, stay) => sum + (stay.units?.length || 0), 0)
  const avgPrice =
    totalUnits > 0
      ? stays.reduce((sum, stay) => {
          const stayTotal = stay.units?.reduce((s, u) => s + u.pricePerNight, 0) || 0
          return sum + stayTotal
        }, 0) / totalUnits
      : 0
  const uniqueCities = new Set(stays.map(stay => stay.city?.id).filter(Boolean)).size

  const recentStays = stays.slice(0, 5)

  return (
    <>
      <title>Host Dashboard</title>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Overview</h3>
          <p className="text-sm text-muted-foreground">Your property portfolio at a glance.</p>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="space-y-0 pb-2">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </CardHeader>
                <CardContent>
                  <div className="h-7 w-16 bg-muted animate-pulse rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard title="Total Stays" value={totalStays} icon="Building2" description="Active properties" />
            <StatsCard title="Total Units" value={totalUnits} icon="Bed" description="Available rooms" />
            <StatsCard
              title="Average Price"
              value={`$${avgPrice.toFixed(2)}`}
              icon="DollarSign"
              description="Per night"
            />
            <StatsCard title="Cities" value={uniqueCities} icon="MapPin" description="Locations" />
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Properties</CardTitle>
            </CardHeader>
            <CardContent>
              {recentStays.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-4">No properties yet</p>
                  <Button onClick={() => navigate('/host/stays/new')}>
                    <Plus className="mr-2 h-4 w-4" /> Create your first stay
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentStays.map(stay => (
                    <div
                      key={stay.id}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/host/stays/${stay.id}`)}
                    >
                      {stay.images?.[0]?.link ? (
                        <img src={stay.images[0].link} alt={stay.name} className="h-12 w-12 rounded object-cover" />
                      ) : (
                        <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{stay.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {stay.city?.name} • {stay.units?.length || 0} units
                        </p>
                      </div>
                    </div>
                  ))}
                  {stays.length > 5 && (
                    <Button variant="ghost" className="w-full" onClick={() => navigate('/host/stays')}>
                      View all properties
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/host/stays/new')}>
                <Plus className="mr-2 h-4 w-4" /> Add New Property
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/host/stays')}>
                <Building2 className="mr-2 h-4 w-4" /> Manage All Properties
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/settings/company')}>
                <MapPin className="mr-2 h-4 w-4" /> Company Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
