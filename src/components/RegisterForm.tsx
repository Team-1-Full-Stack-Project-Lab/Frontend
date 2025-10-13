import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function RegisterForm() {
  const [datos, setDatos] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  })

  const [errores, setErrores] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  })

  const validacion = () => {
    let valido = true
    let noValido = {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    }
    if (!datos.firstname.trim()) {
      noValido.firstname = "El nombre no puede estar vacío."
      valido = false
    }
    if (!datos.lastname.trim()) {
      noValido.lastname = "El apellido no puede estar vacío."
      valido = false
    }
    if (!datos.email.trim()) {
      noValido.email = "El correo electrónico es obligatorio."
      valido = false
    }
    if (!datos.password.trim()) {
      noValido.password = "La contraseña es obligatoria."
      valido = false
    } else
      if (datos.password.length < 6) {
        noValido.password = "La contraseña debe tener al menos 6 caracteres."
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid gap-2">
          <Label htmlFor="firstname">Nombre</Label>
          <Input
            id="firstname"
            type="text"
            placeholder="Tu nombre"
            value={datos.firstname}
            onChange={(e) =>
              setDatos({ ...datos, firstname: e.target.value })
            }
          />
          {errores.firstname && (
            <p className="text-red-500 text-sm">{errores.firstname}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lastname">Apellido</Label>
          <Input
            id="lastname"
            type="text"
            placeholder="Tu apellido"
            value={datos.lastname}
            onChange={(e) =>
              setDatos({ ...datos, lastname: e.target.value })
            }
          />
          {errores.lastname && (
            <p className="text-red-500 text-sm">{errores.lastname}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={datos.email}
            onChange={(e) =>
              setDatos({ ...datos, email: e.target.value })
            }
          />
          {errores.email && (
            <p className="text-red-500 text-sm">{errores.email}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            placeholder="********"
            value={datos.password}
            onChange={(e) =>
              setDatos({ ...datos, password: e.target.value })
            }
          />
          {errores.password && (
            <p className="text-red-500 text-sm">{errores.password}</p>
          )}
        </div>
      </form>
      <div className="flex-col gap-2 mt-4">
        <Button type="submit" onClick={handleSubmit} className="w-full bg-[#006CE4] hover:bg-[#0055b8] text-white px-6 rounded-full">
          Registrarse
        </Button>
      </div>
    </div>
  )
}
