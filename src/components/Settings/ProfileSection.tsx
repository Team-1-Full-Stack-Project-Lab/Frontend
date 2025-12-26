import { DeleteProfile } from '@/components/DeleteProfile'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { EditProfile } from '@/components/EditProfile'
import { Separator } from '@/components/ui/separator'

export default function ProfileSection() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">This is how others will see you on the site.</p>
      </div>
      <Separator />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Basic information</h2>
            <EditProfile user={user} />
          </div>

          <p className="text-sm text-muted-foreground">
            Make sure this information matches your travel ID, like your passport or license.
          </p>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="font-semibold text-sm">First Name</p>
            <p className="text-muted-foreground">{user?.firstName}</p>
          </div>

          <div className="space-y-1">
            <p className="font-semibold text-sm">Last Name</p>
            <p className="text-muted-foreground">{user?.lastName}</p>
          </div>

          <div className="space-y-1">
            <p className="font-semibold text-sm">Email</p>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </CardContent>

        <CardFooter>
          <DeleteProfile />
        </CardFooter>
      </Card>
    </div>
  )
}
