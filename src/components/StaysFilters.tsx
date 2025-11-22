import { useEffect, useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import PriceFilter from '@/components/PriceFilter'
import { Search } from 'lucide-react'
import { useServices } from '@/hooks/useServices'
import type { Service, StayType, Stay } from '@/types'

export interface FilterState {
  propertyName: string
  priceRange: [number, number]
  priceType: 'nightly' | 'total'
  amenities: number[]
  stayTypes: number[]
  popularFilters: string[]
  starRatings: number[]
  guestRating: string
  brands: string[]
}

interface StaysFiltersProps {
  onFilterChange: (filters: FilterState) => void
  className?: string
  stays?: Stay[]
}

export function StaysFilters({ onFilterChange, className, stays = [] }: StaysFiltersProps) {
  const { stayService } = useServices()
  const [services, setServices] = useState<Service[]>([])
  const [stayTypes, setStayTypes] = useState<StayType[]>([])
  
  const [filters, setFilters] = useState<FilterState>({
    propertyName: '',
    priceRange: [0, 1000],
    priceType: 'nightly',
    amenities: [],
    stayTypes: [],
    popularFilters: [],
    starRatings: [],
    guestRating: 'any',
    brands: []
  })

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [loadedServices, loadedStayTypes] = await Promise.all([
          stayService.getAllServices(),
          stayService.getAllStayTypes()
        ])
        setServices(loadedServices)
        setStayTypes(loadedStayTypes)
      } catch (error) {
        console.error('Failed to load filter options:', error)
      }
    }
    loadOptions()
  }, [stayService])

  useEffect(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  // Helper to calculate "From $X"
  const getMinPriceForFilter = useMemo(() => {
    return (filterFn: (stay: Stay) => boolean) => {
      const matchingStays = stays.filter(filterFn)
      if (matchingStays.length === 0) return null
      const prices = matchingStays.flatMap(s => s.units?.map(u => u.pricePerNight) || [])
      if (prices.length === 0) return null
      return Math.min(...prices)
    }
  }, [stays])

  const handleAmenityChange = (serviceId: number, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, serviceId]
        : prev.amenities.filter(id => id !== serviceId)
    }))
  }

  const handleStayTypeChange = (typeId: number, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      stayTypes: checked
        ? [...prev.stayTypes, typeId]
        : prev.stayTypes.filter(id => id !== typeId)
    }))
  }

  const handleStarRatingChange = (rating: number, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      starRatings: checked
        ? [...prev.starRatings, rating]
        : prev.starRatings.filter(r => r !== rating)
    }))
  }

  const handleBrandChange = (brand: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      brands: checked
        ? [...prev.brands, brand]
        : prev.brands.filter(b => b !== brand)
    }))
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search by property name */}
      <div>
        <h3 className="font-semibold mb-3">Search by property name</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="e.g. Marriott"
            value={filters.propertyName}
            onChange={e => setFilters(prev => ({ ...prev, propertyName: e.target.value }))}
            className="pl-9"
          />
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="font-semibold mb-3">Price</h3>
        <RadioGroup 
          value={filters.priceType}
          onValueChange={(val: string) => setFilters(prev => ({ ...prev, priceType: val as 'nightly' | 'total' }))}
          className="mb-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="nightly" id="nightly" />
            <Label htmlFor="nightly">Nightly price</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="total" id="total" />
            <Label htmlFor="total">Total price</Label>
          </div>
        </RadioGroup>

        <PriceFilter 
          min={filters.priceRange[0]}
          max={filters.priceRange[1]}
          onChange={(min, max) => setFilters(prev => ({ ...prev, priceRange: [min, max] }))}
        />
      </div>

      {/* Star Rating */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Star rating</h3>
          <span className="text-xs font-medium text-muted-foreground">From</span>
        </div>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map(stars => {
            const minPrice = getMinPriceForFilter(s => (s.rating || 0) >= stars && (s.rating || 0) < stars + 1)
            return (
              <div key={stars} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={`star-${stars}`} 
                    checked={filters.starRatings.includes(stars)}
                    onCheckedChange={(checked: boolean) => handleStarRatingChange(stars, checked)}
                  />
                  <Label htmlFor={`star-${stars}`}>{stars} stars</Label>
                </div>
                {minPrice !== null && <span className="text-sm text-muted-foreground">${minPrice}</span>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Guest Rating */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Guest rating</h3>
          <span className="text-xs font-medium text-muted-foreground">From</span>
        </div>
        <RadioGroup 
          value={filters.guestRating} 
          onValueChange={(val: string) => setFilters(prev => ({ ...prev, guestRating: val }))}
          className="space-y-2"
        >
          {[
            { val: 'any', label: 'Any' },
            { val: '9', label: 'Wonderful 9+' },
            { val: '8', label: 'Very good 8+' },
            { val: '7', label: 'Good 7+' }
          ].map(opt => {
             const minPrice = opt.val === 'any' 
               ? getMinPriceForFilter(() => true)
               : getMinPriceForFilter(s => (s.rating || 0) >= Number(opt.val))
             
             return (
              <div key={opt.val} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={opt.val} id={`guest-${opt.val}`} />
                  <Label htmlFor={`guest-${opt.val}`}>{opt.label}</Label>
                </div>
                {minPrice !== null && <span className="text-sm text-muted-foreground">${minPrice}</span>}
              </div>
            )
          })}
        </RadioGroup>
      </div>

      {/* Stay Types */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Property type</h3>
          <span className="text-xs font-medium text-muted-foreground">From</span>
        </div>
        <div className="space-y-2">
          {stayTypes.map(type => {
            const minPrice = getMinPriceForFilter(s => s.stayType?.id === type.id)
            return (
              <div key={type.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={`type-${type.id}`} 
                    checked={filters.stayTypes.includes(type.id)}
                    onCheckedChange={(checked: boolean) => handleStayTypeChange(type.id, checked)}
                  />
                  <Label htmlFor={`type-${type.id}`}>{type.name}</Label>
                </div>
                {minPrice !== null && <span className="text-sm text-muted-foreground">${minPrice}</span>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Property Brand (Mocked) */}
      <div>
        <h3 className="font-semibold mb-3">Property brand</h3>
        <div className="space-y-2">
          {['NH Collection', 'Wyndham Hotels', 'Holiday Inn Express'].map(brand => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox 
                id={`brand-${brand}`} 
                checked={filters.brands.includes(brand)}
                onCheckedChange={(checked: boolean) => handleBrandChange(brand, checked)}
              />
              <Label htmlFor={`brand-${brand}`}>{brand}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h3 className="font-semibold mb-3">Amenities</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {services.map(service => (
            <div key={service.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`amenity-${service.id}`} 
                checked={filters.amenities.includes(service.id)}
                onCheckedChange={(checked: boolean) => handleAmenityChange(service.id, checked)}
              />
              <Label htmlFor={`amenity-${service.id}`}>{service.name}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
