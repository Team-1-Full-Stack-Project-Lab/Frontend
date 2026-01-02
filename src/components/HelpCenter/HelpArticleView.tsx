import { X, ExternalLink, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Article {
  title: string
  content?: string
  links?: { label: string; url: string }[]
}

interface HelpArticleViewProps {
  isOpen: boolean
  onClose: () => void
  category: {
    title: string
    icon: LucideIcon
    articles: Article[]
  } | null
}

export function HelpArticleView({ isOpen, onClose, category }: HelpArticleViewProps) {
  if (!category) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Side Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md transform bg-background shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <category.icon className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold">{category.title}</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-8">
              {category.articles.map((article, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="text-lg font-medium text-foreground">{article.title}</h3>
                  {article.content && (
                    <p className="text-sm leading-relaxed text-muted-foreground">{article.content}</p>
                  )}
                  {article.links && article.links.length > 0 && (
                    <ul className="space-y-2">
                      {article.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                          >
                            {link.label}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t bg-muted/20 p-6">
            <div className="text-center">
              <p className="mb-4 text-sm font-medium text-foreground">Was this article helpful?</p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" className="h-10 w-10 rounded-full p-0">
                  👍
                </Button>
                <Button variant="outline" className="h-10 w-10 rounded-full p-0">
                  👎
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
