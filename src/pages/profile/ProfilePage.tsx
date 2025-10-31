import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DeleteProfile } from '@/components/DeleteProfile'
import { ProfileData } from '@/components/ProfileData'
import type { UserData } from '@/shared/types'
import { useAuth } from '@/hooks/useAuth'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, refreshUser, isAuthenticated } = useAuth()

  const handleProfileUpdate = (updatedUserData: UserData) => {
    console.log('Profile updated:', updatedUserData)
  }

  useEffect(() => {
    if (isAuthenticated && !user) refreshUser()
    if (!isAuthenticated) navigate('/')
  }, [isAuthenticated, user, navigate, refreshUser])

  return (
    <>
      <title>My Profile</title>
      <section className="w-full max-w-6xl mx-auto my-6 px-4">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-[1fr_3fr]">
          <header className="space-y-5 rounded-xl p-4 text-center">
            <h1 className="text-2xl font-bold text-[#121838]">Hi {user?.firstName} !</h1>
            <p>{user?.email}</p>
          </header>
          <aside className="rounded-xl border border-gray-300">
            <ProfileData userData={user} onUpdate={handleProfileUpdate} />
            <DeleteProfile />
          </aside>
        </div>
      </section>
    </>
  )
}
