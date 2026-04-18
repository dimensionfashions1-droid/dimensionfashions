import { cn } from "@/lib/utils"

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral"

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  danger: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  neutral: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
}

interface StatusBadgeProps {
  label: string
  variant: BadgeVariant
  className?: string
}

export function StatusBadge({ label, variant, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider border",
        variantStyles[variant],
        className
      )}
    >
      {label}
    </span>
  )
}
