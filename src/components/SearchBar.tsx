import { Search } from 'lucide-react'

type Props = {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}

export default function SearchBar({ value, onChange, placeholder = 'ej., Marriott' }: Props) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Busca por nombre de la propiedad</label>
      <div className="flex items-center border rounded-lg px-3 py-2 w-full max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground mr-2" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="outline-none flex-1 text-sm"
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}
