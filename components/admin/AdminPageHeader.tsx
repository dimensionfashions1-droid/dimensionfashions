"use client"

import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

interface AdminPageHeaderProps {
  title: string
  subtitle: string
  actionLabel?: string
  actionHref?: string
  actionOnClick?: () => void
  actionIcon?: ReactNode
}

export function AdminPageHeader({
  title,
  subtitle,
  actionLabel,
  actionHref,
  actionOnClick,
  actionIcon,
}: AdminPageHeaderProps) {
  const actionButton = actionLabel ? (
    <Button
      onClick={actionOnClick}
      className="h-11 rounded-xl border border-white/10 bg-white text-zinc-950 shadow-[0_12px_32px_rgba(255,255,255,0.08)] hover:bg-zinc-100 font-medium gap-2"
    >
      {actionIcon || <Plus className="h-4 w-4" />}
      {actionLabel}
    </Button>
  ) : null

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
        <p className="text-zinc-400 text-sm mt-1">{subtitle}</p>
      </div>
      {actionButton && (
        actionHref ? <Link href={actionHref}>{actionButton}</Link> : actionButton
      )}
    </div>
  )
}
