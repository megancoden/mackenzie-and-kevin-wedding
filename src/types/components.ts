import { ReactNode } from 'react'
import { InvitationWithGuests, Guest, GuestResponseData } from './database'

// Layout props
export interface LayoutProps {
  children: ReactNode
  title?: string
  description?: string
}

// Navigation props
export interface NavigationProps {
  currentPath?: string
  className?: string
}

// RSVP Form props
export interface RSVPFormProps {
  invitation: InvitationWithGuests
  onSubmit: (data: RSVPFormData) => Promise<void>
  loading?: boolean
  error?: string
}

export interface RSVPFormData {
  guestResponses: Record<string, GuestResponseData>
  dietaryRestrictions: string
  notes: string
}

// Guest card props
export interface GuestCardProps {
  guest: Guest
  invitation: InvitationWithGuests
  responses: GuestResponseData
  onResponseChange: (guestId: string, event: string, response: string) => void
}

// Event selection props
export interface EventSelectionProps {
  guestId: string
  guestName: string
  eventName: string
  eventKey: 'friday' | 'saturday' | 'sunday'
  currentResponse?: string
  onChange: (guestId: string, event: string, response: string) => void
  required?: boolean
}

// Gallery props (for future use)
export interface GalleryProps {
  photos: Photo[]
  onPhotoClick?: (photo: Photo) => void
}

export interface Photo {
  id: string
  url: string
  alt: string
  caption?: string
  thumbnail?: string
}

// Registry props (for future use)
export interface RegistryProps {
  registries: Registry[]
}

export interface Registry {
  id: string
  name: string
  url: string
  description?: string
  logo?: string
}