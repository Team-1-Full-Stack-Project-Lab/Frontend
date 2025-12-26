import { Link, Outlet, useNavigate } from 'react-router-dom'
import { HostSidebar } from '@/components/Host/HostSidebar'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/ThemeToggle'
import { UserDropdown } from '@/components/UserDropdown'
import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'

export default function HostLayout() {
  const navigate = useNavigate()
  const { logout, user, refreshUser, isAuthenticated } = useAuth()

  const handleLogout = () => {
    logout()
  }

  const handleSettings = () => {
    navigate('/settings')
  }

  useEffect(() => {
    if (isAuthenticated && !user) refreshUser()
  }, [isAuthenticated, user, refreshUser])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-card shadow-md border-b">
        <div className="w-full max-w-6xl mx-auto p-4 flex justify-between items-center">
          <Link to="/">
            <img src="/logo.svg" alt="Expedia" className="h-8 w-auto dark:invert" />
          </Link>

          <nav className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="border-l border-border h-6" />
            {user && <UserDropdown user={user} onLogout={handleLogout} onSettings={handleSettings} isHostDashboard />}
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full">
        <div className="w-full max-w-6xl mx-auto my-6 px-4">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Host Dashboard</h2>
            <p className="text-muted-foreground">Manage your properties and view performance metrics.</p>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="lg:w-1/5">
              <HostSidebar />
            </aside>
            <div className="flex-1">
              <Outlet />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-muted text-center text-sm text-muted-foreground p-4">
        Full stack web application developed by Team 1 - &copy; 2025
      </footer>
    </div>
  )
}
