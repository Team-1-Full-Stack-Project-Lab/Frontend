import { Card } from "@/components/ui/card"

export function TypingIndicator() {
  return (
    <Card className="bg-card px-4 py-3">
      <div className="flex items-center gap-1.5">
        <div className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
        <div className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
        <div className="size-2 animate-bounce rounded-full bg-muted-foreground" />
      </div>
    </Card>
  )
}