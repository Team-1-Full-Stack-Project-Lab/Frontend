import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

type AlertType = "success" | "error" | "warning" | "info"

interface AlertNotificationProps {
  type?: AlertType
  title: string
  description?: string
  className?: string
}

const alertConfig = {
  success: {
    icon: CheckCircle2,
    className: "max-w-md mx-auto border-green-500 text-green-700 bg-green-50",
  },
  error: {
    icon: XCircle,
    className: "max-w-md mx-auto border-red-500 text-red-700 bg-red-50",
  },
  warning: {
    icon: AlertCircle,
    className: "max-w-md mx-auto border-yellow-500 text-yellow-700 bg-yellow-50",
  },
  info: {
    icon: Info,
    className: "max-w-md mx-auto border-blue-500 text-blue-700 bg-blue-50",
  },
}

export function AlertNotification({
  type = "info",
  title,
  description,
  className,
}: AlertNotificationProps) {
  const { icon: Icon, className: typeClassName } = alertConfig[type]

  return (
    <Alert className={cn(typeClassName, className)}>
      <Icon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  )
}