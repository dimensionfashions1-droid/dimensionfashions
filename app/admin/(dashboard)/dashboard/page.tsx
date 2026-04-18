"use client"

import useSWR from "swr"
import { LayoutDashboard, Users, AlertCircle, IndianRupee } from "lucide-react"
import { StatCard } from "@/components/admin"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function AdminDashboardPage() {
  const { data: response, isLoading } = useSWR("/api/admin/stats", fetcher)

  const stats = response?.data || {
    totalRevenue: 0,
    totalOrders: 0,
    outOfStock: 0,
    newSubscribers: 0,
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Dashboard Overview</h1>
        <p className="text-zinc-400">Welcome to your Dimensions administrative backbone.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={<IndianRupee className="w-6 h-6 text-emerald-400" />}
          iconBg="bg-emerald-500/10 border-emerald-500/20"
          iconColor="text-emerald-400"
          isLoading={isLoading}
        />
        <StatCard
          title="Global Orders"
          value={stats.totalOrders}
          icon={<LayoutDashboard className="w-6 h-6 text-indigo-400" />}
          iconBg="bg-indigo-500/10 border-indigo-500/20"
          iconColor="text-indigo-400"
          isLoading={isLoading}
        />
        <StatCard
          title="Out of Stock"
          value={stats.outOfStock}
          icon={<AlertCircle className="w-6 h-6 text-rose-400" />}
          iconBg="bg-rose-500/10 border-rose-500/20"
          iconColor="text-rose-400"
          isLoading={isLoading}
        />
        <StatCard
          title="Subscribers"
          value={stats.newSubscribers}
          icon={<Users className="w-6 h-6 text-blue-400" />}
          iconBg="bg-blue-500/10 border-blue-500/20"
          iconColor="text-blue-400"
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 min-h-[300px]">
          <h4 className="text-lg font-medium text-white border-b border-zinc-800 pb-4 mb-4">Recent Fulfillment Pipeline</h4>
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-zinc-800/50 rounded-lg w-full"></div>
              <div className="h-10 bg-zinc-800/50 rounded-lg w-full"></div>
              <div className="h-10 bg-zinc-800/50 rounded-lg w-full"></div>
            </div>
          ) : (
            <div className="text-zinc-500 flex flex-col items-center justify-center p-8 space-y-3">
              <AlertCircle className="w-8 h-8 opacity-50" />
              <p>No recent orders detected within your active lifecycle logs.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
