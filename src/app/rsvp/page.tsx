'use client'

import { FormStep, InvitationWithGuests, Guest, Response } from '@/types'
import Link from 'next/link'
import { useState, useEffect, FormEvent } from 'react'
import { useSearchParams } from 'next/navigation'

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
  const [firstNameSearch, setFirstNameSearch] = useState<string>('')
  const [lastNameSearch, setLastNameSearch] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [submittedInvitation, setSubmittedInvitation] = useState<InvitationWithGuests | null>(null)
  const searchParams = useSearchParams()

  const lookupGuestByName = async (firstName: string, lastName: string) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/rsvp?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`)
      const data = await response.json()

      if (response.ok) {
        setInvitation(data.invitation)
        setSearchedGuest(data.searchedGuest)
        setStep('form')

        const responses: GuestResponsesState = {}
        data.invitation.guests.forEach((guest: Guest) => {
          responses[guest.id] = {
            fridayResponse: guest.fridayResponse || undefined,
            saturdayResponse: guest.saturdayResponse || undefined,
            sundayResponse: guest.sundayResponse || undefined
          }
        })
        setGuestResponses(responses)

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

  useEffect(() => {
    const firstName = searchParams.get('firstName')?.trim() || ''
    const lastName = searchParams.get('lastName')?.trim() || ''

    if (firstName || lastName) {
      setFirstNameSearch(firstName)
      setLastNameSearch(lastName)
    }

    if (firstName && lastName && step === 'lookup' && !invitation && !loading) {
      lookupGuestByName(firstName, lastName)
    }
  }, [searchParams, step, invitation, loading])

  const handleLookup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await lookupGuestByName(firstNameSearch, lastNameSearch)
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
      
      const data = await response.json()
      if (response.ok) {
        // Show confirmation card with returned invitation data
        setSubmittedInvitation(data.invitation || invitation)
      } else {
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
        <div className="max-w-md mx-auto bg-[#f2f5f3] rounded-lg shadow-md p-6 ">
          <h1 className="text-wedding-secondary-dark text-2xl font-bold text-center mb-6">RSVP</h1>
          
          <p className="rsvp-header-text text-lg">
            Enter any name from your invitation to RSVP for your entire party.
          </p>
          
          <form onSubmit={handleLookup}>
            <div className="mb-4">
              <label htmlFor="firstName" className="rsvp-header-text">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                value={firstNameSearch}
                onChange={(e) => setFirstNameSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 rsvp-body-text"
                placeholder="Enter any first name on your invitation"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="lastName" className="rsvp-header-text">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                value={lastNameSearch}
                onChange={(e) => setLastNameSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 rsvp-body-text"
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
              className="w-full py-2 px-4 rsvp-button"
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
        <div className="max-w-md mx-auto bg-[#f2f5f3] rounded-lg shadow-md p-6 casual-font">
          <p className="text-center">Loading...</p>
        </div>
      </div>
    )
  }

  if (submittedInvitation) {
    const email = searchedGuest?.email || 'No email on file'
    const returnGuest = searchedGuest || submittedInvitation.guests[0]
    const returnLink = `/rsvp?firstName=${encodeURIComponent(returnGuest?.firstName || '')}&lastName=${encodeURIComponent(returnGuest?.lastName || '')}`

    return (
      <>
        <Link href="/" legacyBehavior>
          <a className="underline underline-offset-4 hover:text-gray-700">Return to home page</a>
        </Link>

        <div className="min-h-screen py-12 px-4 pt-[96px] background">
          <div className="max-w-3xl mx-auto bg-[#f2f5f3] rounded-lg shadow-md p-6 casual-font">
            <h2 className="text-2xl font-bold fancy-font text-wedding-secondary-dark mb-4">RSVP submitted successfully</h2>

            <p className="mb-4">A confirmation was sent to: <strong>{email}</strong></p>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Summary</h3>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="pb-2">Guest</th>
                    {submittedInvitation.invitedToFriday && <th className="pb-2">Friday</th>}
                    {submittedInvitation.invitedToSaturday && <th className="pb-2">Saturday</th>}
                    {submittedInvitation.invitedToSunday && <th className="pb-2">Sunday</th>}
                  </tr>
                </thead>
                <tbody>
                  {submittedInvitation.guests.map(g => (
                    <tr key={g.id} className="border-t">
                      <td className="py-2">{g.firstName} {g.lastName}</td>
                      {submittedInvitation.invitedToFriday && <td className="py-2">{g.fridayResponse ?? 'No response'}</td>}
                      {submittedInvitation.invitedToSaturday && <td className="py-2">{g.saturdayResponse ?? 'No response'}</td>}
                      {submittedInvitation.invitedToSunday && <td className="py-2">{g.sundayResponse ?? 'No response'}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4">
                <p><strong>Dietary restrictions:</strong> {submittedInvitation.dietaryRestrictions || 'None provided'}</p>
                <p><strong>Notes:</strong> {submittedInvitation.notes || 'None provided'}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Link href={returnLink} legacyBehavior>
                <a className="py-3 px-6 rsvp-button inline-block text-center">Modify RSVP</a>
              </Link>
              <div>P.S. Mackenzie&apos;s sister Megan is turning 25 on October 16th!</div>
              <Link href="/happy-birthday-megan" legacyBehavior>
                <a className="underline hover:text-gray-700">Check out Megan's Birthday Page</a>
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
                      <><Link href="/" legacyBehavior>
      <a className="underline underline-offset-4 hover:text-gray-700">Return to home page</a>
    </Link><div className="min-h-screen py-12 px-4 pt-[96px] background">
        <div className="max-w-4xl mx-auto bg-[#f2f5f3] rounded-lg shadow-md p-6">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold fancy-font text-wedding-secondary-dark mb-2">RSVP for Your Party</h1>
            <p className="text-wedding-secondary casual-font">
              Found invitation for: <span className="casual-font text-wedding-secondary-dark font-bold">{searchedGuest.firstName} {searchedGuest.lastName}</span>
            </p>
            <p className="text-wedding-secondary casual-font">
              {invitation.rsvpStatus === 'COMPLETED' ? 'Updating previous RSVP' : 'Please respond for all members of your party'}
            </p>
          </div>

          <form onSubmit={handleRSVPSubmit}>
            {/* Guest List */}
            <div className="mb-8">
              <h2 className="text-lg fancy-font mb-4 bold-text text-xl">Your Party ({invitation.guests.length} guest{invitation.guests.length > 1 ? 's' : ''})</h2>

              <div className="space-y-6">
                {invitation.guests.map(guest => (
                  <div key={guest.id} className="border border-[var(--wedding-primary-dark)] rounded-lg p-4 background">
                    <h3 className="font-bold text-wedding-secondary-dark mb-3 fancy-font text-xl">
                      {guest.firstName} {guest.lastName}
                      <span className="text-wedding-secondary fancy-font ml-1 text-lg">
                        {guest.guestType === 'PLUS_ONE' && "(Plus One)"}
                        {guest.guestType === 'CHILD' && "(Child)"}
                      </span>
                    </h3>

                    <div className="grid gap-4 md:grid-cols-3">
                      {/* Friday Event */}
                      {invitation.invitedToFriday && (
                        <div>
                          <h4 className="rsvp-body-text text-wedding-secondary-dark mb-1">Friday Welcome Dinner</h4>
                          <div className="space-y-2">
                            <label className="flex items-center mb-0">
                              <input
                                type="radio"
                                name={`friday-${guest.id}`}
                                value="YES"
                                checked={guestResponses[guest.id]?.fridayResponse === 'YES'}
                                onChange={(e) => updateGuestResponse(guest.id, 'friday', e.target.value)}
                                className="mr-2"
                                required />
                              <span className="rsvp-body-text">Will attend</span>
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
                              <span className="rsvp-body-text">Cannot attend</span>
                            </label>
                          </div>
                        </div>
                      )}

                      {/* Saturday Event */}
                      {invitation.invitedToSaturday && (
                        <div>
                          <h4 className="rsvp-body-text text-wedding-secondary-dark mb-1">Saturday Wedding</h4>
                          <div className="space-y-2">
                            <label className="flex items-center mb-0">
                              <input
                                type="radio"
                                name={`saturday-${guest.id}`}
                                value="YES"
                                checked={guestResponses[guest.id]?.saturdayResponse === 'YES'}
                                onChange={(e) => updateGuestResponse(guest.id, 'saturday', e.target.value)}
                                className="mr-2"
                                required />
                              <span className="rsvp-body-text">Will attend</span>
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
                              <span className="rsvp-body-text">Cannot attend</span>
                            </label>
                          </div>
                        </div>
                      )}

                      {/* Sunday Event */}
                      {invitation.invitedToSunday && (
                        <div>
                          <h4 className="rsvp-body-text text-wedding-secondary-dark mb-1">Sunday Brunch</h4>
                          <div className="space-y-2">
                            <label className="flex items-center mb-0">
                              <input
                                type="radio"
                                name={`sunday-${guest.id}`}
                                value="YES"
                                checked={guestResponses[guest.id]?.sundayResponse === 'YES'}
                                onChange={(e) => updateGuestResponse(guest.id, 'sunday', e.target.value)}
                                className="mr-2"
                                required />
                              <span className="rsvp-body-text">Will attend</span>
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
                              <span className="rsvp-body-text">Cannot attend</span>
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
              <h2 className="header-title mb-2" style={{ fontSize: "24px", fontWeight: "bold"}}>Additional Information</h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="dietary" className="block rsvp-body-text mb-1">
                    Dietary Restrictions (for entire party)
                  </label>
                  <textarea
                    id="dietary"
                    rows={3}
                    value={invitationNotes.dietaryRestrictions}
                    onChange={(e) => updateInvitationNotes('dietaryRestrictions', e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--wedding-primary-dark)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--wedding-primary-dark)] casual-font"
                    placeholder="Any allergies, dietary preferences, or special requests..." />
                </div>

                <div>
                  <label htmlFor="notes" className="block rsvp-body-text mb-1">
                    Special Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={invitationNotes.notes}
                    onChange={(e) => updateInvitationNotes('notes', e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--wedding-primary-dark)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--wedding-primary-dark)] casual-font"
                    placeholder="Any special messages or requests..." />
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm casual-font">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep('lookup')}
                className="py-3 px-6 rsvp-button !bg-[var(--wedding-primary-light)] text-wedding-secondary hover:!bg-[var(--wedding-primary-dark)] hover:!text-[var(--wedding-accent)]"
              >
                Back to Search
              </button>
              <button
                type="submit"
                disabled={loading}
                className="py-3 px-6 rsvp-button"
              >
                {loading ? 'Submitting...' : 'Submit RSVP for All Guests'}
              </button>
            </div>
          </form>
        </div>
      </div></>
  )
}