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
import type { UserData } from "@/shared/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function DeleteProfile({ userData, userId }: { userData: UserData | null, userId: number }) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!userData) {
    return null;
  }
  const handleDelete = async () => {
    if (!userId) {
      setError("No se pudo identificar al usuario");
      return;
    }
    setIsDeleting(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/user/profile/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la cuenta");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ha ocurrido un error al eliminar la cuenta");
    } finally {
      setIsDeleting(false);
    }
    navigate('/login');
  };

  return (
    <Dialog>
      <DialogTrigger asChild className="mb-5 ml-4">
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
              <Button variant="outline" disabled={isDeleting}>Cancel</Button>
            </DialogClose>
            <Button type="button" className="bg-red-600 hover:bg-red-500" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
