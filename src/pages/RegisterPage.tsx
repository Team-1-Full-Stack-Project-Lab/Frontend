import RegisterCard from "../components/RegisterCard"
export default function RegisterPage() {
  return (
    <>
      <title>Nueva Cuenta</title>
      <div className="flex justify-center items-center mt-7">
        <img src="/logo.svg" alt="" className=" h-8 w-auto" />
      </div>
      <div>
        <RegisterCard />
      </div>
    </>
  )
}