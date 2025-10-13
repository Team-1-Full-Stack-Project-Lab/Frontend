import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import LoginForm from "./LoginForm"
import { Link } from "react-router-dom"

export default function LoginCard() {
  return (
    <>
      <div className="flex justify-center items-center mt-20 text-2xl font-semibold " >
        <Card className="w-full max-w-md p-6 shadow-md">
          <CardHeader >
            <CardTitle>
              Inicia sesión
            </CardTitle>
            <CardDescription className="mt-4">
              Ingresa tus datos para acceder a tu cuenta
            </CardDescription>
            <CardAction>
              <Link to="/register" className="ml-auto inline-block text-sm underline-offset-4 hover:text-blue-500">
                Crear cuenta
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </>
  )
}