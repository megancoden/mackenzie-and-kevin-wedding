import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { prisma } from '@/lib/db'

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

function buildReminderEmailBody(invitationCode: string, guestNames: string[], primaryFirstName: string, primaryLastName: string) {
  const siteUrl = 'https://mackenzieandkevin.com'
  const rsvpLink = `${siteUrl.replace(/\/$/, '')}/rsvp?firstName=${encodeURIComponent(primaryFirstName)}&lastName=${encodeURIComponent(primaryLastName)}`

  // Format guest names: "John", "John and Jane", "John, Jane, and Tommy"
  let greeting: string
  if (guestNames.length === 1) {
    greeting = guestNames[0]
  } else if (guestNames.length === 2) {
    greeting = `${guestNames[0]} and ${guestNames[1]}`
  } else {
    greeting = guestNames.slice(0, -1).join(', ') + ', and ' + guestNames[guestNames.length - 1]
  }

  return `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
      <h1 style="font-size: 24px; margin-bottom: 16px;">RSVP Reminder</h1>
      <p>Hi ${greeting},</p>
      <p>We hope you're excited for the wedding! We wanted to remind you that the <strong>RSVP deadline is September 5th</strong>.</p>
      <p>If you haven't already, please complete your RSVP by clicking the link below:</p>
      <p style="margin: 24px 0;">
        <a href="${rsvpLink}" style="background-color: #dc94aa; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Submit Your RSVP</a>
      </p>
      <p>If you have any questions, please don't hesitate to reach out.</p>
      <p>We can't wait to celebrate with you!</p>
    </div>
  `
}

export async function POST(request: NextRequest) {
  try {
    // Check for dryRun query parameter
    const { searchParams } = new URL(request.url)
    const dryRun = searchParams.get('dryRun') === 'true'

    // Fetch all pending invitations
    const pendingInvitations = await prisma.invitation.findMany({
      where: { rsvpStatus: 'PENDING' },
      include: { guests: true },
    })

    if (pendingInvitations.length === 0) {
      return NextResponse.json(
        { message: 'No pending invitations found.', sent: 0 },
        { status: 200 }
      )
    }

    if (!dryRun) {
      const transporter = createTransport()
      if (!transporter) {
        return NextResponse.json(
          { error: 'Email transport not configured.' },
          { status: 500 }
        )
      }
    }

    const results = []

    for (const invitation of pendingInvitations) {
      // Get a contact email from the guests
      const contactGuest = invitation.guests.find((g) => g.email)
      if (!contactGuest) {
        results.push({
          invitationCode: invitation.invitationCode,
          status: 'skipped',
          reason: 'No email address found for any guest',
        })
        continue
      }

      const primaryGuest = invitation.guests.find((g) => g.firstName && g.lastName) || invitation.guests[0]
      const primaryName = `${primaryGuest.firstName} ${primaryGuest.lastName}`
      
      // Get all guest names for greeting (exclude plus ones)
      const guestNames = invitation.guests
        .filter((g) => g.guestType !== 'PLUS_ONE')
        .map((g) => g.firstName)
        .filter(Boolean)

      if (dryRun) {
        // Dry run: just show what would be sent
        results.push({
          invitationCode: invitation.invitationCode,
          contactName: primaryName,
          email: contactGuest.email,
          guestCount: invitation.guests.length,
          guestNames: invitation.guests.map((g) => `${g.firstName} ${g.lastName}`).join(', '),
          status: 'would_send',
        })
      } else {
        // Real send
        try {
          const transporter = createTransport()
          await transporter!.sendMail({
            from: `${fromName} <${fromAddress}>`,
            to: contactGuest.email,
            subject: 'RSVP Reminder: Deadline September 5th',
            html: buildReminderEmailBody(invitation.invitationCode, guestNames, primaryGuest.firstName, primaryGuest.lastName),
          })

          results.push({
            invitationCode: invitation.invitationCode,
            email: contactGuest.email,
            status: 'sent',
          })
        } catch (error) {
          results.push({
            invitationCode: invitation.invitationCode,
            email: contactGuest.email,
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error',
          })
        }
      }
    }

    const sentCount = results.filter((r) => r.status === 'sent' || r.status === 'would_send').length

    return NextResponse.json(
      {
        message: dryRun ? `Dry run: Would send to ${sentCount} invitation(s)` : `Reminder emails sent successfully.`,
        dryRun,
        sent: sentCount,
        total: pendingInvitations.length,
        results,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending reminder emails:', error)
    return NextResponse.json(
      { error: 'Failed to send reminder emails', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
