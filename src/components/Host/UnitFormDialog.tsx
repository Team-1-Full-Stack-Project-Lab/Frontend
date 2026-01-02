import { useState, useEffect, type FormEvent } from 'react'
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
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import type { ValidationError, StayUnit } from '@/types'

export interface UnitFormValues {
  stayNumber: string
  roomType: string
  numberOfBeds: number
  capacity: number
  pricePerNight: number
}

interface UnitFormDialogProps {
  open: boolean
  mode: 'create' | 'edit'
  loading: boolean
  unit?: StayUnit | null
  errors: ValidationError
  onOpenChange: (open: boolean) => void
  onSubmit: (values: UnitFormValues) => void
}

export function UnitFormDialog({ open, mode, loading, unit, errors, onOpenChange, onSubmit }: UnitFormDialogProps) {
  const [values, setValues] = useState<UnitFormValues>({
    stayNumber: '',
    roomType: '',
    numberOfBeds: 1,
    capacity: 1,
    pricePerNight: 0,
  })

  useEffect(() => {
    if (unit) {
      setValues({
        stayNumber: unit.stayNumber,
        roomType: unit.roomType,
        numberOfBeds: unit.numberOfBeds,
        capacity: unit.capacity,
        pricePerNight: unit.pricePerNight,
      })
    } else {
      setValues({
        stayNumber: '',
        roomType: '',
        numberOfBeds: 1,
        capacity: 1,
        pricePerNight: 0,
      })
    }
  }, [unit, open])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(values)
  }

  const handleChange = (field: keyof UnitFormValues, value: string | number) => {
    setValues(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <form onSubmit={handleSubmit} className="grid gap-6">
          <DialogHeader>
            <DialogTitle>{mode === 'create' ? 'Add Unit' : 'Edit Unit'}</DialogTitle>
            <DialogDescription>
              {mode === 'create' ? 'Add a new unit to your stay.' : 'Update the details of this unit.'}
            </DialogDescription>
          </DialogHeader>
          <FieldSet>
            <FieldGroup className="gap-4">
              <Field data-invalid={!!errors.stayNumber}>
                <FieldLabel htmlFor="stayNumber">Unit Number</FieldLabel>
                <Input
                  id="stayNumber"
                  name="stayNumber"
                  placeholder="101, Suite A, etc."
                  value={values.stayNumber}
                  onChange={e => handleChange('stayNumber', e.target.value)}
                  aria-invalid={!!errors.stayNumber}
                  required
                />
                {errors.stayNumber?.map((error, index) => (
                  <FieldError key={`${error}-${index}`}>{error}</FieldError>
                ))}
              </Field>

              <Field data-invalid={!!errors.roomType}>
                <FieldLabel htmlFor="roomType">Room Type</FieldLabel>
                <Input
                  id="roomType"
                  name="roomType"
                  placeholder="Single, Double, Suite, etc."
                  value={values.roomType}
                  onChange={e => handleChange('roomType', e.target.value)}
                  aria-invalid={!!errors.roomType}
                  required
                />
                {errors.roomType?.map((error, index) => (
                  <FieldError key={`${error}-${index}`}>{error}</FieldError>
                ))}
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field data-invalid={!!errors.numberOfBeds}>
                  <FieldLabel htmlFor="numberOfBeds">Number of Beds</FieldLabel>
                  <Input
                    id="numberOfBeds"
                    name="numberOfBeds"
                    type="number"
                    min="1"
                    value={values.numberOfBeds}
                    onChange={e => handleChange('numberOfBeds', parseInt(e.target.value))}
                    aria-invalid={!!errors.numberOfBeds}
                    required
                  />
                  {errors.numberOfBeds?.map((error, index) => (
                    <FieldError key={`${error}-${index}`}>{error}</FieldError>
                  ))}
                </Field>

                <Field data-invalid={!!errors.capacity}>
                  <FieldLabel htmlFor="capacity">Capacity</FieldLabel>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    value={values.capacity}
                    onChange={e => handleChange('capacity', parseInt(e.target.value))}
                    aria-invalid={!!errors.capacity}
                    required
                  />
                  {errors.capacity?.map((error, index) => (
                    <FieldError key={`${error}-${index}`}>{error}</FieldError>
                  ))}
                </Field>
              </div>

              <Field data-invalid={!!errors.pricePerNight}>
                <FieldLabel htmlFor="pricePerNight">Price per Night ($)</FieldLabel>
                <Input
                  id="pricePerNight"
                  name="pricePerNight"
                  type="number"
                  min="0"
                  step="0.01"
                  value={values.pricePerNight}
                  onChange={e => handleChange('pricePerNight', parseFloat(e.target.value))}
                  aria-invalid={!!errors.pricePerNight}
                  required
                />
                {errors.pricePerNight?.map((error, index) => (
                  <FieldError key={`${error}-${index}`}>{error}</FieldError>
                ))}
              </Field>
            </FieldGroup>
          </FieldSet>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : mode === 'create' ? 'Add Unit' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
