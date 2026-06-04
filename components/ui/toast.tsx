'use client'

import { useState, useEffect, useCallback } from 'react'
import { CheckCircle2, AlertCircle, Info, X, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastMessage {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

let toastId = 0
type ToastListener = (toast: ToastMessage) => void
const listeners: ToastListener[] = []

export const toast = (
  title: string,
  type: ToastType = 'info',
  message?: string,
  duration = 5000
) => {
  const id = (++toastId).toString()
  const t: ToastMessage = { id, type, title, message, duration }
  listeners.forEach(l => l(t))
  return id
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    const handleAdd = (t: ToastMessage) => {
      setToasts(prev => [...prev, t])
    }
    listeners.push(handleAdd)
    return () => {
      const idx = listeners.indexOf(handleAdd)
      if (idx > -1) listeners.splice(idx, 1)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
      ))}
    </div>
  )
}

function ToastItem({ toast: t, onRemove }: { toast: ToastMessage, onRemove: () => void }) {
  const [isRemoving, setIsRemoving] = useState(false)

  useEffect(() => {
    if (t.duration && t.duration > 0) {
      const timer = setTimeout(() => {
        setIsRemoving(true)
        setTimeout(onRemove, 300) // Match exit animation duration
      }, t.duration)
      return () => clearTimeout(timer)
    }
  }, [t, onRemove])

  const handleDismiss = () => {
    setIsRemoving(true)
    setTimeout(onRemove, 300)
  }

  const icons = {
    success: <CheckCircle2 className="toast-icon toast-icon--success" aria-hidden="true" />,
    error: <XCircle className="toast-icon toast-icon--error" aria-hidden="true" />,
    warning: <AlertCircle className="toast-icon toast-icon--warning" aria-hidden="true" />,
    info: <Info className="toast-icon toast-icon--info" aria-hidden="true" />,
  }

  return (
    <div className={cn("toast", isRemoving && "toast--removing")} role="status">
      <div className="toast-icon-wrapper">
        {icons[t.type]}
      </div>
      <div className="toast-content">
        <div className="toast-title">{t.title}</div>
        {t.message && <div className="toast-message">{t.message}</div>}
      </div>
      <button onClick={handleDismiss} className="toast-close" aria-label="Dismiss notification">
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  )
}
