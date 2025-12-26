import { LogOut, Settings, User, Building2, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from './ui/button'
import type { Company } from '@/types'

interface UserDropdownProps {
  user: {
    email: string
    firstName: string
    lastName: string
    company?: Company | null
  }
  onLogout?: () => void
  onSettings?: () => void
  isHostDashboard?: boolean
}

export function UserDropdown({ user, onLogout, onSettings, isHostDashboard = false }: UserDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 p-0">
          <User /> {user.firstName} {user.lastName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isHostDashboard ? (
          <>
            <DropdownMenuItem asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                <span>Back to Home</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        ) : (
          user.company && (
            <>
              <DropdownMenuItem asChild>
                <Link to="/host/dashboard">
                  <Building2 className="mr-2 h-4 w-4" />
                  <span>Host Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )
        )}
        <DropdownMenuItem onClick={onSettings}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
