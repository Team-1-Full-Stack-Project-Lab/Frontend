import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface HelpSearchBarProps {
  onSearch: (query: string) => void
}

export function HelpSearchBar({ onSearch }: HelpSearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-3xl items-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="How can we help you?"
          className="h-12 border-input bg-background pl-10 text-base shadow-sm placeholder:text-muted-foreground focus-visible:ring-primary"
        />
      </div>
      <Button type="submit" size="lg" className="h-12 px-8 text-base font-medium">
        Search
      </Button>
    </form>
  )
}
