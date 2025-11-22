import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

interface PrimaryButtonProps {
    children: React.ReactNode
    className?: string
    onClick?: () => void
}

export function PrimaryButton({
    children,
    className,
    onClick
}: PrimaryButtonProps) {
    const baseClasses = "rounded-10px bg-primary-color px-4 py-2 sm:px-6 sm:py-3 md:py-5 text-sm sm:text-base md:text-lg font-medium text-white hover:bg-primary-color/90 cursor-pointer flex items-center gap-2"

    return (
        <Button className={cn(baseClasses, className)} onClick={onClick}>
            {children}
        </Button>
    )
}