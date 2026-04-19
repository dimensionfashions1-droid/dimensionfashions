"use client"

import { useState, useRef } from "react"
import { Upload, X, Loader2, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdminImageUploaderProps {
  value: string
  onChange: (url: string) => void
  folder?: string
  className?: string
}

export function AdminImageUploader({
  value,
  onChange,
  folder = "categories",
  className = "",
}: AdminImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", folder)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Upload failed")
      const data = await res.json()
      onChange(data.data?.url || "")
    } catch (error) {
      console.error("Image upload failed:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
    // Reset so same file can be selected again
    e.target.value = ""
  }

  const handleRemove = () => {
    onChange("")
  }

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className="relative group aspect-square w-full max-w-[168px] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
          <img
            src={value}
            alt="Upload preview"
            className="w-full h-full object-cover"
          />
          <div
            className={`absolute inset-0 bg-black/60 transition-opacity flex items-center justify-center gap-2 ${
              isUploading ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2 text-white">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-xs font-medium">Uploading...</span>
              </div>
            ) : (
              <>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => inputRef.current?.click()}
                  className="h-9 w-9 rounded-full bg-white/10 text-white hover:bg-white/20 p-0"
                  aria-label="Replace image"
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={handleRemove}
                  className="h-9 w-9 rounded-full bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 p-0"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="aspect-square w-full max-w-[168px] rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/70 hover:bg-zinc-900 hover:border-zinc-600 transition-colors flex flex-col items-center justify-center gap-2 text-zinc-500 cursor-pointer disabled:cursor-wait"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-xs">Uploading...</span>
            </>
          ) : (
            <>
              <ImageIcon className="h-5 w-5" />
              <span className="text-xs">Upload image</span>
            </>
          )}
        </button>
      )}
    </div>
  )
}
