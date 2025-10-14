import { FaArrowAltCircleLeft } from 'react-icons/fa'
import { Link, Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <Link to="/" className="absolute top-5 left-5 text-blue-600 hover:text-blue-500">
        <FaArrowAltCircleLeft size={30} />
      </Link>

      <Link to="/">
        <img src="/logo.svg" alt="Expedia" className="h-8 w-auto my-8" />
      </Link>

      <main className="w-full max-w-md mx-auto">
        <Outlet />
      </main>
    </div>
  )
}
