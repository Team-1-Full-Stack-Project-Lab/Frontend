import LoginCard from "../components/LoginCard"
import { Link } from "react-router-dom"
import { FaArrowAltCircleLeft } from "react-icons/fa"
export default function LoginPage() {
  return (
    <>
      <title>Inicio Sesión</title>
      <div >
        <Link to="/" className=" absolute top-7 left-4 text-blue-800 hover:text-blue-500">
          <FaArrowAltCircleLeft size={30} />
        </Link>
      </div>
      <div className="flex justify-center items-center mt-7">
        <img src="/logo.svg" alt="" className="h-8 w-auto" />
      </div>
      <div>
        <LoginCard />
      </div>
    </>
  )
}
