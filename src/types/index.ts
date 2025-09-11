// Export all types from a central location
export * from './database'
export * from './api'
export * from './components'

// Common utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredOnly<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>

// Form state types
export type FormStep = 'lookup' | 'form' | 'success'

export interface FormState<T = unknown> {
  loading: boolean
  error: string | null
  data: T | null
}

// Common component props
export interface BaseProps {
  className?: string
  children?: React.ReactNode
}