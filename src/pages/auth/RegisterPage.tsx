import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from '@/components/Link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, loading, error, isAuthenticated } = useAuth()

  const [data, setData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    register(data.email, data.firstname, data.lastname, data.password)
  }

  useEffect(() => {
    if (isAuthenticated) navigate('/')
  }, [isAuthenticated, navigate])

  return (
    <>
      <title>New Account</title>

      <Card className="w-full px-12 py-8">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Complete the fields to register as a new user</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <FieldSet>
              <FieldGroup className="gap-4">
                <Field data-invalid={!!error}>
                  <FieldLabel htmlFor="firstname">First Name</FieldLabel>
                  <Input
                    id="firstname"
                    type="text"
                    placeholder="Your first name"
                    value={data.firstname}
                    onChange={e => setData({ ...data, firstname: e.target.value })}
                    required
                  />
                </Field>

                <Field data-invalid={!!error}>
                  <FieldLabel htmlFor="lastname">Last Name</FieldLabel>
                  <Input
                    id="lastname"
                    type="text"
                    placeholder="Your last name"
                    value={data.lastname}
                    onChange={e => setData({ ...data, lastname: e.target.value })}
                    required
                  />
                </Field>

                <Field data-invalid={!!error}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={data.email}
                    onChange={e => setData({ ...data, email: e.target.value })}
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
                    required
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            {error && <FieldError>{error}</FieldError>}
            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white">
              Register
            </Button>

            <Link to="/login">Already have an account? Login</Link>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
