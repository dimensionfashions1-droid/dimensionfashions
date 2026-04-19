"use client"

export const dynamic = 'force-dynamic'


import { useState } from "react"
import useSWR from "swr"
import { TableCell } from "@/components/ui/table"
import { Users, ShieldCheck } from "lucide-react"
import {
  AdminPageHeader,
  AdminSearch,
  AdminDataTable,
  StatusBadge,
} from "@/components/admin"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface UserRow {
  id: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  is_admin: boolean
  created_at: string
  email?: string
}

const columns = [
  { key: "name", label: "Name" },
  { key: "phone", label: "Phone" },
  { key: "role", label: "Role" },
  { key: "joined", label: "Joined" },
]

export default function AdminUsersPage() {
  const [search, setSearch] = useState("")
  const { data: response, isLoading } = useSWR("/api/admin/users", fetcher)
  const users: UserRow[] = response?.data || []

  const filtered = search
    ? users.filter(u =>
        (u.first_name?.toLowerCase().includes(search.toLowerCase())) ||
        (u.last_name?.toLowerCase().includes(search.toLowerCase())) ||
        (u.email?.toLowerCase().includes(search.toLowerCase())) ||
        (u.phone?.includes(search))
      )
    : users

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Users" subtitle="Customer directory (read-only)" />

      <AdminSearch
        value={search}
        onChange={setSearch}
        placeholder="Search by name, email, phone..."
      />

      <AdminDataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        emptyIcon={<Users className="h-8 w-8 opacity-50" />}
        emptyMessage="No users found."
        keyExtractor={(u) => u.id}
        renderRow={(user) => (
          <>
            <TableCell>
              <p className="font-medium text-white text-sm">
                {user.first_name || ""} {user.last_name || ""}
                {!user.first_name && !user.last_name && <span className="text-zinc-500">—</span>}
              </p>
              {user.email && <p className="text-xs text-zinc-500">{user.email}</p>}
            </TableCell>
            <TableCell className="text-sm text-zinc-400">{user.phone || "—"}</TableCell>
            <TableCell>
              {user.is_admin ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-medium text-indigo-400 border border-indigo-500/20">
                  <ShieldCheck className="h-3 w-3" /> Admin
                </span>
              ) : (
                <span className="text-xs text-zinc-500">Customer</span>
              )}
            </TableCell>
            <TableCell className="text-sm text-zinc-400">{formatDate(user.created_at)}</TableCell>
          </>
        )}
      />

      <p className="text-xs text-zinc-600 pt-2">Showing {filtered.length} of {users.length} users</p>
    </div>
  )
}
