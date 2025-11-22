import { cn } from "@/lib/utils"

interface DateBadgeProps {
    children: React.ReactNode
    variant?: "light" | "primary"
    className?: string
}

export function DateBadge({
    children,
    variant = "light",
    className
}: DateBadgeProps) {
    const baseClasses = "rounded-10px backdrop-blur-sm px-3 py-1 sm:px-3 text-sm font-medium self-start sm:self-auto"

    const variantClasses = {
        light: "bg-white/15 text-white",
        primary: "bg-brand/15 text-brand"
    }

    return (
        <span className={cn(baseClasses, variantClasses[variant], className)}>
            {children}
        </span>
    )
}