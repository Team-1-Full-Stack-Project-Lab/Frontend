import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Link } from "react-router-dom"
import RegisterForm from "./RegisterForm"

export default function RegisterCard() {
  return (
    <div className="flex justify-center items-center mt-20 text-2xl font-semibold mb-20" >
      <Card className="w-full max-w-md p-8 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Crea tu cuenta
          </CardTitle>
          <CardDescription>
            Completa los campos para registrarte como nuevo usuario
          </CardDescription>
          <CardAction>
          </CardAction>
          <Link to="/login" className="inline-block text-sm underline-offset-4 hover:text-blue-500">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  )
}
