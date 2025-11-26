import { Button } from '@/components/ui/button'
import { Plane } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 border-b border-white/10 bg-white/5 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Plane className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-white">Wanderlust</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link to="#" className="text-sm font-medium text-white/90 transition-colors hover:text-white">
            Destinations
          </Link>
          <Link to="#" className="text-sm font-medium text-white/90 transition-colors hover:text-white">
            Deals
          </Link>
          <Link to="#" className="text-sm font-medium text-white/90 transition-colors hover:text-white">
            My Trips
          </Link>
          <Link to="/help-center" className="text-sm font-medium text-white/90 transition-colors hover:text-white">
            Help Center
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
            Sign In
          </Button>
          <Button className="bg-white text-primary hover:bg-white/90">Sign Up</Button>
        </div>
      </div>
    </header>
  )
}
