import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import StaysPage from './pages/stays/StaysPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import AuthLayout from './layouts/AuthLayout'
import ProtectedRoute from './layouts/ProtectedRoute'
import SettingsPage from './pages/settings/SettingsPage'
import HelpCenterPage from './pages/helpcenter/HelpCenterPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/stays" element={<StaysPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/settings/*" element={<SettingsPage />} />
            <Route path="/help-center" element={<HelpCenterPage />} />
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
