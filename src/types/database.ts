// Prisma generates these automatically, but you can extend them here
import { Invitation, Guest, GuestType, RsvpStatus, Response } from '@prisma/client'

// Full invitation with guests included
export interface InvitationWithGuests extends Invitation {
  guests: Guest[]
}

// Guest lookup response
export interface GuestLookupResponse {
  invitation: InvitationWithGuests
  searchedGuest: Guest
  error?: string
}

// RSVP form data types
export interface GuestResponseData {
  guestId: string
  fridayResponse?: Response
  saturdayResponse?: Response  
  sundayResponse?: Response
  plusOneFirstName?: string
  plusOneLastName?: string
}

export interface RSVPSubmissionData {
  invitationId: string
  guestResponses: GuestResponseData[]
  dietaryRestrictions?: string
  notes?: string
}

// Excel export types
export interface ExcelGuestRow {
  'Invitation #': number
  'Invitation ID': string
  'Guest Type': GuestType
  'First Name': string
  'Last Name': string
  'Email': string
  'Phone': string
  'Invited to Friday': string
  'Invited to Saturday': string
  'Invited to Sunday': string
  'Friday Response': string
  'Saturday Response': string
  'Sunday Response': string
  'RSVP Status': RsvpStatus
  'RSVP Submitted': string
  'Dietary Restrictions': string
  'Notes': string
  'Created At': string
  'Updated At': string
}

export interface ExcelSummaryRow {
  'Invitation #': number
  'Primary Guest': string
  'Total Guests': number
  'RSVP Status': RsvpStatus
  'Attending Friday': number
  'Attending Saturday': number
  'Attending Sunday': number
  'Dietary Restrictions': string
  'Notes': string
}

// Re-export Prisma types for convenience
export type { Invitation, Guest, GuestType, RsvpStatus, Response }