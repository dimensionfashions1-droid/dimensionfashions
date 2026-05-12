"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect, use, useRef } from "react"
import { useRouter } from "next/navigation"
import useSWR, { mutate } from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Loader2, Package, Truck, CreditCard, User, FileText, Download, AlertTriangle } from "lucide-react"
import { generateInvoicePDF } from "@/lib/utils/invoice-generator"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { StatusBadge } from "@/components/admin"

const fetcher = (url: string) => fetch(url).then(res => res.json())

type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled" | "returned"
type PaymentStatus = "pending" | "paid" | "failed" | "refunded"

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

export default function AdminOrderEditPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { toast } = useToast()
  const resolvedParams = use(params)
  const orderId = resolvedParams.id

  const [isSaving, setIsSaving] = useState(false)
  const hasInitialized = useRef(false)

  const { data: orderResponse, isLoading, error } = useSWR(
    orderId ? `/api/admin/orders/${orderId}` : null,
    fetcher
  )

  const order = orderResponse?.data

  // Form State
  const [editStatus, setEditStatus] = useState<OrderStatus>("processing")
  const [editPaymentStatus, setEditPaymentStatus] = useState<PaymentStatus>("pending")
  const [editTracking, setEditTracking] = useState("")
  const [editCourier, setEditCourier] = useState("")

  const [editFirstName, setEditFirstName] = useState("")
  const [editLastName, setEditLastName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editPhone, setEditPhone] = useState("")

  const [editAddress, setEditAddress] = useState("")
  const [editCity, setEditCity] = useState("")
  const [editState, setEditState] = useState("")
  const [editPincode, setEditPincode] = useState("")

  const [editSubtotal, setEditSubtotal] = useState(0)
  const [editShippingCost, setEditShippingCost] = useState(0)
  const [editDiscountAmount, setEditDiscountAmount] = useState(0)
  const [editTotalAmount, setEditTotalAmount] = useState(0)

  useEffect(() => {
    if (order && !hasInitialized.current) {
      setEditStatus(order.order_status)
      setEditPaymentStatus(order.payment_status)
      setEditTracking(order.tracking_number || "")
      setEditCourier(order.courier_name || "")

      setEditFirstName(order.first_name || "")
      setEditLastName(order.last_name || "")
      setEditEmail(order.email || "")
      setEditPhone(order.phone || "")

      setEditAddress(order.address || "")
      setEditCity(order.city || "")
      setEditState(order.state || "")
      setEditPincode(order.pincode || "")

      setEditSubtotal(Number(order.subtotal) || 0)
      setEditShippingCost(Number(order.shipping_cost) || 0)
      setEditDiscountAmount(Number(order.discount_amount) || 0)
      setEditTotalAmount(Number(order.total_amount) || 0)

      hasInitialized.current = true
    }
  }, [order])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_status: editStatus,
          payment_status: editPaymentStatus,
          tracking_number: editTracking || null,
          courier_name: editCourier || null,
          first_name: editFirstName,
          last_name: editLastName,
          email: editEmail,
          phone: editPhone,
          address: editAddress,
          city: editCity,
          state: editState,
          pincode: editPincode,
          subtotal: editSubtotal,
          shipping_cost: editShippingCost,
          discount_amount: editDiscountAmount,
          total_amount: editTotalAmount,
        }),
      })

      const result = await res.json().catch(() => ({}))

      if (!res.ok) {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: result.error || "Failed to update order.",
        })
        return
      }

      toast({ title: "Order updated", description: "All changes have been saved." })
      mutate(`/api/admin/orders/${orderId}`)
      router.push("/admin/orders")
    } catch (error) {
      console.error("Error saving order:", error)
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error instanceof Error ? error.message : "Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric", hour: '2-digit', minute: '2-digit'
    })
  }

  if (error || (orderResponse && !orderResponse.data && !isLoading)) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6 bg-zinc-950 px-4 text-center rounded-2xl border border-zinc-900">
        <h2 className="text-2xl font-bold text-white tracking-tight">Order Not Found</h2>
        <p className="text-zinc-500 max-w-md text-sm">We couldn't find the order you're looking for.</p>
        <Link href="/admin/orders">
          <Button className="rounded-full px-8 py-2 bg-white text-zinc-900 font-bold hover:bg-zinc-200">Return to Orders</Button>
        </Link>
      </div>
    )
  }

  if (isLoading || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        <p className="text-sm text-zinc-500 font-medium tracking-widest uppercase">Loading Order...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-white">Order {order.order_number}</h1>
              <StatusBadge label={order.order_status} variant={statusVariantMap[order.order_status as OrderStatus] || 'neutral'} />
            </div>
            <p className="text-zinc-400 text-sm mt-1">Placed on {formatDate(order.created_at)}</p>
          </div>
        </div>

        <Button 
          type="button"
          variant="outline" 
          className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 gap-2 rounded-xl h-10 px-5"
          onClick={() => generateInvoicePDF({
            orderNumber: order.order_number,
            date: new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
            customerName: `${order.first_name} ${order.last_name}`,
            email: order.email,
            phone: order.phone,
            address: order.address,
            city: order.city,
            state: order.state,
            pincode: order.pincode,
            items: order.order_items.map((item: any) => ({
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
          Download Invoice
        </Button>
      </div>

      {/* Cancellation Request Banner */}
      {order.cancellation_requested && (
        <div className="bg-red-950/40 border border-red-900/60 rounded-xl p-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-red-300">Cancellation Requested</h3>
              <p className="text-xs text-red-400/70 mt-0.5">The customer has requested to cancel this order.</p>
            </div>
          </div>
          {order.cancellation_reason && (
            <div className="ml-[52px] bg-red-950/60 border border-red-900/40 rounded-lg p-4">
              <p className="text-[10px] uppercase tracking-widest font-bold text-red-400/60 mb-2">Customer&apos;s Reason</p>
              <p className="text-sm text-red-200/90 italic leading-relaxed">&ldquo;{order.cancellation_reason}&rdquo;</p>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Fulfillment & Tracking */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Truck className="h-5 w-5 text-zinc-400" />
            <h2 className="text-lg font-semibold text-white">Fulfillment & Tracking</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-zinc-300">Order Status</Label>
              <select
                value={editStatus || ""}
                onChange={(e) => setEditStatus(e.target.value as OrderStatus)}
                className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700/60 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
              >
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="returned">Returned</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Courier Name</Label>
              <Input
                value={editCourier}
                onChange={e => setEditCourier(e.target.value)}
                placeholder="e.g. DTDC, Delhivery..."
                className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus-visible:border-zinc-700"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-zinc-300">Tracking Number / AWB</Label>
              <Input
                value={editTracking}
                onChange={e => setEditTracking(e.target.value)}
                placeholder="Enter tracking ID"
                className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus-visible:border-zinc-700"
              />
            </div>
          </div>
        </div>

        {/* Customer & Shipping Details */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <User className="h-5 w-5 text-zinc-400" />
            <h2 className="text-lg font-semibold text-white">Customer & Address Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Customer Info</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-400 text-xs">First Name</Label>
                  <Input value={editFirstName} onChange={e => setEditFirstName(e.target.value)} className="h-10 border-zinc-800 bg-zinc-950 text-zinc-100" />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400 text-xs">Last Name</Label>
                  <Input value={editLastName} onChange={e => setEditLastName(e.target.value)} className="h-10 border-zinc-800 bg-zinc-950 text-zinc-100" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs">Email</Label>
                <Input value={editEmail} onChange={e => setEditEmail(e.target.value)} className="h-10 border-zinc-800 bg-zinc-950 text-zinc-100" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs">Phone</Label>
                <Input value={editPhone} onChange={e => setEditPhone(e.target.value)} className="h-10 border-zinc-800 bg-zinc-950 text-zinc-100" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Shipping Address</h3>
              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs">Street Address</Label>
                <Input value={editAddress} onChange={e => setEditAddress(e.target.value)} className="h-10 border-zinc-800 bg-zinc-950 text-zinc-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-400 text-xs">City</Label>
                  <Input value={editCity} onChange={e => setEditCity(e.target.value)} className="h-10 border-zinc-800 bg-zinc-950 text-zinc-100" />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400 text-xs">State</Label>
                  <Input value={editState} onChange={e => setEditState(e.target.value)} className="h-10 border-zinc-800 bg-zinc-950 text-zinc-100" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs">Pincode</Label>
                <Input value={editPincode} onChange={e => setEditPincode(e.target.value)} className="h-10 border-zinc-800 bg-zinc-950 text-zinc-100" />
              </div>
            </div>
          </div>
        </div>

        {/* Financials & Order Items */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 mb-4">
              <Package className="h-5 w-5 text-zinc-400" />
              <h2 className="text-lg font-semibold text-white">Order Items</h2>
            </div>

            <div className="space-y-3">
              {order.order_items?.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg object-cover bg-zinc-800" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center">
                      <Package className="h-5 w-5 text-zinc-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.title}</p>
                    <p className="text-xs text-zinc-500 mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">₹{(item.quantity * Number(item.price_at_purchase)).toLocaleString()}</p>
                    <p className="text-xs text-zinc-500 mt-1">₹{Number(item.price_at_purchase).toLocaleString()} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
                <CreditCard className="h-5 w-5 text-zinc-400" />
                <h2 className="text-lg font-semibold text-white">Payment</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-zinc-400 text-xs">Payment Status</Label>
                  <select
                    value={editPaymentStatus || ""}
                    onChange={(e) => setEditPaymentStatus(e.target.value as PaymentStatus)}
                    className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700/60 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between text-sm text-zinc-400">
                    <span>Subtotal</span>
                    <Input type="number" value={editSubtotal} onChange={e => setEditSubtotal(Number(e.target.value))} className="h-8 w-28 text-right bg-zinc-950 border-zinc-800" />
                  </div>
                  <div className="flex items-center justify-between text-sm text-zinc-400">
                    <span>Shipping</span>
                    <Input type="number" value={editShippingCost} onChange={e => setEditShippingCost(Number(e.target.value))} className="h-8 w-28 text-right bg-zinc-950 border-zinc-800" />
                  </div>
                  <div className="flex items-center justify-between text-sm text-emerald-400">
                    <span>Discount</span>
                    <Input type="number" value={editDiscountAmount} onChange={e => setEditDiscountAmount(Number(e.target.value))} className="h-8 w-28 text-right bg-zinc-950 border-zinc-800 text-emerald-400" />
                  </div>
                  <div className="flex items-center justify-between text-sm text-white font-bold pt-3 border-t border-zinc-800">
                    <span>Total</span>
                    <Input type="number" value={editTotalAmount} onChange={e => setEditTotalAmount(Number(e.target.value))} className="h-9 w-28 text-right bg-zinc-950 border-zinc-700 font-bold" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-800">
          <Link href="/admin/orders">
            <Button type="button" variant="outline" className="bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800">Cancel</Button>
          </Link>
          <Button type="submit" disabled={isSaving} className="bg-white text-zinc-900 hover:bg-zinc-200 font-medium min-w-[120px]">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}
