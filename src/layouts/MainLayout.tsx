import { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'
import { UserDropdown } from '@/components/UserDropdown'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function MainLayout() {
  const navigate = useNavigate()
  const { logout, user, refreshUser, isAuthenticated } = useAuth()

  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
  }

  const handleProfile = () => {
    navigate('/profile')
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
              <Link to="/trips" className="text-foreground hover:text-primary font-medium">
                Trips
              </Link>
            )}

            <div className="border-l border-border h-6" />
            <ThemeToggle />
            <div className="border-l border-border h-6" />
            {user ? (
              <UserDropdown user={user} onLogout={handleLogout} onProfile={handleProfile} onSettings={handleSettings} />
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
              className="text-foreground hover:text-primary focus:outline-none"
            >
              {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden bg-card border-t border-border shadow-md">
            <nav className="container mx-auto px-4 py-3 flex flex-col space-y-3">
              {isAuthenticated && (
                <Link
                  to="/trips"
                  className="text-foreground hover:text-primary font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Trips
                </Link>
              )}

              <hr className="border-border" />
              {user ? (
                <UserDropdown
                  user={user}
                  onLogout={handleLogout}
                  onProfile={handleProfile}
                  onSettings={handleSettings}
                />
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
    </div>
  )
}
