import { useState, useEffect } from "react";
import { DeleteProfile } from "../components/DeleteProfile";
import { ProfileData } from "../components/ProfileData";
import type { UserData } from "@/shared/types";

export const userId = 8; //AQUI CORREGIR CON ID DINAMICO

export const URL_ENDPOINT = `http://localhost:8080/user/profile/${userId}`;

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(URL_ENDPOINT);
        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }
        const data: UserData = await response.json();
        setUserData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleProfileUpdate = (updatedUserData: UserData) => {
    setUserData(updatedUserData);
  };
  return (
    <>
      <title>My Profile</title>
      <section className="w-full max-w-6xl mx-auto my-6 px-4">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-[1fr_3fr]">
          <header className="space-y-5 rounded-xl p-4 text-center">
            <h1 className="text-2xl font-bold text-[#121838]">
              Hi {userData?.firstName} !
            </h1>
            <p>{userData?.email}</p>
          </header>
          <aside className="rounded-xl border border-gray-300">
            <ProfileData userData={userData} onUpdate={handleProfileUpdate} userId={userId} />
            <DeleteProfile userData={userData} userId={userId} />
          </aside>
        </div>
      </section>
    </>
  );
}