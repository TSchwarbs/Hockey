import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all duration-200 outline-none select-none cursor-pointer active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-40 focus-visible:shadow-[0_0_0_2px_rgba(0,212,255,0.4)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "rounded-full bg-ice text-background text-sm hover:bg-white hover:-translate-y-0.5",
        outline:
          "rounded-xl border-border/60 bg-transparent text-ice hover:border-ice/50 hover:bg-ice/8 text-sm",
        secondary:
          "rounded-xl bg-surface-2 text-steel hover:bg-surface-2/80 text-sm",
        ghost:
          "rounded-lg bg-transparent text-muted-text hover:text-text-primary hover:bg-surface-2 text-sm",
        destructive:
          "rounded-xl bg-danger/10 text-danger border-danger/20 hover:bg-danger/20 text-sm",
        link: "text-ice underline-offset-4 hover:underline text-sm",
      },
      size: {
        default: "h-9 gap-1.5 px-4",
        xs: "h-6 gap-1 rounded-lg px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 px-3 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 px-6 text-base",
        icon: "size-9 rounded-xl",
        "icon-xs": "size-6 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-lg",
        "icon-lg": "size-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
