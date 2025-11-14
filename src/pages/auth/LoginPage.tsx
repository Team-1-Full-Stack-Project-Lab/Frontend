import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Link from '@/components/Link'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, loading, isAuthenticated } = useAuth()

  const [data, setData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      await login(data.email, data.password).unwrap()
    } catch (err) {
      setError(err as string)
    }
  }

  useEffect(() => {
    if (isAuthenticated) navigate('/')
  }, [isAuthenticated, navigate])

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
            <FieldSet>
              <FieldGroup className="gap-4">
                <Field data-invalid={!!error}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={data.email}
                    onChange={e => setData({ ...data, email: e.target.value })}
                    aria-invalid={!!error}
                    required
                  />
                </Field>

                <Field data-invalid={!!error}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    minLength={6}
                    value={data.password}
                    onChange={e => setData({ ...data, password: e.target.value })}
                    aria-invalid={!!error}
                    required
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            {error && <FieldError>{error}</FieldError>}
            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
