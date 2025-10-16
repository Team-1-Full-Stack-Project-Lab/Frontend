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
import { useState, useEffect } from "react";
import type { UserData } from "@/shared/types";

interface EditProfileProps {
  userData: UserData | null;
  onUpdate: (updatedUserData: UserData) => void;
}

export function EditProfile({ userData, onUpdate, userId }: EditProfileProps & { userId: number }) {
  const [firstName2, setFirstName] = useState("");
  const [lastName2, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
    }
  }, [userData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/user/profile/edit/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName2,
          lastName: lastName2
        })
      });
      if (!response.ok) {
        throw new Error("Failed to update profile.");
      }
      const updatedUserData: UserData = await response.json();
      onUpdate(updatedUserData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    }
  };
  return (
    <Dialog >
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
              <Input id="name" defaultValue={userData?.firstName} onChange={(e) => setFirstName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastname" className="text-right">
                Last Name
              </Label>
              <Input id="lastname" defaultValue={userData?.lastName} onChange={(e) => setLastName(e.target.value)} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-500" onClick={() => window.location.reload()}>Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}