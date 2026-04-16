"use client"

import { useState, useEffect } from "react"
import { TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Package, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

import { AuthUser, Order } from "@/types"


export default function OrdersTab({ user }: { user: AuthUser }) {
  const router = useRouter()
  const { toast } = useToast()

  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null)
  const [cancelReason, setCancelReason] = useState("")
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/users/orders')
        if (!res.ok) throw new Error('Failed to fetch orders')
        const { data } = await res.json()
        setOrders(data || [])
      } catch (error) {
        toast({ variant: "destructive", title: "Fetch Error", description: "Failed to load order history" })
        setOrders([])
      } finally {
        setLoadingOrders(false)
      }
    }
    fetchOrders()
  }, [])

  const submitCancellation = async () => {
    if (!cancelReason.trim()) {
      toast({
        variant: "destructive",
        title: "Reason Required",
        description: "Please provide a reason for the cancellation."
      })
      return
    }

    setIsCancelling(true)
    try {
      const res = await fetch(`/api/users/orders/${cancelOrderId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: cancelReason })
      })

      const data = await res.json()

      if (!res.ok) {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: data.error || "Could not process cancellation request"
        })
      } else {
        toast({
          title: "Request Submitted",
          description: "Your cancellation request has been sent for admin review."
        })
        setCancelOrderId(null)
        setCancelReason("")
        setOrders(prev => prev.map(o =>
          o.id === cancelOrderId
            ? { ...o, cancellation_requested: true, cancellation_reason: cancelReason }
            : o
        ))
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Check your connection and try again."
      })
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <TabsContent value="orders" className="mt-0 outline-none animate-in fade-in duration-500">
      <div className="border border-primary/10 rounded-xl bg-white p-8 lg:p-12">
        <h3 className="text-[14px] font-heading font-bold uppercase tracking-[0.25em] text-primary border-b border-primary/10 pb-4 mb-8">Order History</h3>

        {loadingOrders ? (
          <div className="py-20 flex justify-center items-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary/30" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-12 bg-primary/5 rounded-xl flex flex-col items-center justify-center border border-dashed border-primary/20">
            <Package className="w-8 h-8 text-primary/30 mb-3" />
            <p className="text-[12px] font-sans font-medium text-primary/60 pb-6 tracking-wide">You haven't placed any orders yet.</p>
            <Button className="rounded-full bg-accent text-white shadow-md hover:bg-accent/90 tracking-[0.25em] uppercase text-[10px] font-bold px-8" onClick={() => router.push('/')}>Start Shopping</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border border-primary/10 rounded-3xl bg-white p-6 lg:p-10 group transition-all duration-300 hover:border-accent/10 hover:shadow-xl shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-primary/10 pb-6 mb-6 gap-6">
                  <div className="flex flex-wrap gap-12">
                    <div>
                      <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/50 mb-1">Order Placed</p>
                      <p className="text-[14px] font-sans font-medium text-primary mt-1">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/50 mb-1">Total Amount</p>
                      <p className="text-[14px] font-sans font-bold text-primary tracking-widest mt-1">₹{order.total_amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/50 mb-1">Order #</p>
                      <p className="text-[14px] font-sans font-medium text-primary mt-1">{order.order_number}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center justify-center px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border 
                      ${order.order_status === 'delivered' ? 'bg-[#1B4332]/5 text-[#1B4332] border-[#1B4332]/10' :
                        order.order_status === 'processing' ? 'bg-amber-100/50 text-amber-800 border-amber-200' :
                          order.order_status === 'shipped' ? 'bg-blue-100/50 text-blue-800 border-blue-200' :
                            order.order_status === 'cancelled' ? 'bg-red-100/50 text-red-800 border-red-200' :
                              'bg-primary/5 text-primary border-primary/10'}`}>
                      {order.order_status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                  <div className="flex-1 space-y-4">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-5">
                        {item.image && (
                          <div className="w-16 h-20 bg-primary/5 rounded-md overflow-hidden relative flex-shrink-0">
                            <img src={item.image} alt={item.title} className="object-cover w-full h-full" />
                          </div>
                        )}
                        <div>
                          <p className="font-heading font-normal text-lg text-primary tracking-tight line-clamp-1 transition-colors hover:text-accent group-hover:text-accent cursor-pointer">{item.title}</p>
                          <p className="text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-primary/60 mt-2">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3 border-t lg:border-t-0 lg:border-l border-primary/10 pt-8 lg:pt-0 lg:pl-10 min-w-[240px]">
                    {order.cancellation_requested ? (
                      <div className="p-4 bg-amber-50/50 border border-amber-100 text-amber-800 flex flex-col gap-2 rounded-2xl">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          <p className="text-[10px] uppercase tracking-[0.15em] font-bold">Cancellation Pending</p>
                        </div>
                        <p className="text-[12px] font-medium opacity-80 leading-snug tracking-wide">Awaiting admin review.</p>
                      </div>
                    ) : order.order_status === 'processing' ? (
                      <Button
                        variant="outline"
                        onClick={() => setCancelOrderId(order.id)}
                        className="w-full rounded-full border-accent/20 text-accent hover:text-white hover:!bg-accent text-[10px] font-bold uppercase tracking-[0.2em] h-11 transition-all duration-300"
                      >
                        Cancel Order
                      </Button>
                    ) : null}
                    <Button
                      variant="outline"
                      onClick={() => {
                        toast({
                          title: "Invoice Simulated",
                          description: "In a live environment this would download a PDF."
                        })
                      }}
                      className="w-full rounded-full border-primary/20 text-primary hover:border-accent hover:bg-accent/5 hover:text-accent text-[10px] font-bold uppercase tracking-[0.2em] h-11 transition-all duration-300"
                    >
                      View Invoice
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!cancelOrderId} onOpenChange={(open) => !open && setCancelOrderId(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl border-primary/10">
          <DialogHeader className="space-y-4">
            <DialogTitle className="font-heading text-3xl font-normal tracking-tight text-primary">Cancel Order</DialogTitle>
            <DialogDescription className="font-sans font-medium tracking-wide text-primary/70 text-[13px] leading-relaxed">
              If you wish to cancel this order, please provide a reason. Cancellations are subject to admin approval once processing begins.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-6">
            <div className="space-y-3">
              <Label htmlFor="reason" className="text-[10px] uppercase tracking-[0.15em] font-bold text-accent">Reason for cancellation</Label>
              <Textarea
                id="reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="I ordered the wrong size..."
                className="rounded-xl border-primary/20 focus-visible:border-accent focus-visible:ring-accent/20 min-h-[120px] text-[13px] font-medium resize-none shadow-sm transition-colors"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-between flex-row gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCancelOrderId(null)}
              className="rounded-full w-full sm:w-auto h-12 px-8 border-primary/20 text-primary text-[10px] tracking-[0.25em] hover:bg-primary hover:text-white uppercase font-bold transition-all"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={submitCancellation}
              disabled={isCancelling}
              className="rounded-full w-full sm:w-auto bg-accent text-white hover:bg-accent/90 h-12 px-8 text-[10px] tracking-[0.25em] uppercase font-bold shadow-md hover:shadow-lg transition-all"
            >
              {isCancelling ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TabsContent>
  )
}
