import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from '@/components/Link'
import { Button } from '@/components/ui/button'
import { InputError } from '@/components/InputError'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useState, type FormEvent } from 'react'

export default function RegisterPage() {
  const [data, setData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  })
  const [errors] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log('Register Form:', data)
  }

  return (
    <>
      <title>Nueva Cuenta</title>

      <Card className="w-full px-12 py-8">
        <CardHeader>
          <CardTitle>Crea tu cuenta</CardTitle>
          <CardDescription>Completa los campos para registrarte como nuevo usuario</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="firstname">Nombre</Label>
              <Input
                id="firstname"
                type="text"
                placeholder="Tu nombre"
                value={data.firstname}
                onChange={e => setData({ ...data, firstname: e.target.value })}
                required
              />
              {errors.firstname && <InputError message={errors.firstname} className="mt-2" />}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lastname">Apellido</Label>
              <Input
                id="lastname"
                type="text"
                placeholder="Tu apellido"
                value={data.lastname}
                onChange={e => setData({ ...data, lastname: e.target.value })}
                required
              />
              {errors.lastname && <InputError message={errors.lastname} className="mt-2" />}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={data.email}
                onChange={e => setData({ ...data, email: e.target.value })}
                required
              />
              {errors.email && <InputError message={errors.email} className="mt-2" />}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                minLength={6}
                value={data.password}
                onChange={e => setData({ ...data, password: e.target.value })}
                required
              />
              {errors.password && <InputError message={errors.password} className="mt-2" />}
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white">
              Registrarse
            </Button>

            <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
