"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  overlayClassName?: string
  closeOnOutsideClick?: boolean
  closeOnEsc?: boolean
}

/**
 * Modal component that serves as a wrapper for the modal elements.
 * @param {boolean} isOpen - Boolean to control the modal visibility.
 * @param {function} onClose - Function to close the modal.
 * @param {React.ReactNode} children - The child elements to be rendered inside the modal.
 * @param {string} className - Additional class names for styling.
 * @param {string} overlayClassName - Additional class names for the overlay.
 * @param {boolean} closeOnOutsideClick - Flag to close the modal when clicking outside of it.
 * @param {boolean} closeOnEsc - Flag to close the modal when pressing the ESC key.
 * @returns {JSX.Element | null} The rendered Modal component or null if not open.
 * @example
 * <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
 *         <ModalHeader>
 *           <ModalTitle>Modal Title</ModalTitle>
 *           <ModalClose onClick={() => setIsOpen(false)} />
 *         </ModalHeader>
 *         <ModalBody>
 *           <ModalDescription className="mb-4">
 *             This is a description of the modal content.
 *           </ModalDescription>
 *           <p>
 *             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
 *             pulvinar risus non risus hendrerit venenatis. Pellentesque sit amet
 *             hendrerit risus, sed porttitor quam.
 *           </p>
 *         </ModalBody>
 *         <ModalFooter>
 *           <Button variant="outline" onClick={() => setIsOpen(false)}>
 *             Cancel
 *           </Button>
 *           <Button onClick={() => setIsOpen(false)}>Continue</Button>
 *         </ModalFooter>
 *</Modal>
 */

const Modal = ({
  isOpen,
  onClose,
  children,
  className,
  overlayClassName,
  closeOnOutsideClick = true,
  closeOnEsc = true,
}: ModalProps) => {
  const [isClosing, setIsClosing] = React.useState(false)
  const modalRef = React.useRef<HTMLDivElement>(null)

  // Handle closing animation
  const handleClose = React.useCallback(() => {
    setIsClosing(true)
    const timer = setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 200) // Match this with the CSS transition duration
    return () => clearTimeout(timer)
  }, [onClose])

  // Close on ESC key press
  React.useEffect(() => {
    if (!isOpen || !closeOnEsc) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, closeOnEsc, handleClose])

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Handle outside click
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      handleClose()
    }
  }

  if (!isOpen && !isClosing) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50",
        isOpen && !isClosing ? "animate-in fade-in" : "animate-out fade-out",
        overlayClassName,
      )}
      onClick={handleOutsideClick}
    >
      <div
        ref={modalRef}
        className={cn(
          "bg-background rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto",
          isOpen && !isClosing ? "animate-in zoom-in-95" : "animate-out zoom-out-95",
          className,
        )}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  )
}

/**
 * ModalHeader component that serves as a wrapper for the modal header.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - The props for the modal header element.
 * @param {string} className - Additional class names for styling.
 * @returns {JSX.Element} The rendered ModalHeader component.
 */
const ModalHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center justify-between p-4 border-b border-border", className)} {...props} />
  ),
)
ModalHeader.displayName = "ModalHeader"

/**
 * ModalTitle component that serves as a title for the modal.
 * @param {React.HTMLAttributes<HTMLHeadingElement>} props - The props for the modal title element.
 * @param {string} className - Additional class names for styling.
 * @returns {JSX.Element} The rendered ModalTitle component.
 */
const ModalTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => <h2 ref={ref} className={cn("text-lg font-semibold", className)} {...props} />,
)
ModalTitle.displayName = "ModalTitle"

/**
 * ModalDescription component that serves as a description for the modal.
 * @param {React.HTMLAttributes<HTMLParagraphElement>} props - The props for the modal description element.
 * @param {string} className - Additional class names for styling.
 * @returns {JSX.Element} The rendered ModalDescription component.
 */
const ModalDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
)
ModalDescription.displayName = "ModalDescription"

/**
 * ModalBody component that serves as a wrapper for the modal body content.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - The props for the modal body element.
 * @param {string} className - Additional class names for styling.
 * @returns {JSX.Element} The rendered ModalBody component.
 */
const ModalBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-4", className)} {...props} />,
)
ModalBody.displayName = "ModalBody"

/**
 * ModalFooter component that serves as a wrapper for the modal footer content.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - The props for the modal footer element.
 * @param {string} className - Additional class names for styling.
 * @returns {JSX.Element} The rendered ModalFooter component.
 */
const ModalFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex justify-end gap-2 p-4 border-t border-border", className)} {...props} />
  ),
)
ModalFooter.displayName = "ModalFooter"

/**
 * ModalClose component that serves as a button to close the modal.
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} props - The props for the modal close button element.
 * @param {string} className - Additional class names for styling.
 * @returns {JSX.Element} The rendered ModalClose component.
 */
const ModalClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-1 text-foreground/70 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
        className,
      )}
      aria-label="Close"
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </button>
  ),
)
ModalClose.displayName = "ModalClose"

export { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter, ModalClose }
