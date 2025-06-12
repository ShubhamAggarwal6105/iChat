"use client"

import { useState, useCallback } from "react"
import type { ToastProps } from "../components/Toast"

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = useCallback(
    (
      toast:
        | Omit<ToastProps, "id" | "onClose">
        | { title: string; message?: string; type?: "success" | "error" | "info" | "warning" },
    ) => {
      const id = Math.random().toString(36).substring(2, 9)

      // Handle simplified toast format
      const type = toast.type || "info"
      const message = toast.message || ""

      const newToast: ToastProps = {
        id,
        type,
        title: toast.title,
        message,
        duration: 5000,
        onClose: () => removeToast(id),
      }

      setToasts((prev) => [...prev, newToast])

      // Auto-remove toast after duration
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration || 5000)

      return id
    },
    [],
  )

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return {
    toasts,
    addToast,
    removeToast,
  }
}
