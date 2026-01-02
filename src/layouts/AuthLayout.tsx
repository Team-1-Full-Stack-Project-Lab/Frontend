import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'
import { FaArrowAltCircleLeft } from 'react-icons/fa'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function AuthLayout() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) navigate('/')
  }, [isAuthenticated, navigate])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Link to="/" className="absolute top-5 left-5 text-primary hover:text-primary/80">
        <FaArrowAltCircleLeft size={30} />
      </Link>

      <div className="absolute top-5 right-5">
        <ThemeToggle />
      </div>

      <Link to="/">
        <img src="/logo.svg" alt="Expedia" className="h-8 w-auto my-8 dark:invert" />
      </Link>

      <main className="w-full max-w-md mx-auto">
        <Outlet />
      </main>
    </div>
  )
}
