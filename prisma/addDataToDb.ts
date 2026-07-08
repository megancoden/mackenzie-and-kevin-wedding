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

// Lowercase particles that should be joined with the word that follows them
// e.g. "La Plante", "Al Souz", "Van Buren"
const LAST_NAME_PARTICLES = new Set([
  'al', 'la', 'le', 'de', 'del', 'della', 'der', 'van', 'von', 'di', 'da', 'ter', 'ten',
])

// Escape hatch for names the particle heuristic can't catch (e.g. Spanish
// double surnames with no particle word). Match on the full stripped name.
const LAST_NAME_OVERRIDES: Record<string, string> = {
  'María Luisa Gómez Calvo': 'Gómez Calvo',
}

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
 * Splits a stripped name (title already removed) into firstName/lastName.
 * Handles single-token names (no last name), particle-based compound last
 * names ("La Plante", "Al Souz"), and manual overrides for edge cases.
 */
function splitName(stripped: string): { firstName: string; lastName: string | null } {
  if (LAST_NAME_OVERRIDES[stripped]) {
    const lastName = LAST_NAME_OVERRIDES[stripped]
    const firstName = stripped.slice(0, stripped.length - lastName.length).trim()
    return { firstName, lastName }
  }

  const tokens = stripped.split(/\s+/)

  if (tokens.length === 1) {
    return { firstName: tokens[0], lastName: null }
  }

  if (tokens.length >= 3 && LAST_NAME_PARTICLES.has(tokens[tokens.length - 2].toLowerCase())) {
    return {
      firstName: tokens.slice(0, -2).join(' '),
      lastName: tokens.slice(-2).join(' '),
    }
  }

  return {
    firstName: tokens.slice(0, -1).join(' '),
    lastName: tokens[tokens.length - 1],
  }
}

/**
 * Parses a single invitation string like:
 *   "Mr. Andrew and Mrs. Karen Coden"
 *   "Ms. Mackenzie Coden and Dr. Kevin Schmidt"
 *   "Mrs. Barbara Coden and Guest"
 *   "Ms. Birgitta Istock and Mr. James Istock and Mr. Jack Istock"
 */
function parseGuests(raw: string, knowsMegan: boolean) {
  const parts = raw.split(/\s+and\s+/i).map((s: string) => s.trim())
  const parsed: { firstName: string; lastName: string | null; isGuest: boolean }[] = []

  for (const part of parts) {
    if (part.toLowerCase() === 'guest') {
      parsed.push({ firstName: 'Plus One', lastName: 'Guest', isGuest: true })
      continue
    }

    const stripped = stripTitle(part)
    const { firstName, lastName } = splitName(stripped)
    parsed.push({ firstName, lastName, isGuest: false })
  }

  // Inherit last name from the last explicitly-named person if missing
  const sharedLastName = parsed.filter(p => p.lastName && !p.isGuest).slice(-1)[0]?.lastName ?? ''

  return parsed.map(p => ({
    firstName: p.firstName,
    lastName: p.lastName ?? sharedLastName,
    guestType: p.isGuest ? 'PLUS_ONE' : 'NAMED_GUEST',
    knowsMegan,
  }))
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

  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })

  const normalize = (str: string) => String(str).trim().toLowerCase()

  console.log(`Found ${rows.length} rows. Importing...\n`)

  let invitationCount = 0
  let guestCount = 0
  let skipped = 0

  for (const row of rows) {
    const get = (key: string) => {
      for (const [k, v] of Object.entries(row)) {
        if (normalize(k).includes(normalize(key))) return v
      }
      return ''
    }

    const rawName = String(get('Guest Line 1')).trim()
    if (!rawName) { skipped++; continue }

    const email = String(get('email')).trim() || null
    const invitedFriSun = parseBool(get('Fri/Sun') as boolean)
    const knowsMegan = parseBool(get('Megan') as boolean)

    const guests = parseGuests(rawName, knowsMegan)

    const invitation = await prisma.invitation.create({
      data: {
        invitationCode: generateCode(),
        invitedToSaturday: true,
        invitedToFriday: invitedFriSun,
        invitedToSunday: invitedFriSun,
        guests: {
          create: guests.map(g => ({
            firstName: g.firstName,
            lastName: g.lastName,
            guestType: g.guestType,
            knowsMegan: g.knowsMegan,
            email,
          })),
        },
      },
      include: { guests: true },
    })

    invitationCount++
    guestCount += invitation.guests.length

    const events = [
      invitedFriSun ? 'Fri' : null,
      'Sat',
      invitedFriSun ? 'Sun' : null,
    ].filter(Boolean).join(', ')

    console.log(`✓ [${invitation.invitationCode}] ${rawName} (${events})${email ? ` <${email}>` : ''}${knowsMegan ? ' [knows Megan]' : ''}`)
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