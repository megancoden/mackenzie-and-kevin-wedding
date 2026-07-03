import { randomBytes } from 'crypto'

const XLSX = require('xlsx')
const { PrismaClient, GuestType } = require('@prisma/client')
const path = require('path')

const prisma = new PrismaClient()

// ── Helpers ──────────────────────────────────────────────────────────────────

function generateCode() {
  return randomBytes(3).toString('hex').toUpperCase()
}

const TITLES = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Miss', 'Rev.', 'Prof.']

function stripTitle(str: string) {
  for (const title of TITLES) {
    if (str.startsWith(title)) return str.slice(title.length).trim()
  }
  return str.trim()
}

function parseBool(val: boolean) {
  if (!val) return false
  return String(val).trim().toLowerCase() === 'y'
}

/**
 * Parses a single invitation string like:
 *   "Mr. Andrew and Mrs. Karen Coden"
 *   "Ms. Mackenzie Coden and Dr. Kevin Schmidt"
 *   "Mrs. Barbara Coden and Guest"
 *   "Ms. Megan Coden"
 */
function parseGuests(raw: string) {
  const parts = raw.split(/\s+and\s+/i).map((s: string) => s.trim())
  const guests = []
  const parsed = []

  for (const part of parts) {
    if (part.toLowerCase() === 'guest') {
      parsed.push({ firstName: 'Plus One', lastName: 'Guest', isGuest: true })
      continue
    }

    const stripped = stripTitle(part)
    const tokens = stripped.split(/\s+/)

    if (tokens.length === 1) {
      parsed.push({ firstName: tokens[0], lastName: null, isGuest: false })
    } else {
      const lastName = tokens[tokens.length - 1]
      const firstName = tokens.slice(0, tokens.length - 1).join(' ')
      parsed.push({ firstName, lastName, isGuest: false })
    }
  }

  // Inherit last name from the last named person if missing
  const sharedLastName = parsed.filter(p => p.lastName && !p.isGuest).slice(-1)[0]?.lastName ?? ''

  for (const p of parsed) {
    guests.push({
      firstName: p.firstName,
      lastName: p.lastName ?? sharedLastName,
      guestType: p.isGuest ? 'PLUS_ONE' : 'NAMED_GUEST',
      knowsMegan: false,
    })
  }

  return guests
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const filePath = process.argv[2]
  if (!filePath) {
    console.error('Usage: node prisma/import-invitations.js <path-to-excel-file>')
    process.exit(1)
  }

  const workbook = XLSX.readFile(path.resolve(filePath))
  const sheet = workbook.Sheets[workbook.SheetNames[0]]

  // Parse as array of objects using the first row as headers
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })

  // Find the relevant column names (trim whitespace from headers)
  const normalize = (str: string) => String(str).trim().toLowerCase()

  console.log(`Found ${rows.length} rows. Importing...\n`)

  let invitationCount = 0
  let guestCount = 0
  let skipped = 0

  for (const row of rows) {
    // Normalize keys to handle extra spaces in column names
    const get = (key: string) => {
      for (const [k, v] of Object.entries(row)) {
        if (normalize(k).includes(normalize(key))) return v
      }
      return ''
    }

    const rawName = String(get('Guest Line 1')).trim()
    if (!rawName) { skipped++; continue }

    const email = String(get('email')).trim() || null
    const invitedToFriday = parseBool(get('Friday') as boolean)
    const invitedToSunday = parseBool(get('Sunday') as boolean)

    const guests = parseGuests(rawName)

    const invitation = await prisma.invitation.create({
      data: {
        invitationCode: generateCode(),
        invitedToSaturday: true,
        invitedToFriday,
        invitedToSunday,
        guests: {
          create: guests.map(g => ({
            firstName: g.firstName,
            lastName: g.lastName,
            guestType: g.guestType,
            knowsMegan: false,
            email: g.guestType === 'NAMED_GUEST' && guests.indexOf(g) === 0 ? email : null,
          })),
        },
      },
      include: { guests: true },
    })

    invitationCount++
    guestCount += invitation.guests.length

    const events = [
      invitedToFriday ? 'Fri' : null,
      'Sat',
      invitedToSunday ? 'Sun' : null,
    ].filter(Boolean).join(', ')

    console.log(`✓ [${invitation.invitationCode}] ${rawName} (${events})${email ? ` <${email}>` : ''}`)
    for (const g of invitation.guests) {
      console.log(`    → ${g.firstName} ${g.lastName} (${g.guestType})`)
    }
  }

  console.log(`\nDone! Imported ${invitationCount} invitations, ${guestCount} guests.${skipped ? ` Skipped ${skipped} blank rows.` : ''}`)
}

main()
  .catch(e => {
    console.error('Import failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())