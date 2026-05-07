"use client"

export const dynamic = 'force-dynamic'


import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { TableCell } from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Eye, ClipboardList, Download } from "lucide-react"
import { generateInvoicePDF } from "@/lib/utils/invoice-generator"
import Link from "next/link"
import {
  AdminPageHeader,
  AdminSearch,
  AdminDataTable,
  AdminPagination,
  StatusBadge,
} from "@/components/admin"

const fetcher = (url: string) => fetch(url).then(res => res.json())

type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled" | "returned"
type PaymentStatus = "pending" | "paid" | "failed" | "refunded"

interface OrderRow {
  id: string
  order_number: string
  email: string
  first_name: string
  last_name: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  subtotal: number
  shipping_cost: number
  discount_amount: number
  total_amount: number
  coupon_code: string | null
  payment_method: string
  payment_status: PaymentStatus
  order_status: OrderStatus
  tracking_number: string | null
  courier_name: string | null
  notes: string | null
  created_at: string
  order_items: {
    id: string
    title: string
    quantity: number
    price_at_purchase: number
    image: string | null
  }[]
}

const statusVariantMap: Record<OrderStatus, "warning" | "info" | "success" | "danger" | "neutral"> = {
  processing: "warning",
  shipped: "info",
  delivered: "success",
  cancelled: "danger",
  returned: "neutral",
}

const paymentVariantMap: Record<PaymentStatus, "warning" | "success" | "danger" | "neutral"> = {
  pending: "warning",
  paid: "success",
  failed: "danger",
  refunded: "neutral",
}

const columns = [
  { key: "order", label: "Order" },
  { key: "customer", label: "Customer" },
  { key: "date", label: "Date" },
  { key: "amount", label: "Amount" },
  { key: "payment", label: "Payment" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action", className: "text-right" },
]

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const queryString = new URLSearchParams()
  queryString.append("page", page.toString())
  queryString.append("limit", "15")
  if (statusFilter !== "all") queryString.append("status", statusFilter)
  if (search) queryString.append("search", search)

  const { data: response, isLoading } = useSWR(`/api/admin/orders?${queryString.toString()}`, fetcher)
  const orders: OrderRow[] = response?.data || []
  const meta = response?.meta

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Orders" subtitle="Track and manage customer orders" />

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <AdminSearch
          value={search}
          onChange={(val) => { setSearch(val); setPage(1) }}
          placeholder="Search order #, email, name..."
          className="flex-1 max-w-sm"
        />
        <Select value={statusFilter} onValueChange={val => { setStatusFilter(val); setPage(1) }}>
          <SelectTrigger className="h-11 w-[180px] rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl shadow-black/40">
            <SelectItem value="all" className="rounded-lg focus:bg-zinc-900">All Statuses</SelectItem>
            <SelectItem value="processing" className="rounded-lg focus:bg-zinc-900">Processing</SelectItem>
            <SelectItem value="shipped" className="rounded-lg focus:bg-zinc-900">Shipped</SelectItem>
            <SelectItem value="delivered" className="rounded-lg focus:bg-zinc-900">Delivered</SelectItem>
            <SelectItem value="cancelled" className="rounded-lg focus:bg-zinc-900">Cancelled</SelectItem>
            <SelectItem value="returned" className="rounded-lg focus:bg-zinc-900">Returned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <AdminDataTable
        columns={columns}
        data={orders}
        isLoading={isLoading}
        emptyIcon={<ClipboardList className="h-8 w-8 opacity-50" />}
        emptyMessage="No orders found."
        keyExtractor={(o) => o.id}
        renderRow={(order) => (
          <>
            <TableCell>
              <p className="font-medium text-white text-sm">{order.order_number}</p>
              <p className="text-[11px] text-zinc-500">{order.order_items?.length || 0} items</p>
            </TableCell>
            <TableCell>
              <p className="text-sm text-zinc-300">{order.first_name} {order.last_name}</p>
              <p className="text-[11px] text-zinc-500">{order.email}</p>
            </TableCell>
            <TableCell className="text-sm text-zinc-400">{formatDate(order.created_at)}</TableCell>
            <TableCell className="text-sm font-medium text-white">₹{Number(order.total_amount).toLocaleString()}</TableCell>
            <TableCell>
              <StatusBadge label={order.payment_status} variant={paymentVariantMap[order.payment_status]} />
            </TableCell>
            <TableCell>
              <StatusBadge label={order.order_status} variant={statusVariantMap[order.order_status]} />
            </TableCell>
            <TableCell className="text-right flex items-center justify-end gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                onClick={() => generateInvoicePDF({
                  orderNumber: order.order_number,
                  date: formatDate(order.created_at),
                  customerName: `${order.first_name} ${order.last_name}`,
                  email: order.email,
                  phone: order.phone,
                  address: order.address,
                  city: order.city,
                  state: order.state,
                  pincode: order.pincode,
                  items: order.order_items.map(item => ({
                    title: item.title,
                    quantity: item.quantity,
                    price: item.price_at_purchase
                  })),
                  subtotal: order.subtotal,
                  shipping: order.shipping_cost,
                  discount: order.discount_amount,
                  total: order.total_amount
                })}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Link href={`/admin/orders/${order.id}/edit`}>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
            </TableCell>
          </>
        )}
      />

      {meta && <AdminPagination meta={meta} page={page} onPageChange={setPage} label="orders" />}

    </div>
  )
}
