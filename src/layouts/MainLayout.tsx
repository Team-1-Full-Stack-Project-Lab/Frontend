import { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'
import { UserDropdown } from '@/components/UserDropdown'
import { ThemeToggle } from '@/components/ThemeToggle'
import { TripsDrawer } from '@/components/Trips/TripsDrawer'
import { useTripsDrawer } from '@/hooks/useTripsDrawer'
import { TripsDrawerProvider } from '@/contexts/TripsDrawerProvider'

function MainLayoutContent() {
  const navigate = useNavigate()
  const { logout, user, refreshUser, isAuthenticated } = useAuth()
  const {
    isOpen: tripsDrawerOpen,
    openDrawer: openTripsDrawer,
    closeDrawer: closeTripsDrawer,
    initialValues,
  } = useTripsDrawer()

  const [menuOpen, setMenuOpen] = useState(false)

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

          <nav className="hidden lg:flex items-center space-x-4">
            {isAuthenticated && (
              <>
                <button
                  onClick={() => openTripsDrawer()}
                  className="text-foreground hover:text-primary font-medium cursor-pointer"
                >
                  Trips
                </button>
                <Link to="/help-center" className="text-foreground hover:text-primary font-medium">
                  Help Center
                </Link>
              </>
            )}

            <div className="border-l border-border h-6" />
            <ThemeToggle />
            <div className="border-l border-border h-6" />
            {user ? (
              <UserDropdown user={user} onLogout={handleLogout} onSettings={handleSettings} />
            ) : (
              <Link to="/login" className="text-foreground hover:text-primary font-medium">
                Login
              </Link>
            )}
          </nav>

          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-foreground hover:text-primary focus:outline-none cursor-pointer"
            >
              {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden bg-card border-t border-border shadow-md">
            <nav className="container mx-auto px-4 py-3 flex flex-col space-y-3">
              {isAuthenticated && (
                <>
                  <button
                    onClick={() => {
                      openTripsDrawer()
                      setMenuOpen(false)
                    }}
                    className="text-foreground hover:text-primary font-medium text-left"
                  >
                    Trips
                  </button>
                  <Link
                    to="/help-center"
                    className="text-foreground hover:text-primary font-medium"
                    onClick={() => setMenuOpen(false)}
                  >
                    Help Center
                  </Link>
                </>
              )}

              <hr className="border-border" />
              {user ? (
                <UserDropdown user={user} onLogout={handleLogout} onSettings={handleSettings} />
              ) : (
                <Link
                  to="/login"
                  className="text-foreground hover:text-primary font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <footer className="bg-muted text-center text-sm text-muted-foreground p-4">
        Full stack web application developed by Team 1 - &copy; 2025
      </footer>

      {isAuthenticated && (
        <TripsDrawer
          open={tripsDrawerOpen}
          onOpenChange={open => !open && closeTripsDrawer()}
          initialCityId={initialValues?.cityId}
          initialDateRange={initialValues?.dateRange}
        >
          <span />
        </TripsDrawer>
      )}
    </div>
  )
}

export default function MainLayout() {
  return (
    <TripsDrawerProvider>
      <MainLayoutContent />
    </TripsDrawerProvider>
  )
}
