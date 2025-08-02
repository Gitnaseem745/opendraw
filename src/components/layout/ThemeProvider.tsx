/**
 * @fileoverview ThemeProvider component for managing application themes
 * @description Wraps the Next.js theme provider to provide theme context to all child components
 * @since 2025
 * @author Open Draw Team
 * 
 * @example
 * ```tsx
 * <ThemeProvider
 *   attribute="class"
 *   themes={['light', 'dark', 'system']}
 *   defaultTheme="system"
 *   enableSystem
 * >
 *   <App />
 * </ThemeProvider>
 * ```
 */

'use client';

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes'

/**
 * Theme provider component that wraps the application with theme context
 * 
 * @param {ThemeProviderProps} props - Theme provider configuration props
 * @param {React.ReactNode} props.children - Child components to be wrapped
 * @returns {JSX.Element} The themed application wrapper
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
