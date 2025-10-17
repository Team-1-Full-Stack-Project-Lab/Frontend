import { InputError } from '@/components/InputError'
import Link from '@/components/Link'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, loading, error } = useAuth()

  const [data, setData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    login(data.email, data.password)
    navigate('/')
  }

  return (
    <>
      <title>Login</title>

      <Card className="w-full px-12 py-8">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
          <CardAction>
            <Link to="/register">Create an account</Link>
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
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                minLength={6}
                value={data.password}
                onChange={e => setData({ ...data, password: e.target.value })}
                required
              />
            </div>

            {error && <InputError message={error} />}
            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
