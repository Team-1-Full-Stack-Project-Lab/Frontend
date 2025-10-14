import { InputError } from '@/components/InputError'
import Link from '@/components/Link'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, type FormEvent } from 'react'

export default function LoginPage() {
  const [data, setData] = useState({
    email: '',
    password: '',
  })
  const [errors] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log('Login Form:', data)
  }

  return (
    <>
      <title>Inicio Sesión</title>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Inicia sesión</CardTitle>
          <CardDescription>Ingresa tus data para acceder a tu cuenta</CardDescription>
          <CardAction>
            <Link to="/register">Crear cuenta</Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
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
              Ingresar
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
