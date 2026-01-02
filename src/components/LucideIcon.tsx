import * as LucideIcons from 'lucide-react'
import { CircleDot } from 'lucide-react'

type IconsMap = Record<string, React.ComponentType<{ className?: string }>>

type Props = {
  name: string | undefined
  className?: string
}

export function LucideIcon({ name, className }: Props) {
  if (!name) return <CircleDot className={className} />

  const IconComponent = (LucideIcons as unknown as IconsMap)[name]

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in lucide-react`)
    return <CircleDot className={className} />
  }

  return <IconComponent className={className} />
}
