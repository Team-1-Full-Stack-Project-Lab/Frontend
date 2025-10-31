import { DeleteProfile } from '@/components/DeleteProfile'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { EditProfile } from '@/components/EditProfile'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <>
      <title>My Profile</title>
      <section className="w-full max-w-6xl mx-auto my-6 px-4">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-[1fr_3fr]">
          <header className="space-y-5 rounded-xl p-4 text-center">
            <h1 className="text-2xl font-bold">Hi {user?.firstName} !</h1>
            <p>{user?.email}</p>
          </header>

          <Card>
            <CardHeader>
              <h1 className="text-2xl font-bold">
                {user?.firstName} {user?.lastName}
              </h1>

              <div className="flex items-center justify-between mt-4 mr-4">
                <h2 className="text-3xl font-bold mr-6">Basic information</h2>
                <EditProfile userData={user} />
              </div>

              <p className="text-sm text-gray-500">
                Make sure this information matches your travel ID, like your passport or license.
              </p>
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-2">
              <div className="gap-y-4">
                <div className="mb-4">
                  <p className="font-semibold">First Name</p>
                  <p className="text-gray-500">{user?.firstName}</p>
                </div>

                <div className="mb-4">
                  <p className="font-semibold">Last Name</p>
                  <p className="text-gray-500">{user?.lastName}</p>
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <p className="font-semibold">Email</p>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <DeleteProfile />
            </CardFooter>
          </Card>
        </div>
      </section>
    </>
  )
}
