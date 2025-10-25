import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, type FormEvent } from "react"
import { useAuth } from "@/hooks/useAuth"
import type { UserData } from "@/shared/types"
import { AlertNotification } from "./Alert-notification"

interface EditProfileProps {
  userData: UserData | null;
}

export function EditProfile({ userData }: EditProfileProps) {
  const { updateProfile } = useAuth()
  const [showSuccess, setShowSuccess] = useState(false)
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const email = userData?.email || ""
    const formData = new FormData(e.target as HTMLFormElement)
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    try {
      updateProfile(email, firstName, lastName)
      setOpen(false)
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
      }, 2500);
    } catch (error) {
      console.error("Error updating profile:", error)
      setOpen(false)
    }
  };
  return (
    <>
      {showSuccess && (
        <AlertNotification
          type="success"
          title="Profile Updated"
          description="Your profile has been successfully updated."
          className="fixed top-4 right-4 z-50"
        />
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="text-blue-600 hover:text-blue-500">Edit</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click "Save" when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  First Name
                </Label>
                <Input id="firstName" name="firstName" defaultValue={userData?.firstName} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">
                  Last Name
                </Label>
                <Input id="lastName" name="lastName" defaultValue={userData?.lastName} className="col-span-3" required />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-500" >Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}