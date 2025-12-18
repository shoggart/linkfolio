'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  showCloseButton?: boolean
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      description,
      children,
      className,
      showCloseButton = true,
    },
    ref
  ) => {
    // Close on escape key
    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
          onClose()
        }
      }

      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, onClose])

    // Prevent body scroll when modal is open
    React.useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'unset'
      }

      return () => {
        document.body.style.overflow = 'unset'
      }
    }, [isOpen])

    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              aria-hidden="true"
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                ref={ref}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{
                  duration: 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  'relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col',
                  className
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'modal-title' : undefined}
                aria-describedby={description ? 'modal-description' : undefined}
              >
                {/* Header */}
                {(title || showCloseButton) && (
                  <div className="flex items-start justify-between p-6 border-b border-gray-100">
                    <div className="flex-1">
                      {title && (
                        <h2
                          id="modal-title"
                          className="text-xl font-semibold text-gray-900"
                        >
                          {title}
                        </h2>
                      )}
                      {description && (
                        <p
                          id="modal-description"
                          className="mt-1 text-sm text-gray-600"
                        >
                          {description}
                        </p>
                      )}
                    </div>
                    {showCloseButton && (
                      <button
                        onClick={onClose}
                        className="ml-4 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        aria-label="Close modal"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {children}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    )
  }
)

Modal.displayName = 'Modal'

// Modal subcomponents for better composition
const ModalFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50',
      className
    )}
    {...props}
  />
))

ModalFooter.displayName = 'ModalFooter'

export { Modal, ModalFooter }
