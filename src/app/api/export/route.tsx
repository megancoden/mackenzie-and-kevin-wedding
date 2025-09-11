import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import * as XLSX from 'xlsx'

export async function GET() {
  try {
    const invitations = await prisma.invitation.findMany({
      include: {
        guests: {
          orderBy: [
            { guestType: 'asc' },
            { firstName: 'asc' }
          ]
        }
      },
      orderBy: { createdAt: 'asc' }
    })
    
    // Create detailed guest list
    const guestData = []
    
    invitations.forEach((invitation, invitationIndex) => {
      invitation.guests.forEach((guest, guestIndex) => {
        guestData.push({
          'Invitation #': invitationIndex + 1,
          'Invitation ID': invitation.id,
          'Guest Type': guest.guestType,
          'First Name': guest.firstName,
          'Last Name': guest.lastName,
          'Email': guest.email || '',
          'Phone': guest.phone || '',
          'Invited to Friday': invitation.invitedToFriday ? 'Yes' : 'No',
          'Invited to Saturday': invitation.invitedToSaturday ? 'Yes' : 'No',
          'Invited to Sunday': invitation.invitedToSunday ? 'Yes' : 'No',
          'Friday Response': guest.fridayResponse || 'No Response',
          'Saturday Response': guest.saturdayResponse || 'No Response',
          'Sunday Response': guest.sundayResponse || 'No Response',
          'RSVP Status': invitation.rsvpStatus,
          'RSVP Submitted': invitation.rsvpSubmittedAt ? invitation.rsvpSubmittedAt.toLocaleDateString() : '',
          'Dietary Restrictions': invitation.dietaryRestrictions || '',
          'Notes': invitation.notes || '',
          'Created At': invitation.createdAt.toLocaleDateString(),
          'Updated At': invitation.updatedAt.toLocaleDateString()
        })
      })
    })
    
    // Create summary by invitation
    const invitationSummary = invitations.map((invitation, index) => {
      const attendingFriday = invitation.guests.filter(g => g.fridayResponse === 'YES').length
      const attendingSaturday = invitation.guests.filter(g => g.saturdayResponse === 'YES').length
      const attendingSunday = invitation.guests.filter(g => g.sundayResponse === 'YES').length
      
      return {
        'Invitation #': index + 1,
        'Primary Guest': invitation.guests[0] ? `${invitation.guests[0].firstName} ${invitation.guests[0].lastName}` : '',
        'Total Guests': invitation.guests.length,
        'RSVP Status': invitation.rsvpStatus,
        'Attending Friday': attendingFriday,
        'Attending Saturday': attendingSaturday,
        'Attending Sunday': attendingSunday,
        'Dietary Restrictions': invitation.dietaryRestrictions || '',
        'Notes': invitation.notes || ''
      }
    })
    
    // Create counts summary
    const totalGuests = invitations.reduce((sum, inv) => sum + inv.guests.length, 0)
    const completedRSVPs = invitations.filter(inv => inv.rsvpStatus === 'COMPLETED').length
    const totalFridayAttending = invitations.reduce((sum, inv) => 
      sum + inv.guests.filter(g => g.fridayResponse === 'YES').length, 0
    )
    const totalSaturdayAttending = invitations.reduce((sum, inv) => 
      sum + inv.guests.filter(g => g.saturdayResponse === 'YES').length, 0
    )
    const totalSundayAttending = invitations.reduce((sum, inv) => 
      sum + inv.guests.filter(g => g.sundayResponse === 'YES').length, 0
    )
    
    const summaryData = [
      { 'Metric': 'Total Invitations', 'Count': invitations.length },
      { 'Metric': 'Total Guests', 'Count': totalGuests },
      { 'Metric': 'Completed RSVPs', 'Count': completedRSVPs },
      { 'Metric': 'Pending RSVPs', 'Count': invitations.length - completedRSVPs },
      { 'Metric': 'Friday Attendees', 'Count': totalFridayAttending },
      { 'Metric': 'Saturday Attendees', 'Count': totalSaturdayAttending },
      { 'Metric': 'Sunday Attendees', 'Count': totalSundayAttending }
    ]
    
    // Create workbook with multiple sheets
    const workbook = XLSX.utils.book_new()
    
    const summarySheet = XLSX.utils.json_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')
    
    const invitationSheet = XLSX.utils.json_to_sheet(invitationSummary)
    XLSX.utils.book_append_sheet(workbook, invitationSheet, 'Invitations')
    
    const guestSheet = XLSX.utils.json_to_sheet(guestData)
    XLSX.utils.book_append_sheet(workbook, guestSheet, 'Detailed Guest List')
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' })
    
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="wedding-rsvp-data.xlsx"'
      }
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 })
  }
}