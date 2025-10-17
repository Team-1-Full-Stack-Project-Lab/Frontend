import { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'
import { UserDropdown } from '@/components/UserDropdown'

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
      <header className="bg-white shadow-md">
        <div className="w-full max-w-6xl mx-auto p-4 flex justify-between">
          <Link to="/">
            <img src="/logo.svg" alt="Expedia" className="h-8 w-auto" />
          </Link>

          <nav className="hidden lg:flex space-x-4">
            <Link to="/trips" className="text-gray-800 hover:text-blue-600 font-medium">
              Trips
            </Link>

            <div className="border-l border-gray-300 h-6 my-auto" />
            {user ? (
              <UserDropdown user={user} onLogout={handleLogout} onProfile={handleProfile} onSettings={handleSettings} />
            ) : (
              <Link to="/login" className="text-gray-800 hover:text-blue-600 font-medium">
                Login
              </Link>
            )}
          </nav>

          <div className="lg:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-800 hover:text-blue-600 focus:outline-none"
            >
              {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-md">
            <nav className="container mx-auto px-4 py-3 flex flex-col space-y-3">
              <Link
                to="/trips"
                className="text-gray-800 hover:text-blue-600 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Trips
              </Link>

              <hr className="border-gray-300" />
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
                  className="text-gray-800 hover:text-blue-600 font-medium"
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

      <footer className="bg-gray-100 text-center text-sm text-gray-600 p-4">
        Full stack web application developed by Team 1 - &copy; 2025
      </footer>
    </div>
  )
}
