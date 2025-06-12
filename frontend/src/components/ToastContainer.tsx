"use client"

import type React from "react"
import Toast, { type ToastProps } from "./Toast"

interface ToastContainerProps {
  toasts: ToastProps[]
  onClose: (id: string) => void
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  )
}

export default ToastContainer
