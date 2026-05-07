"use client"

export const dynamic = 'force-dynamic'


import { useState } from "react"
import useSWR from "swr"
import { TableCell } from "@/components/ui/table"
import { Users, ShieldCheck, Pencil } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  AdminPageHeader,
  AdminSearch,
  AdminDataTable,
  AdminPagination,
  StatusBadge,
} from "@/components/admin"
import { useEffect } from "react"

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
  { key: "actions", label: "Actions", className: "text-right" },
]

export default function AdminUsersPage() {
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  const { data: response, isLoading } = useSWR(
    `/api/admin/users?page=${page}&search=${debouncedSearch}`, 
    fetcher,
    { keepPreviousData: true }
  )
  
  const users: UserRow[] = response?.data || []
  const meta = response?.meta

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Users" subtitle="Customer directory" />

      <AdminSearch
        value={search}
        onChange={setSearch}
        placeholder="Search by name, email, phone..."
      />

      <AdminDataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        emptyIcon={<Users className="h-8 w-8 opacity-50" />}
        emptyMessage={debouncedSearch ? "No users matching your search." : "No users found."}
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
            <TableCell className="text-right">
              <Link href={`/admin/users/${user.id}/edit`}>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800">
                  <Pencil className="h-4 w-4" />
                </Button>
              </Link>
            </TableCell>
          </>
        )}
      />

      {meta && <AdminPagination meta={meta} page={page} onPageChange={setPage} label="users" />}

      <p className="text-xs text-zinc-600 pt-2">
        Showing {users.length} of {meta?.total || 0} users
      </p>
    </div>
  )
}
