import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { type FormEvent, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { AlertNotification } from "./Alert-notification"

export function DeleteProfile() {
  const { deleteAccount, logout } = useAuth()
  const [showSuccess, setShowSuccess] = useState(false)
  const [open, setOpen] = useState(false)


  const handleDelete = (e: FormEvent) => {
    e.preventDefault()
    try {
      deleteAccount()
      setOpen(false)
      setShowSuccess(true)
      setTimeout(() => {
        logout()
      }, 2500)
    } catch (error) {
      console.error("Error deleting account:", error)
      setOpen(false)
    }
  };

  return (
    <>
      {showSuccess && (
        <AlertNotification
          type="success"
          title="Account Deleted"
          description="Your account has been successfully deleted."
          className="fixed top-4 right-4 z-50"
        />
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="text-red-600 hover:text-red-500">Delete Account</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleDelete}>
            <DialogHeader>
              <DialogTitle>Delete Your Account</DialogTitle>
              <DialogDescription>
                Deleting your account is permanent. Are you sure you want to delete this account?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" >Cancel</Button>
              </DialogClose>
              <Button type="submit" className="bg-red-600 hover:bg-red-500" >Delete</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
