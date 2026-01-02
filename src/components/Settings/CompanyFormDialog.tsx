import { type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import type { ValidationError } from '@/types'

export interface CompanyFormValues {
  name: string
  email: string
  phone?: string
  description?: string
}

interface CompanyFormDialogProps {
  open: boolean
  mode: 'create' | 'edit'
  loading: boolean
  values: CompanyFormValues
  errors: ValidationError
  onOpenChange: (open: boolean) => void
  onChange: (field: keyof CompanyFormValues, value: string) => void
  onSubmit: () => void
}

export default function CompanyFormDialog({
  open,
  mode,
  loading,
  values,
  errors,
  onOpenChange,
  onChange,
  onSubmit,
}: CompanyFormDialogProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <form onSubmit={handleSubmit} className="grid gap-6">
          <DialogHeader>
            <DialogTitle>{mode === 'create' ? 'Create Company' : 'Edit Company'}</DialogTitle>
            <DialogDescription>
              {mode === 'create'
                ? 'Provide your company details so you can start publishing stays.'
                : 'Update your company information. Changes apply immediately.'}
            </DialogDescription>
          </DialogHeader>
          <FieldSet>
            <FieldGroup className="gap-4">
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="name">Company name</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  placeholder="Acme Hospitality"
                  value={values.name}
                  onChange={event => onChange('name', event.target.value)}
                  aria-invalid={!!errors.name}
                  required
                />
                {errors.name?.map((error, index) => (
                  <FieldError key={`${error}-${index}`}>{error}</FieldError>
                ))}
              </Field>

              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">Business email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="hello@acme.com"
                  value={values.email}
                  onChange={event => onChange('email', event.target.value)}
                  aria-invalid={!!errors.email}
                  required
                />
                {errors.email?.map((error, index) => (
                  <FieldError key={`${error}-${index}`}>{error}</FieldError>
                ))}
              </Field>

              <Field data-invalid={!!errors.phone}>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+1 555 000 0000"
                  value={values.phone ?? ''}
                  onChange={event => onChange('phone', event.target.value)}
                  aria-invalid={!!errors.phone}
                />
                {errors.phone?.map((error, index) => (
                  <FieldError key={`${error}-${index}`}>{error}</FieldError>
                ))}
              </Field>

              <Field data-invalid={!!errors.description}>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Tell travelers about your brand, markets, or specialties."
                  value={values.description ?? ''}
                  onChange={event => onChange('description', event.target.value)}
                  aria-invalid={!!errors.description}
                  rows={4}
                />
                {errors.description?.map((error, index) => (
                  <FieldError key={`${error}-${index}`}>{error}</FieldError>
                ))}
              </Field>
            </FieldGroup>
          </FieldSet>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : mode === 'create' ? 'Create company' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
