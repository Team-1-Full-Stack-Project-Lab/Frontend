import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { SearchableSelect, type SearchableSelectOption } from '@/components/SearchableSelect'
import { ImageUrlsManager } from '@/components/Host/ImageUrlsManager'
import { useServices } from '@/hooks/useServices'
import { getToken } from '@/services/rest/authService'
import { ApiException } from '@/utils/exceptions'
import type { Service, StayType, ValidationError, Stay } from '@/types'

export default function EditStayPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { stayService, cityService, serviceService } = useServices()

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [citiesOptions, setCitiesOptions] = useState<SearchableSelectOption[]>([])
  const [searchQuery, setSearchQuery] = useState<string>()
  const [stayTypes, setStayTypes] = useState<StayType[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [errors, setErrors] = useState<ValidationError>({})
  const [stay, setStay] = useState<Stay | null>(null)

  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    cityId: '',
    stayTypeId: '',
    selectedServices: [] as number[],
    imageUrls: [] as string[],
  })

  const loadCities = async (params?: { name?: string; featured?: boolean }) => {
    try {
      const result = await cityService.getCities(params)
      const citiesArray = Array.isArray(result) ? result : result.content
      const options = citiesArray.map(city => ({
        value: city.id.toString(),
        label: `${city.name}, ${city.country?.name || ''}`,
      }))

      // Keep current city in options if it exists and is not in the results
      if (stay?.city && stay.city.country && !options.find(opt => opt.value === stay.city!.id.toString())) {
        options.unshift({
          value: stay.city.id.toString(),
          label: `${stay.city.name}, ${stay.city.country.name}`,
        })
      }

      setCitiesOptions(options)
    } catch (error) {
      console.error('Error loading cities:', error)
    }
  }

  const loadData = async () => {
    if (!id) return

    try {
      setInitialLoading(true)
      const [typesResult, servicesResult, stayResult] = await Promise.all([
        stayService.getAllStayTypes(),
        serviceService.getAllServices(),
        stayService.getStayById(parseInt(id)),
      ])

      setStayTypes(typesResult)
      setServices(servicesResult)
      setStay(stayResult)

      // Pre-populate form
      setFormValues({
        name: stayResult.name,
        description: stayResult.description || '',
        address: stayResult.address,
        latitude: stayResult.latitude.toString(),
        longitude: stayResult.longitude.toString(),
        cityId: stayResult.city?.id.toString() || '',
        stayTypeId: stayResult.stayType?.id.toString() || '',
        selectedServices: stayResult.services?.map(s => s.id) || [],
        imageUrls: stayResult.images?.map(img => img.link) || [],
      })

      // Set city option
      if (stayResult.city && stayResult.city.country) {
        setCitiesOptions([
          {
            value: stayResult.city.id.toString(),
            label: `${stayResult.city.name}, ${stayResult.city.country.name}`,
          },
        ])
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load stay details')
      navigate('/host/stays')
    } finally {
      setInitialLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    const t = setTimeout(() => {
      if (!searchQuery || searchQuery.trim() === '') {
        loadCities({ featured: true })
      } else {
        loadCities({ name: searchQuery })
      }
    }, 300)

    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  const handleServiceToggle = (serviceId: number) => {
    setFormValues(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId],
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!id) return

    setErrors({})

    try {
      setLoading(true)
      const token = getToken()
      if (!token) throw new Error('No token found')

      const payload = {
        name: formValues.name.trim(),
        description: formValues.description.trim(),
        address: formValues.address.trim(),
        latitude: parseFloat(formValues.latitude),
        longitude: parseFloat(formValues.longitude),
        cityId: parseInt(formValues.cityId),
        stayTypeId: parseInt(formValues.stayTypeId),
        serviceIds: formValues.selectedServices,
        imageUrls: formValues.imageUrls,
      }

      await stayService.updateStay(parseInt(id), payload, token)
      toast.success('Stay updated successfully')
      navigate(`/host/stays/${id}`)
    } catch (error) {
      if (error instanceof ApiException && error.status === 400 && error.apiError.errors) {
        setErrors(error.apiError.errors)
        return
      }
      console.error('Error updating stay:', error)
      toast.error('Failed to update stay')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="space-y-6">
        <title>Edit Stay</title>
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="h-96 bg-muted animate-pulse rounded" />
      </div>
    )
  }

  if (!stay) {
    return (
      <div>
        <title>Stay Not Found</title>
        <div>Stay not found</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <title>Edit {stay.name}</title>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/host/stays/${id}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h3 className="text-lg font-medium">Edit Stay</h3>
          <p className="text-sm text-muted-foreground">Update your property information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
            <CardDescription>Update the information about your property.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FieldSet>
              <FieldGroup className="gap-4">
                <Field data-invalid={!!errors.name}>
                  <FieldLabel htmlFor="name">Property Name</FieldLabel>
                  <Input
                    id="name"
                    value={formValues.name}
                    onChange={e => setFormValues(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                  {errors.name?.map((error, index) => (
                    <FieldError key={`${error}-${index}`}>{error}</FieldError>
                  ))}
                </Field>

                <Field data-invalid={!!errors.description}>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Textarea
                    id="description"
                    value={formValues.description}
                    onChange={e => setFormValues(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    required
                  />
                  {errors.description?.map((error, index) => (
                    <FieldError key={`${error}-${index}`}>{error}</FieldError>
                  ))}
                </Field>

                <div className="grid md:grid-cols-2 gap-4">
                  <Field data-invalid={!!errors.cityId}>
                    <FieldLabel htmlFor="city">City</FieldLabel>
                    <SearchableSelect
                      options={citiesOptions}
                      value={formValues.cityId}
                      onValueChange={value => setFormValues(prev => ({ ...prev, cityId: value }))}
                      onQueryChange={q => setSearchQuery(q)}
                      placeholder="Select a city..."
                      searchPlaceholder="Search cities..."
                    />
                    {errors.cityId?.map((error, index) => (
                      <FieldError key={`${error}-${index}`}>{error}</FieldError>
                    ))}
                  </Field>

                  <Field data-invalid={!!errors.stayTypeId}>
                    <FieldLabel htmlFor="stayType">Property Type</FieldLabel>
                    <SearchableSelect
                      options={stayTypes.map(type => ({
                        value: type.id.toString(),
                        label: type.name,
                      }))}
                      value={formValues.stayTypeId}
                      onValueChange={value => setFormValues(prev => ({ ...prev, stayTypeId: value }))}
                      placeholder="Select type..."
                      searchPlaceholder="Search types..."
                    />
                    {errors.stayTypeId?.map((error, index) => (
                      <FieldError key={`${error}-${index}`}>{error}</FieldError>
                    ))}
                  </Field>
                </div>

                <Field data-invalid={!!errors.address}>
                  <FieldLabel htmlFor="address">Address</FieldLabel>
                  <Input
                    id="address"
                    value={formValues.address}
                    onChange={e => setFormValues(prev => ({ ...prev, address: e.target.value }))}
                    required
                  />
                  {errors.address?.map((error, index) => (
                    <FieldError key={`${error}-${index}`}>{error}</FieldError>
                  ))}
                </Field>

                <div className="grid md:grid-cols-2 gap-4">
                  <Field data-invalid={!!errors.latitude}>
                    <FieldLabel htmlFor="latitude">Latitude</FieldLabel>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={formValues.latitude}
                      onChange={e => setFormValues(prev => ({ ...prev, latitude: e.target.value }))}
                      required
                    />
                    {errors.latitude?.map((error, index) => (
                      <FieldError key={`${error}-${index}`}>{error}</FieldError>
                    ))}
                  </Field>

                  <Field data-invalid={!!errors.longitude}>
                    <FieldLabel htmlFor="longitude">Longitude</FieldLabel>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={formValues.longitude}
                      onChange={e => setFormValues(prev => ({ ...prev, longitude: e.target.value }))}
                      required
                    />
                    {errors.longitude?.map((error, index) => (
                      <FieldError key={`${error}-${index}`}>{error}</FieldError>
                    ))}
                  </Field>
                </div>

                <Field data-invalid={!!errors.serviceIds}>
                  <FieldLabel>Amenities & Services</FieldLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {services.map(service => (
                      <div key={service.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`service-${service.id}`}
                          checked={formValues.selectedServices.includes(service.id)}
                          onCheckedChange={() => handleServiceToggle(service.id)}
                        />
                        <Label htmlFor={`service-${service.id}`} className="text-sm font-normal cursor-pointer">
                          {service.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.serviceIds?.map((error, index) => (
                    <FieldError key={`${error}-${index}`}>{error}</FieldError>
                  ))}
                </Field>

                <Field data-invalid={!!errors.imageUrls}>
                  <FieldLabel>Image URLs</FieldLabel>
                  <ImageUrlsManager
                    imageUrls={formValues.imageUrls}
                    onChange={urls => setFormValues(prev => ({ ...prev, imageUrls: urls }))}
                    errors={errors.imageUrls}
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate(`/host/stays/${id}`)} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
