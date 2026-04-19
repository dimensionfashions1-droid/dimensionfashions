"use client"

import { Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AdminDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isDeleting?: boolean
  title?: string
  description?: string
}

export function AdminDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  isDeleting = false,
  title = "Delete Item",
  description = "This action cannot be undone. The item will be permanently removed.",
}: AdminDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl border border-zinc-800 bg-zinc-950/95 p-7 text-white shadow-2xl shadow-black/40 backdrop-blur-xl">
        <AlertDialogHeader className="space-y-2">
          <AlertDialogTitle className="text-xl font-semibold tracking-tight">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-6 text-zinc-400">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="h-11 rounded-xl border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="h-11 rounded-xl bg-rose-600 text-white hover:bg-rose-500"
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
