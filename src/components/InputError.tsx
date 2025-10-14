import { cn } from '@/lib/utils'

type Props = React.HTMLAttributes<HTMLParagraphElement> & {
  message?: string | null
}

export function InputError({ message, className = '', ...props }: Props) {
  return message ? (
    <p className={cn('text-sm text-red-600', className)} {...props}>
      {message}
    </p>
  ) : null
}
