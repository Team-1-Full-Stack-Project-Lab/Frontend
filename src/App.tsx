import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import StaysPage from './pages/stays/StaysPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import AuthLayout from './layouts/AuthLayout'
import ProtectedRoute from './layouts/ProtectedRoute'
import CompanyRoute from './layouts/CompanyRoute'
import HostLayout from './layouts/HostLayout'
import SettingsPage from './pages/settings/SettingsPage'
import HelpCenterPage from './pages/helpcenter/HelpCenterPage'
import ChatLayout from './layouts/ChatLayout'
import HostDashboardPage from './pages/host/HostDashboardPage'
import HostStaysPage from './pages/host/HostStaysPage'
import CreateStayPage from './pages/host/CreateStayPage'
import StayDetailsPage from './pages/host/StayDetailsPage'
import EditStayPage from './pages/host/EditStayPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <>
              <MainLayout /> <ChatLayout />
            </>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/stays" element={<StaysPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/settings/*" element={<SettingsPage />} />
            <Route path="/help-center" element={<HelpCenterPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<CompanyRoute />}>
            <Route element={<HostLayout />}>
              <Route path="/host/dashboard" element={<HostDashboardPage />} />
              <Route path="/host/stays" element={<HostStaysPage />} />
              <Route path="/host/stays/new" element={<CreateStayPage />} />
              <Route path="/host/stays/:id" element={<StayDetailsPage />} />
              <Route path="/host/stays/:id/edit" element={<EditStayPage />} />
            </Route>
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
