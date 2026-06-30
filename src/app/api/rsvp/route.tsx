import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendRsvpConfirmationEmail } from '@/lib/email'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const firstName = searchParams.get('firstName')
  const lastName = searchParams.get('lastName')
  
  if (!firstName || !lastName) {
    return NextResponse.json({ error: 'First name and last name required' }, { status: 400 })
  }
  
  try {
    // Find the guest and include their invitation and all other guests on the same invitation
    const guest = await prisma.guest.findFirst({
      where: {
        firstName: {
          contains: firstName,
          mode: 'insensitive'
        },
        lastName: {
          contains: lastName,
          mode: 'insensitive'
        }
      },
      include: {
        invitation: {
          include: {
            guests: {
              orderBy: [
                { guestType: 'asc' }, // Named guests first, then plus ones
                { firstName: 'asc' }
              ]
            }
          }
        }
      }
    })
    
    if (!guest) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 })
    }
    
    // Return the invitation with all guests
    return NextResponse.json({
      invitation: guest.invitation,
      searchedGuest: guest
    })
  } catch (error) {
    console.error('Guest lookup error:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      invitationId: string
      guestResponses: Array<{
        guestId: string
        fridayResponse?: string | null
        saturdayResponse?: string | null
        sundayResponse?: string | null
        plusOneFirstName?: string | null
        plusOneLastName?: string | null
      }>
      dietaryRestrictions?: string | null
      notes?: string | null
    }

    const { invitationId, guestResponses, dietaryRestrictions, notes } = body

    // Start a transaction to update all guests and the invitation
    const result = await prisma.$transaction(async (tx) => {
      // Update each guest's responses
      for (const response of guestResponses) {
        const updateData: any = {
          fridayResponse: response.fridayResponse ?? null,
          saturdayResponse: response.saturdayResponse ?? null,
          sundayResponse: response.sundayResponse ?? null,
          updatedAt: new Date()
        }

        if (typeof response.plusOneFirstName === 'string' && response.plusOneFirstName.trim()) {
          updateData.firstName = response.plusOneFirstName.trim()
        }
        if (typeof response.plusOneLastName === 'string' && response.plusOneLastName.trim()) {
          updateData.lastName = response.plusOneLastName.trim()
        }

        await tx.guest.update({
          where: { id: response.guestId },
          data: updateData
        })
      }
      
      // Update the invitation status and notes
      const updatedInvitation = await tx.invitation.update({
        where: { id: invitationId },
        data: {
          rsvpStatus: 'COMPLETED',
          rsvpSubmittedAt: new Date(),
          dietaryRestrictions: dietaryRestrictions || null,
          notes: notes || null,
          updatedAt: new Date()
        } as any,
        include: {
          guests: true
        }
      }) as any
      
      return updatedInvitation
    })

    sendRsvpConfirmationEmail(result).catch((emailError) => {
      console.error('Failed to send RSVP confirmation email:', emailError)
    })
    
    return NextResponse.json({ success: true, invitation: result })
  } catch (error) {
    console.error('RSVP error:', error)
    return NextResponse.json({ error: 'Failed to save RSVP' }, { status: 500 })
  }
}