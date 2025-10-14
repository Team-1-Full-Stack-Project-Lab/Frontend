import { cn } from '@/lib/utils'
import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router-dom'
import { buttonVariants } from './ui/button'

interface Props extends RouterLinkProps {
  className?: string
}

export default function Link({ to, className, ...props }: Props) {
  return <RouterLink to={to} className={cn(buttonVariants({ variant: 'link' }), 'px-0', className)} {...props} />
}
