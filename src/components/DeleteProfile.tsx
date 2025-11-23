import { toast } from "sonner"
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

export function DeleteProfile() {
  const { deleteAccount, logout } = useAuth()
  const [open, setOpen] = useState(false)


  const handleDelete = (e: FormEvent) => {
    e.preventDefault()
    try {
      deleteAccount()
      setOpen(false)
      logout()
      toast.success("Account deleted successfully")
    } catch (error) {
      console.error("Error deleting account:", error)
      setOpen(false)
      toast.error("Failed to delete account. Please try again.")
    }
  };

  return (
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
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" variant="destructive">Delete</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
