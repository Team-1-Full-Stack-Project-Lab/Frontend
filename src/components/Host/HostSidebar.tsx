import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Building2, Mail, Phone } from 'lucide-react'
import { cn } from '@/utils/helpers'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'

const navigation = [
  { name: 'Dashboard', href: '/host/dashboard', icon: LayoutDashboard },
  { name: 'Stays', href: '/host/stays', icon: Building2 },
]

export function HostSidebar() {
  const { user } = useAuth()
  const company = user?.company

  return (
    <div className="space-y-4">
      {company && (
        <Card className="p-4">
          <CardContent className="space-y-2 text-sm">
            <div>
              <p className="font-semibold truncate">{company.name}</p>
            </div>
            {company.email && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-3 w-3 shrink-0" />
                <p className="truncate text-xs">{company.email}</p>
              </div>
            )}
            {company.phone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-3 w-3 shrink-0" />
                <p className="truncate text-xs">{company.phone}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <nav className="space-y-1">
        {navigation.map(item => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/host/dashboard'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
