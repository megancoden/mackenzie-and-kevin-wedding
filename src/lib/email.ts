import nodemailer from 'nodemailer'
import type { InvitationWithGuests } from '@/types'

const smtpHost = process.env.SMTP_HOST
const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined
const smtpUser = process.env.SMTP_USER
const smtpPass = process.env.SMTP_PASS
const fromAddress = process.env.EMAIL_FROM
const fromName = process.env.EMAIL_FROM_NAME || 'Wedding RSVP'

function createTransport() {
  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !fromAddress) {
    console.warn('Email transport not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and EMAIL_FROM.')
    return null
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  })
}

function formatResponse(response?: string | null) {
  if (response === 'YES') return 'Yes'
  if (response === 'NO') return 'No'
  return 'No response'
}

function formatMealPreference(meal?: string | null) {
  if (meal === 'CHICKEN') return 'Chicken'
  if (meal === 'SALMON') return 'Salmon'
  if (meal === 'VEGETARIAN') return 'Vegetarian'
  return 'Not selected'
}

function buildEmailBody(invitation: InvitationWithGuests) {
  const columns = [
    { key: 'friday', label: 'Friday Drinks', visible: invitation.invitedToFriday },
    { key: 'saturday', label: 'Wedding', visible: invitation.invitedToSaturday },
    { key: 'meal', label: 'Wedding Meal', visible: invitation.invitedToSaturday },
    { key: 'sunday', label: 'Sunday Brunch', visible: invitation.invitedToSunday }
  ].filter(column => column.visible)

  const primaryGuest = invitation.guests.find((guest) => guest.firstName && guest.lastName) || invitation.guests[0]
  const siteUrl = 'https://mackenzieandkevin.com'
  const rsvpLink = `${siteUrl.replace(/\/$/, '')}/rsvp?firstName=${encodeURIComponent(primaryGuest.firstName)}&lastName=${encodeURIComponent(primaryGuest.lastName)}`

  const eventRows = invitation.guests.map((guest) => {
    const cells = columns.map((column) => {
      if (column.key === 'meal') {
        return `<td style="padding: 8px; border: 1px solid #ddd;">${formatMealPreference(guest.dinnerRequest)}</td>`
      }

      const response = guest[`${column.key}Response` as 'fridayResponse' | 'saturdayResponse' | 'sundayResponse']
      return `<td style="padding: 8px; border: 1px solid #ddd;">${formatResponse(response)}</td>`
    }).join('')

    return `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${guest.firstName} ${guest.lastName}</td>
        ${cells}
      </tr>`
  }).join('')

  const dietary = invitation.guests[0]?.dietaryRestrictions ?? 'None provided'
  const notes = invitation.guests[0]?.notes ?? 'None provided'

  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h1 style="font-size: 24px; margin-bottom: 16px;">Your RSVP is confirmed</h1>
      <p>Thank you for submitting your RSVP. Here is the summary for your party:</p>
      <table style="border-collapse: collapse; width: 100%; margin-top: 16px; margin-bottom: 24px;">
        <thead>
          <tr>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Guest</th>
            ${columns.map(column => `<th style="padding: 8px; border: 1px solid #ddd; text-align: left;">${column.label}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${eventRows}
        </tbody>
      </table>
      <p><strong>Dietary restrictions:</strong> ${dietary}</p>
      <p><strong>Special notes:</strong> ${notes}</p>
      <p>If you need to update your RSVP, you can return to the RSVP page and edit your response:</p>
      <p><a href="${rsvpLink}" style="color: #1d4ed8; text-decoration: none;">Update your RSVP</a></p>
    </div>`
}

export async function sendRsvpConfirmationEmail(invitation: InvitationWithGuests) {
  const recipients = Array.from(
    new Set(invitation.guests.map((guest) => guest.email).filter(Boolean) as string[])
  )

  if (recipients.length === 0) {
    console.warn('No guest email addresses available for RSVP confirmation email.')
    return
  }

  const transporter = createTransport()
  if (!transporter) return

  const [firstRecipient, ...bccRecipients] = recipients

  await transporter.sendMail({
    from: `${fromName} <${fromAddress}>`,
    to: firstRecipient,
    bcc: bccRecipients.length ? bccRecipients : undefined,
    subject: 'Wedding RSVP Confirmation',
    html: buildEmailBody(invitation),
  })
}
