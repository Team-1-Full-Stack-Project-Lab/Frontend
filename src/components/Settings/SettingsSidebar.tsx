import { Link, useLocation } from 'react-router-dom'
import { User, CreditCard, Bell, Shield, Building2 } from 'lucide-react'
import { cn } from '@/utils/helpers'
import { buttonVariants } from '@/components/ui/button'

const sidebarNavItems = [
  {
    title: 'Profile',
    href: '/settings/profile',
    icon: User,
  },
  {
    title: 'Company',
    href: '/settings/company',
    icon: Building2,
  },
  {
    title: 'Payment Methods',
    href: '/settings/payment',
    icon: CreditCard,
  },
  {
    title: 'Communications',
    href: '/settings/communications',
    icon: Bell,
  },
  {
    title: 'Security & Settings',
    href: '/settings/security',
    icon: Shield,
  },
]

export function SettingsSidebar() {
  const location = useLocation()

  return (
    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
      {sidebarNavItems.map(item => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            location.pathname === item.href ? 'bg-muted hover:bg-muted' : 'hover:bg-transparent hover:underline',
            'justify-start'
          )}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
