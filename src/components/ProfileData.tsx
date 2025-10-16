import { EditProfile } from "@/components/EditProfile";
import type { UserData } from "@/shared/types";

interface ProfileDataProps {
  userData: UserData | null;
  onUpdate: (updatedUserData: UserData) => void;
}

export function ProfileData({ userData, onUpdate, userId }: ProfileDataProps & { userId: number }) {
  if (!userData) {
    return null;
  }
  return (
    <>
      <header className="text-left mt-4 ml-4">
        <h1 className="text-2xl font-bold text-[#121838] mb-3">{userData.firstName} {userData.lastName}</h1>
        <div className="flex items-center justify-between mt-4 mr-4">
          <h2 className="text-3xl font-bold text-[#121838] mr-6">Basic information</h2>
          <EditProfile userData={userData} onUpdate={onUpdate} userId={userId} />
        </div>
        <p className="text-sm text-gray-500">Make sure this information matches your travel ID, like your passport or license.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 p-4 ml-2 ">
        <div>
          <div className="mb-4">
            <p className="font-semibold text-[#121838]">First Name</p>
            <p className="text-gray-500">{userData.firstName}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold text-[#121838]">Last Name</p>
            <p className="text-gray-500">{userData.lastName}</p>
          </div>
        </div>
        <div>
          <div className="mb-4">
            <p className="font-semibold text-[#121838]">Email</p>
            <p className="text-gray-500">{userData.email}</p>
          </div>
        </div>
      </div>
    </>
  )
}
