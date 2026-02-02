import { InvitationWithGuests, GuestLookupResponse, RSVPSubmissionData } from './database'

// API Response wrapper
export interface ApiResponse<T = unknown> {
  success?: boolean
  data?: T
  error?: string
  message?: string
}

// Guest lookup API
export interface GuestLookupRequest {
  firstName: string
  lastName: string
}

export type GuestLookupApiResponse = ApiResponse<GuestLookupResponse>

// RSVP submission API
export type RSVPSubmissionRequest = RSVPSubmissionData

export interface RSVPSubmissionResponse {
  success: boolean
  invitation?: InvitationWithGuests
  error?: string
}

// Gallery API (for future use)
export interface PhotoUpload {
  id: string
  filename: string
  url: string
  uploadedAt: Date
  uploadedBy?: string
}

// Contact form (for future use)
export interface ContactFormData {
  name: string
  email: string
  message: string
  phone?: string
}