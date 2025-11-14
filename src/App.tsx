import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import TripsPage from './pages/trips/TripsPage'
import StaysPage from './pages/stays/StaysPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import AuthLayout from './layouts/AuthLayout'
import ProfilePage from './pages/profile/ProfilePage'
import ProtectedRoute from './layouts/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/stays" element={<StaysPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
