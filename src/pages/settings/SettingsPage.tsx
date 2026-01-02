import { Routes, Route, Navigate } from 'react-router-dom'
import { SettingsSidebar } from '@/components/Settings/SettingsSidebar'
import { Separator } from '@/components/ui/separator'
import ProfileSection from '@/components/Settings/ProfileSection'
import CompanySection from '@/components/Settings/CompanySection'
import PaymentMethods from '@/components/Settings/PaymentMethods'
import CommunicationsSection from '@/components/Settings/CommunicationsSection'
import SecuritySection from '@/components/Settings/SecuritySection'

export default function SettingsPage() {
  return (
    <>
      <title>Settings</title>

      <div className="w-full max-w-6xl mx-auto my-6 px-4">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your account settings and set e-mail preferences.</p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="lg:w-1/5">
            <SettingsSidebar />
          </aside>
          <div className="flex-1 lg:max-w-2xl">
            <Routes>
              <Route index element={<Navigate to="profile" replace />} />
              <Route path="profile" element={<ProfileSection />} />
              <Route path="company" element={<CompanySection />} />
              <Route path="payment" element={<PaymentMethods />} />
              <Route path="communications" element={<CommunicationsSection />} />
              <Route path="security" element={<SecuritySection />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  )
}
