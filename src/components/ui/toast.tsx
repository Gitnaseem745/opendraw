'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ToastProps {
    message: string;
    isOpen: boolean;
    onClose: () => void;
    duration?: number;
    type?: 'success' | 'error' | 'info' | 'warning' | 'default';
    className?: string;
}

const typeStyles = {
    default: 'bg-gray-800 text-white',
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-black',
};

/**
 * Toast component for displaying notifications.
 * @param {string} message - The message to display in the toast.
 * @param {boolean} isOpen - Whether the toast is open or not.
 * @param {function} onClose - Function to call when the toast is closed.
 * @param {number} duration - Duration in milliseconds before the toast closes automatically.
 * @param {string} type - Type of the toast (success, error, info, warning, default).
 * @param {string} className - Additional class names for styling.
 * @returns {JSX.Element} The Toast component.
 * @example
 * <Toast
 *   message="This is a success message!"
 *   isOpen={isToastOpen}
 *   onClose={() => setToastOpen(false)}
 *   duration={3000}
 *   type="success"
 *   className="custom-toast-class"
 * />
 */
export default function Toast({
    message,
    isOpen,
    onClose,
    duration = 3000,
    type = 'default',
    className = '',
}: ToastProps) {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose, duration]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.3 }}
                    className={cn(`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50`, typeStyles[type], className)}
                    role="alert"
                    aria-live="assertive"
                >
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
};
