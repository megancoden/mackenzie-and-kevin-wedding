'use client'

import { FormStep, InvitationWithGuests, Guest, Response } from '@/types'
import type { MealPreference } from '@prisma/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback, FormEvent } from 'react'

interface InvitationNotes {
  dietaryRestrictions: string
  notes: string
}

type GuestResponsesState = Record<string, {
  fridayResponse?: Response
  saturdayResponse?: Response
  sundayResponse?: Response
  dinnerRequest?: MealPreference | null
  plusOneFirstName?: string
  plusOneLastName?: string
}>

function formatMealChoice(meal?: MealPreference | null) {
  if (meal === 'CHICKEN') return 'Chicken'
  if (meal === 'SALMON') return 'Salmon'
  if (meal === 'VEGETARIAN') return 'Vegetarian'
  return 'Not selected'
}

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
  const [contactEmail, setContactEmail] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [submittedInvitation, setSubmittedInvitation] = useState<InvitationWithGuests | null>(null)
  const [confirmationEmail, setConfirmationEmail] = useState<string>('')
  const router = useRouter()

  const clearLookupFields = useCallback(() => {
    setFirstNameSearch('')
    setLastNameSearch('')
  }, [])

  const lookupGuestByName = useCallback(async (firstName: string, lastName: string) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/rsvp?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`)
      const data = await response.json()

      if (response.ok) {
        setInvitation(data.invitation)
        setSearchedGuest(data.searchedGuest)
        setStep('form')
        setSubmittedInvitation(null)
        setConfirmationEmail('')
        setError('')
        clearLookupFields()

        const responses: GuestResponsesState = {}
        data.invitation.guests.forEach((guest: Guest) => {
          responses[guest.id] = {
            fridayResponse: guest.fridayResponse || undefined,
            saturdayResponse: guest.saturdayResponse || undefined,
            sundayResponse: guest.sundayResponse || undefined,
            dinnerRequest: guest.dinnerRequest || undefined
          }
        })
        setGuestResponses(responses)

        setInvitationNotes({
          dietaryRestrictions: data.invitation.guests[0]?.dietaryRestrictions || '',
          notes: data.invitation.guests[0]?.notes || ''
        })
        setContactEmail(data.searchedGuest.email || '')
      } else {
        throw data.error;
      }
    } catch (error) {
      console.error('Lookup error:', error)
      setError(error instanceof Error ? error.message : 'We couldn’t find that name. Please check the name on your invitation and try again.')
    } finally {
      setLoading(false)
    }
  }, [clearLookupFields])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const firstName = params.get('firstName')?.trim() || ''
    const lastName = params.get('lastName')?.trim() || ''

    if (firstName || lastName) {
      setFirstNameSearch(firstName)
      setLastNameSearch(lastName)
    }

    if (firstName && lastName && step === 'lookup' && !invitation && !loading) {
      lookupGuestByName(firstName, lastName)
    }
  }, [step, invitation, loading, lookupGuestByName])

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

    const primaryGuestId = searchedGuest?.id

    if (!primaryGuestId) {
      setError('Please find your invitation before submitting your RSVP.')
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

    const missingMealSelections = invitation.guests.some(guest => {
      if (!invitation.invitedToSaturday) return false
      return guestResponses[guest.id]?.saturdayResponse === 'YES' && !guestResponses[guest.id]?.dinnerRequest
    })
    
    if (missingResponses) {
      setError('Please provide a response for all guests and all events.')
      setLoading(false)
      return
    }

    if (missingMealSelections) {
      setError('Please select a Saturday meal choice for each guest attending Saturday.')
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
          sundayResponse: responses.sundayResponse,
          dinnerRequest: responses.dinnerRequest ?? null,
          plusOneFirstName: responses.plusOneFirstName?.trim() || undefined,
          plusOneLastName: responses.plusOneLastName?.trim() || undefined
        })),
        emailGuestId: primaryGuestId,
        emailAddress: contactEmail.trim() || null,
        ...invitationNotes
      }

      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      })

      const data = await response.json()
      if (response.ok) {
        setSubmittedInvitation(data.invitation || invitation)
        setConfirmationEmail(data.confirmationEmail || contactEmail.trim() || '')
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

  const updateGuestMealChoice = (guestId: string, value: string) => {
    setGuestResponses(prev => ({
      ...prev,
      [guestId]: {
        ...prev[guestId],
        dinnerRequest: value as MealPreference
      }
    }))
  }

  const updateGuestPlusOneFirstName = (guestId: string, value: string) => {
    setGuestResponses(prev => ({
      ...prev,
      [guestId]: {
        ...prev[guestId],
        plusOneFirstName: value
      }
    }))
  }

  const updateGuestPlusOneLastName = (guestId: string, value: string) => {
    setGuestResponses(prev => ({
      ...prev,
      [guestId]: {
        ...prev[guestId],
        plusOneLastName: value
      }
    }))
  }

  const updateInvitationNotes = (field: keyof InvitationNotes, value: string) => {
    setInvitationNotes(prev => ({ ...prev, [field]: value }))
  }

  const showEmailField = !invitation?.guests.some(guest => guest.email?.trim())
  const isFormComplete = invitation ? invitation.guests.every(guest => {
    const guestResponsesForGuest = guestResponses[guest.id]

    if (invitation.invitedToFriday && !guestResponsesForGuest?.fridayResponse) return false
    if (invitation.invitedToSaturday && !guestResponsesForGuest?.saturdayResponse) return false
    if (invitation.invitedToSunday && !guestResponsesForGuest?.sundayResponse) return false
    if (invitation.invitedToSaturday && guestResponsesForGuest?.saturdayResponse === 'YES' && !guestResponsesForGuest?.dinnerRequest) return false

    return true
  }) : false

  if (step === 'lookup') {
    return (
      <div className="min-h-screen py-12 px-4 background pt-[148px]">
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
      <div className="min-h-screen py-12 px-4 pt-[124px] background">
        <div className="max-w-md mx-auto bg-[#f2f5f3] rounded-lg shadow-md p-6 casual-font">
          <p className="text-center">Loading...</p>
        </div>
      </div>
    )
  }

  if (submittedInvitation) {
    const email = confirmationEmail || ''
    const returnGuest = searchedGuest || submittedInvitation.guests[0]
    const returnLink = `/rsvp?firstName=${encodeURIComponent(returnGuest?.firstName || '')}&lastName=${encodeURIComponent(returnGuest?.lastName || '')}`
    const showBirthdayPageLink = submittedInvitation.guests.some((guest) => guest.knowsMegan)

    const handleModifyRsvp = async () => {
      if (!returnGuest?.firstName || !returnGuest?.lastName) return

      setSubmittedInvitation(null)
      setConfirmationEmail('')
      setError('')
      setFirstNameSearch(returnGuest.firstName)
      setLastNameSearch(returnGuest.lastName)
      router.push(returnLink)
      await lookupGuestByName(returnGuest.firstName, returnGuest.lastName)
    }

    return (
      <>
        <Link href="/" legacyBehavior>
          <a className="underline underline-offset-4 hover:text-gray-700">Return to home page</a>
        </Link>

        <div className="min-h-screen py-12 px-4 pt-[124px] background">
          <div className="max-w-3xl mx-auto bg-[#f2f5f3] rounded-lg shadow-md p-6 casual-font">
            <h2 className="text-2xl font-bold fancy-font text-wedding-secondary-dark mb-4">RSVP submitted successfully</h2>

            {email ? (
              <p className="mb-4">A confirmation was sent to: <strong>{email}</strong></p>
            ) : (
              <p className="mb-4">Your RSVP has been saved. No confirmation email was sent because no email address was provided.</p>
            )}

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Summary</h3>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="pb-2">Guest</th>
                    {submittedInvitation.invitedToFriday && <th className="pb-2">Friday Drinks</th>}
                    {submittedInvitation.invitedToSaturday && <th className="pb-2">Wedding</th>}
                    {submittedInvitation.invitedToSaturday && <th className="pb-2">Wedding Meal</th>}
                    {submittedInvitation.invitedToSunday && <th className="pb-2">Sunday Brunch</th>}
                  </tr>
                </thead>
                <tbody>
                  {submittedInvitation.guests.map(g => (
                    <tr key={g.id} className="border-t">
                      <td className="py-2">{g.firstName} {g.lastName}</td>
                      {submittedInvitation.invitedToFriday && <td className="py-2">{g.fridayResponse ?? 'No response'}</td>}
                      {submittedInvitation.invitedToSaturday && <td className="py-2">{g.saturdayResponse ?? 'No response'}</td>}
                      {submittedInvitation.invitedToSaturday && <td className="py-2">{formatMealChoice(g.dinnerRequest)}</td>}
                      {submittedInvitation.invitedToSunday && <td className="py-2">{g.sundayResponse ?? 'No response'}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4">
                <p><strong>Dietary restrictions:</strong> {submittedInvitation.guests[0]?.dietaryRestrictions || 'None provided'}</p>
                <p><strong>Notes:</strong> {submittedInvitation.guests[0]?.notes || 'None provided'}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={() => void handleModifyRsvp()}
                disabled={loading}
                className="py-3 px-6 rsvp-button inline-block text-center disabled:opacity-70"
              >
                {loading ? 'Loading...' : 'Modify RSVP'}
              </button>
              {showBirthdayPageLink && (
                <>
                  <div>P.S. Mackenzie&apos;s sister Megan is turning 25 on October 16th!</div>
                  <Link href="/happy-birthday-megan" legacyBehavior>
                    <a className="underline hover:text-gray-700">Check out Megan&apos;s Birthday Page</a>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
                      <><Link href="/" legacyBehavior>
      <a className="underline underline-offset-4 hover:text-gray-700">Return to home page</a>
    </Link><div className="min-h-screen py-12 px-4 pt-[124px] background">
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
                        {guest.guestType === 'PLUS_ONE' && guest.firstName !== "PLUS_ONE" ? ' (Plus One)' : ''}
                      </span>
                    </h3>

                    {guest.guestType === 'PLUS_ONE' && (
                      <div className="mb-4 grid gap-4 md:grid-cols-2">
                        <div>
                          <label htmlFor={`plusOneFirstName-${guest.id}`} className="block rsvp-body-text mb-1">
                            Plus one first name (optional)
                          </label>
                          <input
                            type="text"
                            id={`plusOneFirstName-${guest.id}`}
                            value={guestResponses[guest.id]?.plusOneFirstName ?? ''}
                            onChange={(e) => updateGuestPlusOneFirstName(guest.id, e.target.value)}
                            placeholder="First name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--wedding-primary-dark)] casual-font"
                          />
                        </div>
                        <div>
                          <label htmlFor={`plusOneLastName-${guest.id}`} className="block rsvp-body-text mb-1">
                            Plus one last name (optional)
                          </label>
                          <input
                            type="text"
                            id={`plusOneLastName-${guest.id}`}
                            value={guestResponses[guest.id]?.plusOneLastName ?? ''}
                            onChange={(e) => updateGuestPlusOneLastName(guest.id, e.target.value)}
                            placeholder="Last name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--wedding-primary-dark)] casual-font"
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-3">
                      {/* Friday Event */}
                      {invitation.invitedToFriday && (
                        <div>
                          <h4 className="rsvp-body-text text-wedding-secondary-dark mb-1">Friday Welcome Drinks</h4>
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
                            {guestResponses[guest.id]?.saturdayResponse === 'YES' && (
                            <div className="mt-3">
                              <label htmlFor={`meal-${guest.id}`} className="block rsvp-body-text mb-1">Saturday meal choice</label>
                              <select
                                id={`meal-${guest.id}`}
                                value={guestResponses[guest.id]?.dinnerRequest ?? ''}
                                onChange={(e) => updateGuestMealChoice(guest.id, e.target.value)}
                                required={guestResponses[guest.id]?.saturdayResponse === 'YES'}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--wedding-primary-dark)] casual-font"
                              >
                                <option value="">Select a meal</option>
                                <option value="CHICKEN">Chicken</option>
                                <option value="SALMON">Salmon</option>
                                <option value="VEGETARIAN">Vegetarian</option>
                              </select>
                            </div>
                            )}
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
                            {showEmailField && (
                <div className="mb-4">
                  <label htmlFor="contactEmail" className="block rsvp-body-text mb-1">
                    Email address (optional)
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--wedding-primary-dark)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--wedding-primary-dark)] casual-font"
                    placeholder="Enter an email to receive your confirmation"
                  />
                  <p className="mt-1 text-sm text-gray-600 casual-font">We’ll use this only to send your RSVP confirmation.</p>
                </div>
              )}
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
                disabled={loading || !isFormComplete}
                className="py-3 px-6 rsvp-button disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit RSVP for All Guests'}
              </button>
            </div>
          </form>
        </div>
      </div></>
  )
}