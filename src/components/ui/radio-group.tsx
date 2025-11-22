import * as React from "react"
import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { onValueChange?: (value: string) => void, value?: string }
>(({ className, onValueChange, value, children, ...props }, ref) => {
  // This is a simplified RadioGroup that relies on children RadioGroupItems to handle their own state via context if needed,
  // but for simplicity in this "agentic" mode without full Radix, we'll just pass props down or expect controlled usage.
  // Actually, to make it work like Radix, we need Context.
  
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div className={cn("grid gap-2", className)} ref={ref} {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
})
RadioGroup.displayName = "RadioGroup"

const RadioGroupContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
}>({})

const RadioGroupItem = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { value: string }
>(({ className, value, ...props }, ref) => {
  const context = React.useContext(RadioGroupContext)
  const isChecked = context.value === value

  return (
    <div className="relative flex items-center">
      <input
        type="radio"
        className={cn(
          "peer h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer",
          className
        )}
        ref={ref}
        value={value}
        checked={isChecked}
        onChange={() => context.onValueChange?.(value)}
        {...props}
      />
      <span className="absolute left-1 top-1 h-2 w-2 rounded-full bg-primary hidden peer-checked:block pointer-events-none" />
    </div>
  )
})
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
