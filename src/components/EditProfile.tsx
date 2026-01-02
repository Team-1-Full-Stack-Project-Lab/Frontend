import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, type FormEvent } from 'react'
import { useAuth } from '@/hooks/useAuth'
import type { User } from '@/types'

interface EditProfileProps {
  user: User | null
}

export function EditProfile({ user }: EditProfileProps) {
  const { updateProfile } = useAuth()
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const email = user?.email || ''
    const formData = new FormData(e.target as HTMLFormElement)
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    try {
      updateProfile(email, firstName, lastName)
      setOpen(false)
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      setOpen(false)
      toast.error('Failed to update profile. Please try again.')
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-primary hover:text-primary">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Make changes to your profile here. Click "Save" when you're done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                First Name
              </Label>
              <Input id="firstName" name="firstName" defaultValue={user?.firstName} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name
              </Label>
              <Input id="lastName" name="lastName" defaultValue={user?.lastName} className="col-span-3" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
