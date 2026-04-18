"use client"

import { useState } from "react"
import useSWR, { mutate } from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TableCell } from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Eye, ClipboardList, Loader2 } from "lucide-react"
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
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const [editStatus, setEditStatus] = useState<OrderStatus>("processing")
  const [editPaymentStatus, setEditPaymentStatus] = useState<PaymentStatus>("pending")
  const [editTracking, setEditTracking] = useState("")
  const [editCourier, setEditCourier] = useState("")

  const queryString = new URLSearchParams()
  queryString.append("page", page.toString())
  queryString.append("limit", "15")
  if (statusFilter !== "all") queryString.append("status", statusFilter)
  if (search) queryString.append("search", search)

  const { data: response, isLoading } = useSWR(`/api/admin/orders?${queryString.toString()}`, fetcher)
  const orders: OrderRow[] = response?.data || []
  const meta = response?.meta

  const openOrder = (order: OrderRow) => {
    setSelectedOrder(order)
    setEditStatus(order.order_status)
    setEditPaymentStatus(order.payment_status)
    setEditTracking(order.tracking_number || "")
    setEditCourier(order.courier_name || "")
  }

  const handleUpdate = async () => {
    if (!selectedOrder) return
    setIsUpdating(true)
    try {
      await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_status: editStatus,
          payment_status: editPaymentStatus,
          tracking_number: editTracking || null,
          courier_name: editCourier || null,
        }),
      })
      mutate(`/api/admin/orders?${queryString.toString()}`)
      setSelectedOrder(null)
    } catch (error) {
      console.error("Failed to update order:", error)
    } finally {
      setIsUpdating(false)
    }
  }

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
          <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800 text-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
            <SelectItem value="all" className="focus:bg-zinc-800">All Statuses</SelectItem>
            <SelectItem value="processing" className="focus:bg-zinc-800">Processing</SelectItem>
            <SelectItem value="shipped" className="focus:bg-zinc-800">Shipped</SelectItem>
            <SelectItem value="delivered" className="focus:bg-zinc-800">Delivered</SelectItem>
            <SelectItem value="cancelled" className="focus:bg-zinc-800">Cancelled</SelectItem>
            <SelectItem value="returned" className="focus:bg-zinc-800">Returned</SelectItem>
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
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" onClick={() => openOrder(order)}
                className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800">
                <Eye className="h-4 w-4" />
              </Button>
            </TableCell>
          </>
        )}
      />

      {meta && <AdminPagination meta={meta} page={page} onPageChange={setPage} label="orders" />}

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  Order {selectedOrder.order_number}
                  <StatusBadge label={selectedOrder.order_status} variant={statusVariantMap[selectedOrder.order_status]} />
                </DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Placed on {formatDate(selectedOrder.created_at)} · {selectedOrder.payment_method?.toUpperCase()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Customer + Shipping */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-zinc-800/50 rounded-lg">
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Customer</p>
                    <p className="text-sm text-white">{selectedOrder.first_name} {selectedOrder.last_name}</p>
                    <p className="text-xs text-zinc-400">{selectedOrder.email}</p>
                    <p className="text-xs text-zinc-400">{selectedOrder.phone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Shipping</p>
                    <p className="text-xs text-zinc-300">{selectedOrder.address}</p>
                    <p className="text-xs text-zinc-400">{selectedOrder.city}, {selectedOrder.state} {selectedOrder.pincode}</p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-3">Items</p>
                  <div className="space-y-2">
                    {selectedOrder.order_items?.map(item => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                        {item.image && <img src={item.image} alt={item.title} className="w-10 h-10 rounded object-cover bg-zinc-800" />}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{item.title}</p>
                          <p className="text-xs text-zinc-500">Qty: {item.quantity} × ₹{Number(item.price_at_purchase).toLocaleString()}</p>
                        </div>
                        <p className="text-sm font-medium text-white">₹{(item.quantity * Number(item.price_at_purchase)).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amount Summary */}
                <div className="p-4 bg-zinc-800/50 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between text-zinc-400"><span>Subtotal</span><span>₹{Number(selectedOrder.subtotal).toLocaleString()}</span></div>
                  <div className="flex justify-between text-zinc-400"><span>Shipping</span><span>₹{Number(selectedOrder.shipping_cost).toLocaleString()}</span></div>
                  {Number(selectedOrder.discount_amount) > 0 && (
                    <div className="flex justify-between text-emerald-400"><span>Discount</span><span>-₹{Number(selectedOrder.discount_amount).toLocaleString()}</span></div>
                  )}
                  <div className="flex justify-between text-white font-semibold border-t border-zinc-700 pt-2">
                    <span>Total</span><span>₹{Number(selectedOrder.total_amount).toLocaleString()}</span>
                  </div>
                </div>

                {/* Update Fields */}
                <div className="space-y-4 border-t border-zinc-800 pt-4">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Update Order</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-zinc-300 text-xs">Order Status</Label>
                      <Select value={editStatus} onValueChange={val => setEditStatus(val as OrderStatus)}>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white h-9 text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                          <SelectItem value="processing" className="focus:bg-zinc-800">Processing</SelectItem>
                          <SelectItem value="shipped" className="focus:bg-zinc-800">Shipped</SelectItem>
                          <SelectItem value="delivered" className="focus:bg-zinc-800">Delivered</SelectItem>
                          <SelectItem value="cancelled" className="focus:bg-zinc-800">Cancelled</SelectItem>
                          <SelectItem value="returned" className="focus:bg-zinc-800">Returned</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-300 text-xs">Payment Status</Label>
                      <Select value={editPaymentStatus} onValueChange={val => setEditPaymentStatus(val as PaymentStatus)}>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white h-9 text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                          <SelectItem value="pending" className="focus:bg-zinc-800">Pending</SelectItem>
                          <SelectItem value="paid" className="focus:bg-zinc-800">Paid</SelectItem>
                          <SelectItem value="failed" className="focus:bg-zinc-800">Failed</SelectItem>
                          <SelectItem value="refunded" className="focus:bg-zinc-800">Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-300 text-xs">Courier</Label>
                      <Select value={editCourier} onValueChange={setEditCourier}>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white h-9 text-sm"><SelectValue placeholder="Select courier" /></SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                          <SelectItem value="delhivery" className="focus:bg-zinc-800">Delhivery</SelectItem>
                          <SelectItem value="dtdc" className="focus:bg-zinc-800">DTDC</SelectItem>
                          <SelectItem value="xpressbees" className="focus:bg-zinc-800">Xpressbees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-300 text-xs">Tracking Number</Label>
                      <Input value={editTracking} onChange={e => setEditTracking(e.target.value)}
                        className="bg-zinc-800 border-zinc-700 text-white h-9 text-sm" placeholder="AWB / Tracking ID" />
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedOrder(null)}
                  className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white">Close</Button>
                <Button onClick={handleUpdate} disabled={isUpdating} className="bg-white text-zinc-900 hover:bg-zinc-200 min-w-[100px]">
                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
