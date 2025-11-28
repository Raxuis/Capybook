import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "bg-transparent text-primary shadow-xs hover:bg-primary/10 data-[state=open]:bg-primary/10",
        link: "text-primary underline-offset-4 hover:underline",
        light: "bg-primary/10 text-primary hover:bg-primary/20 focus-visible:ring-primary/20",
        success: "bg-green-600 text-white shadow-sm hover:bg-green-700 focus-visible:ring-green-600/20 dark:bg-green-700 dark:hover:bg-green-800",
        warning: "bg-yellow-500 text-white shadow-sm hover:bg-yellow-600 focus-visible:ring-yellow-500/20 dark:bg-yellow-600 dark:hover:bg-yellow-700",
        info: "bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus-visible:ring-blue-600/20 dark:bg-blue-700 dark:hover:bg-blue-800",
        gradient: "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm hover:from-purple-600 hover:to-pink-600 focus-visible:ring-purple-500/20",
        glassmorphism: "bg-white/10 backdrop-blur-md border border-white/20 text-foreground shadow-lg hover:bg-white/20 focus-visible:ring-white/20",
        neon: "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:bg-cyan-400 focus-visible:ring-cyan-500/20 transition-all duration-300",
        minimal: "bg-gray-50 text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-300/20 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",
        notes: "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 hover:border-amber-300 focus-visible:ring-amber-500/20 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800 dark:hover:bg-amber-900/30",
        notebook: "bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 hover:border-orange-300 focus-visible:ring-orange-500/20 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800 dark:hover:bg-orange-900/30",
        paper: "bg-yellow-50 text-yellow-800 border border-yellow-200 hover:bg-yellow-100 hover:border-yellow-300 focus-visible:ring-yellow-500/20 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800 dark:hover:bg-yellow-900/30",
        document: "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 focus-visible:ring-slate-500/20 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700",
        parchment: "bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100 hover:border-stone-300 focus-visible:ring-stone-500/20 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700 dark:hover:bg-stone-700",
        ink: "bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 focus-visible:ring-indigo-500/20 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800 dark:hover:bg-indigo-900/30",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
