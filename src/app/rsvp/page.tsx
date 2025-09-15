'use client'

import { FormStep, InvitationWithGuests, Guest, Response } from '@/types'
import Link from 'next/link'
import { useState, FormEvent } from 'react'

interface InvitationNotes {
  dietaryRestrictions: string
  notes: string
}

type GuestResponsesState = Record<string, {
  fridayResponse?: Response
  saturdayResponse?: Response
  sundayResponse?: Response
}>

export default function RSVPPage() {
  const [step, setStep] = useState<FormStep>('lookup')
  const [invitation, setInvitation] = useState<InvitationWithGuests | null>(null)
  const [searchedGuest, setSearchedGuest] = useState<Guest | null>(null)
  const [guestResponses, setGuestResponses] = useState<GuestResponsesState>({})
  const [invitationNotes, setInvitationNotes] = useState<InvitationNotes>({
    dietaryRestrictions: '',
    notes: ''
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleLookup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    
    try {
      const response = await fetch(`/api/rsvp?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`)
      const data = await response.json()
      
      if (response.ok) {
        setInvitation(data.invitation)
        setSearchedGuest(data.searchedGuest)
        setStep('form')
        
        // Initialize form data with existing responses
        const responses: GuestResponsesState = {}
        data.invitation.guests.forEach((guest: Guest) => {
          responses[guest.id] = {
            fridayResponse: guest.fridayResponse || undefined,
            saturdayResponse: guest.saturdayResponse || undefined,
            sundayResponse: guest.sundayResponse || undefined
          }
        })
        setGuestResponses(responses)
        
        // Initialize invitation notes
        setInvitationNotes({
          dietaryRestrictions: data.invitation.dietaryRestrictions || '',
          notes: data.invitation.notes || ''
        })
      } else {
        setError(data.error || 'Guest not found')
      }
    } catch (error) {
      console.error('Lookup error:', error)
      setError('Failed to find guest. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRSVPSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    if (!invitation) {
      setError('No invitation found')
      setLoading(false)
      return
    }
    
    // Validate that all required responses are provided
    const requiredResponses: string[] = []
    invitation.guests.forEach(guest => {
      if (invitation.invitedToFriday) requiredResponses.push(`${guest.id}-friday`)
      if (invitation.invitedToSaturday) requiredResponses.push(`${guest.id}-saturday`)
      if (invitation.invitedToSunday) requiredResponses.push(`${guest.id}-sunday`)
    })
    
    const missingResponses = requiredResponses.some(key => {
      const [guestId, event] = key.split('-')
      const response = guestResponses[guestId]?.[`${event}Response` as keyof typeof guestResponses[string]]
      return !response
    })
    
    if (missingResponses) {
      setError('Please provide a response for all guests and all events.')
      setLoading(false)
      return
    }
    
    try {
      const requestData = {
        invitationId: invitation.id,
        guestResponses: Object.entries(guestResponses).map(([guestId, responses]) => ({
          guestId,
          fridayResponse: responses.fridayResponse,
          saturdayResponse: responses.saturdayResponse,
          sundayResponse: responses.sundayResponse
        })),
        ...invitationNotes
      }
      
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      })
      
      if (response.ok) {
        alert('RSVP submitted successfully!')
        // Reset form
        setStep('lookup')
        setInvitation(null)
        setSearchedGuest(null)
        setGuestResponses({})
        setInvitationNotes({ dietaryRestrictions: '', notes: '' })
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to submit RSVP')
      }
    } catch (error) {
      console.error('RSVP submission error:', error)
      setError('Failed to submit RSVP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const updateGuestResponse = (guestId: string, event: string, response: string) => {
    setGuestResponses(prev => ({
      ...prev,
      [guestId]: {
        ...prev[guestId],
        [`${event}Response`]: response as Response
      }
    }))
  }

  const updateInvitationNotes = (field: keyof InvitationNotes, value: string) => {
    setInvitationNotes(prev => ({ ...prev, [field]: value }))
  }

  if (step === 'lookup') {
    return (
      <div className="min-h-screen py-12 px-4 background pt-[124px]">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-center mb-6">RSVP</h1>
          
          <p className="text-gray-600 text-center mb-6 font-lato">
            Enter any name from your invitation to RSVP for your entire party.
          </p>
          
          <form onSubmit={handleLookup}>
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2 font-lato">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-lato"
                placeholder="Enter any first name on your invitation"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2 font-lato">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-lato"
                placeholder="Enter the corresponding last name"
              />
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 font-lato"
            >
              {loading ? 'Finding...' : 'Find My Invitation'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Ensure we have data before rendering the form
  if (!invitation || !searchedGuest) {
    return (
      <div className="min-h-screen py-12 px-4 pt-[96px] background">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 font-lato">
          <p className="text-center">Loading...</p>
        </div>
      </div>
    )
  }

  return (
                      <><Link href="/" legacyBehavior>
      <a className="underline underline-offset-4 hover:text-gray-700">Return to home page</a>
    </Link><div className="min-h-screen py-12 px-4 pt-[96px] background">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold font-playfair mb-2">RSVP for Your Party</h1>
            <p className="text-gray-600 font-lato">
              Found invitation for: <span className="font-semibold font-lato">{searchedGuest.firstName} {searchedGuest.lastName}</span>
            </p>
            <p className="text-sm text-gray-500 font-lato">
              {invitation.rsvpStatus === 'COMPLETED' ? 'Updating previous RSVP' : 'Please respond for all members of your party'}
            </p>
          </div>

          <form onSubmit={handleRSVPSubmit}>
            {/* Guest List */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold font-lato mb-4">Your Party ({invitation.guests.length} guest{invitation.guests.length > 1 ? 's' : ''})</h2>

              <div className="space-y-6">
                {invitation.guests.map(guest => (
                  <div key={guest.id} className="border rounded-lg p-4 background">
                    <h3 className="font-medium mb-4 font-lato">
                      {guest.firstName} {guest.lastName}
                      {guest.guestType === 'PLUS_ONE' && <span className="text-sm text-gray-500 ml-2 font-lato">(Plus One)</span>}
                      {guest.guestType === 'CHILD' && <span className="text-sm text-gray-500 ml-2 font-lato">(Child)</span>}
                    </h3>

                    <div className="grid gap-4 md:grid-cols-3">
                      {/* Friday Event */}
                      {invitation.invitedToFriday && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2 font-lato">Friday Welcome Dinner</h4>
                          <div className="space-y-2">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name={`friday-${guest.id}`}
                                value="YES"
                                checked={guestResponses[guest.id]?.fridayResponse === 'YES'}
                                onChange={(e) => updateGuestResponse(guest.id, 'friday', e.target.value)}
                                className="mr-2"
                                required />
                              <span className="text-sm font-lato">Will attend</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name={`friday-${guest.id}`}
                                value="NO"
                                checked={guestResponses[guest.id]?.fridayResponse === 'NO'}
                                onChange={(e) => updateGuestResponse(guest.id, 'friday', e.target.value)}
                                className="mr-2"
                                required />
                              <span className="text-sm font-lato">Cannot attend</span>
                            </label>
                          </div>
                        </div>
                      )}

                      {/* Saturday Event */}
                      {invitation.invitedToSaturday && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2 font-lato">Saturday Wedding</h4>
                          <div className="space-y-2">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name={`saturday-${guest.id}`}
                                value="YES"
                                checked={guestResponses[guest.id]?.saturdayResponse === 'YES'}
                                onChange={(e) => updateGuestResponse(guest.id, 'saturday', e.target.value)}
                                className="mr-2"
                                required />
                              <span className="text-sm font-lato">Will attend</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name={`saturday-${guest.id}`}
                                value="NO"
                                checked={guestResponses[guest.id]?.saturdayResponse === 'NO'}
                                onChange={(e) => updateGuestResponse(guest.id, 'saturday', e.target.value)}
                                className="mr-2"
                                required />
                              <span className="text-sm font-lato">Cannot attend</span>
                            </label>
                          </div>
                        </div>
                      )}

                      {/* Sunday Event */}
                      {invitation.invitedToSunday && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2 font-lato">Sunday Brunch</h4>
                          <div className="space-y-2">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name={`sunday-${guest.id}`}
                                value="YES"
                                checked={guestResponses[guest.id]?.sundayResponse === 'YES'}
                                onChange={(e) => updateGuestResponse(guest.id, 'sunday', e.target.value)}
                                className="mr-2"
                                required />
                              <span className="text-sm font-lato">Will attend</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name={`sunday-${guest.id}`}
                                value="NO"
                                checked={guestResponses[guest.id]?.sundayResponse === 'NO'}
                                onChange={(e) => updateGuestResponse(guest.id, 'sunday', e.target.value)}
                                className="mr-2"
                                required />
                              <span className="text-sm font-lato">Cannot attend</span>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 font-lato">Additional Information</h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="dietary" className="block text-sm font-medium text-gray-700 mb-2 font-lato">
                    Dietary Restrictions (for entire party)
                  </label>
                  <textarea
                    id="dietary"
                    rows={3}
                    value={invitationNotes.dietaryRestrictions}
                    onChange={(e) => updateInvitationNotes('dietaryRestrictions', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-lato"
                    placeholder="Any allergies, dietary preferences, or special requests..." />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2 font-lato">
                    Special Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={invitationNotes.notes}
                    onChange={(e) => updateInvitationNotes('notes', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-lato"
                    placeholder="Any special messages or requests..." />
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm font-lato">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep('lookup')}
                className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-400 font-medium font-lato"
              >
                Back to Search
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-2 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium font-lato"
              >
                {loading ? 'Submitting...' : 'Submit RSVP for All Guests'}
              </button>
            </div>
          </form>
        </div>
      </div></>
  )
}