import { ChevronRight, type LucideIcon } from 'lucide-react'

interface HelpCategoryCardProps {
  icon: LucideIcon
  title: string
  onClick: () => void
}

export function HelpCategoryCard({ icon: Icon, title, onClick }: HelpCategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center justify-between rounded-xl border border-border bg-card p-6 text-left transition-all hover:border-primary/50 hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 text-primary transition-colors group-hover:bg-primary/10">
          <Icon className="h-6 w-6" />
        </div>
        <span className="text-lg font-medium text-foreground">{title}</span>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
    </button>
  )
}
