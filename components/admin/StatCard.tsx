import { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  iconBg: string // e.g. "bg-emerald-500/10 border-emerald-500/20"
  iconColor: string // e.g. "text-emerald-400"
  isLoading?: boolean
}

export function StatCard({
  title,
  value,
  icon,
  iconBg,
  isLoading = false,
}: StatCardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl relative overflow-hidden group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-zinc-400 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-white mt-2">
            {isLoading ? "..." : value}
          </h3>
        </div>
        <div className={`p-3 rounded-lg border ${iconBg}`}>
          {icon}
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-zinc-800/20 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  )
}
