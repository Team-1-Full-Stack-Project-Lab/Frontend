import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function CompanyRoute() {
  const { isAuthenticated, user, loading } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!loading && user && !user?.company) {
    return <Navigate to="/settings/company" state={{ from: location }} replace />
  }

  return <Outlet />
}
