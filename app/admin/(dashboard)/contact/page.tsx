"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import useSWR from "swr"
import { TableCell } from "@/components/ui/table"
import { Mail, User, Phone, MessageSquare, Calendar, Eye } from "lucide-react"
import {
  AdminPageHeader,
  AdminSearch,
  AdminDataTable,
  AdminPagination,
} from "@/components/admin"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  is_read: boolean
  created_at: string
}

const columns = [
  { key: "date", label: "Date" },
  { key: "name", label: "Name" },
  { key: "subject", label: "Subject" },
  { key: "actions", label: "Actions", className: "text-right" },
]

export default function AdminContactSubmissionsPage() {
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1) // Reset to page 1 on new search
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  const { data: response, isLoading } = useSWR(
    `/api/admin/contact?page=${page}&search=${debouncedSearch}`, 
    fetcher,
    { keepPreviousData: true }
  )
  
  const submissions: ContactSubmission[] = response?.data || []
  const meta = response?.meta || { total: 0, page: 1, totalPages: 1 }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", { 
      day: "2-digit", 
      month: "short", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Messages" subtitle="Customer inquiries and contact form submissions" />

      <AdminSearch
        value={search}
        onChange={setSearch}
        placeholder="Search by name, email, subject, message..."
      />

      <AdminDataTable
        columns={columns}
        data={submissions}
        isLoading={isLoading}
        emptyIcon={<Mail className="h-8 w-8 opacity-50" />}
        emptyMessage={debouncedSearch ? "No messages matching your search." : "No messages found."}
        keyExtractor={(s) => s.id}
        renderRow={(submission) => (
          <>
            <TableCell className="text-sm text-zinc-400 whitespace-nowrap">
              {formatDate(submission.created_at)}
            </TableCell>
            <TableCell>
              <p className="font-medium text-white text-sm">{submission.name}</p>
              <p className="text-xs text-zinc-500">{submission.email}</p>
            </TableCell>
            <TableCell className="max-w-[300px] truncate text-sm text-zinc-300">
              {submission.subject || <span className="text-zinc-500">No Subject</span>}
            </TableCell>
            <TableCell className="text-right">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800">
                    <Eye className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                      <Mail className="h-5 w-5 text-indigo-500" />
                      Message Details
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5" /> Sender
                        </p>
                        <p className="text-sm font-medium">{submission.name}</p>
                        <p className="text-sm text-zinc-400">{submission.email}</p>
                      </div>
                      {submission.phone && (
                        <div>
                          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5" /> Phone
                          </p>
                          <p className="text-sm">{submission.phone}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" /> Received On
                        </p>
                        <p className="text-sm text-zinc-300">{formatDate(submission.created_at)}</p>
                      </div>
                    </div>
                    <div>
                      <div>
                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <MessageSquare className="h-3.5 w-3.5" /> Subject
                        </p>
                        <p className="text-sm font-medium text-zinc-200">
                          {submission.subject || "No Subject"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 border-t border-zinc-800 pt-4">
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5" /> Message
                    </p>
                    <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800/50 min-h-[150px] whitespace-pre-wrap text-sm text-zinc-300 leading-relaxed">
                      {submission.message}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-zinc-800 hover:bg-zinc-900">
                        Close
                      </Button>
                    </DialogTrigger>
                  </div>
                </DialogContent>
              </Dialog>
            </TableCell>
          </>
        )}
      />

      <AdminPagination 
        meta={meta} 
        page={page} 
        onPageChange={setPage} 
        label="messages"
      />
    </div>
  )
}
