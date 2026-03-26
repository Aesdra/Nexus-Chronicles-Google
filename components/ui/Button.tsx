import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-stone-700 text-amber-100 shadow hover:bg-stone-700/90 border border-stone-600",
        destructive:
          "bg-red-800 text-red-50 shadow-sm hover:bg-red-800/90 border border-red-700",
        outline:
          "border border-stone-600 bg-transparent shadow-sm hover:bg-stone-800 hover:text-amber-100",
        secondary:
          "bg-stone-800 text-amber-100 shadow-sm hover:bg-stone-800/80 border border-stone-700",
        ghost: "hover:bg-stone-800 hover:text-amber-100",
        link: "text-primary underline-offset-4 hover:underline",
        menu: "w-full text-xl font-medieval p-2 bg-stone-700/80 hover:bg-stone-600/80 rounded-md text-amber-200 hover:text-white transition-colors"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)


// FIX: Changed interface to type to resolve type extension issues.
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        // FIX: Corrected usage of cva with cn. The className prop should be passed to cn separately to allow for merging and overriding styles.
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }