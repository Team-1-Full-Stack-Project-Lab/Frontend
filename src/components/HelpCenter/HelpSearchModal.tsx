import { ChevronRight } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface SearchResult {
  title: string
  categoryTitle: string
  categoryId: string
}

interface HelpSearchModalProps {
  isOpen: boolean
  onClose: () => void
  query: string
  results: SearchResult[]
  onResultClick: (result: SearchResult) => void
}

export function HelpSearchModal({
  isOpen,
  onClose,
  query,
  results,
  onResultClick,
}: HelpSearchModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold capitalize">{query}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-y-auto">
          {results.length > 0 ? (
            <div className="space-y-2">
              {results.map((result, index) => (
                <button
                  key={index}
                  onClick={() => onResultClick(result)}
                  className="flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors hover:bg-muted/50"
                >
                  <div>
                    <h3 className="font-medium text-foreground">{result.title}</h3>
                    <p className="text-sm text-muted-foreground">{result.categoryTitle}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No results found for "{query}"
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
