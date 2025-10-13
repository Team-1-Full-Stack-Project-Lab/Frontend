import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function LoginForm() {
  const [datos, setDatos] = useState({
    email: "",
    password: "",
  })

  const [errores, setErrores] = useState({
    email: "",
    password: "",
  })

  const validacion = () => {
    let valido = true
    let noValido = {
      email: "",
      password: "",
    }
    if (!datos.email.trim()) {
      noValido.email = "El correo electrónico es obligatorio."
      valido = false
    }
    if (!datos.password.trim()) {
      noValido.password = "La contraseña es obligatoria."
      valido = false
    }
    setErrores(noValido)
    return valido
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validacion()) {
      console.log("Usuario registrado:", datos)
    }
  }

  return (
    <div>
      <form>
        <div className="grid gap-2 mb-5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={datos.email}
            onChange={(e) =>
              setDatos({ ...datos, email: e.target.value })
            } />
          {errores.email && (
            <p className="text-red-500 text-sm">{errores.email}</p>
          )}
        </div>
        <div className="grid gap-2 mb-5">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            placeholder="********"
            value={datos.password}
            onChange={(e) =>
              setDatos({ ...datos, password: e.target.value })
            } />
          {errores.password && (
            <p className="text-red-500 text-sm">{errores.password}</p>
          )}
        </div>
      </form>
      <div className="flex-col gap-2 mt-4">
        <Button type="submit" onClick={handleSubmit} className="w-full bg-[#006CE4] hover:bg-[#0055b8] text-white px-6 rounded-full">
          Ingresar
        </Button>
      </div>
    </div>
  )
}