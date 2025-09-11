const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Example family invitations
  const familyInvitations = [
    {
      // The Smith Family - all 3 events
      invitation: {
        invitationCode: 'SMITH001',
        invitedToFriday: true,
        invitedToSaturday: true,
        invitedToSunday: true
      },
      guests: [
        {
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@example.com',
          phone: '555-0123',
          guestType: 'NAMED_GUEST'
        },
        {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          guestType: 'NAMED_GUEST'
        },
        {
          firstName: 'Tommy',
          lastName: 'Smith',
          guestType: 'CHILD'
        }
      ]
    },
    {
      // Single guest with plus one - Saturday only
      invitation: {
        invitationCode: 'DOE001',
        invitedToFriday: false,
        invitedToSaturday: true,
        invitedToSunday: false
      },
      guests: [
        {
          firstName: 'Sarah',
          lastName: 'Doe',
          email: 'sarah.doe@example.com',
          guestType: 'NAMED_GUEST'
        },
        {
          firstName: 'Plus One',
          lastName: 'Guest',
          guestType: 'PLUS_ONE'
        }
      ]
    },
    {
      // The Johnson Family - Friday and Saturday
      invitation: {
        invitationCode: 'JOHNSON001',
        invitedToFriday: true,
        invitedToSaturday: true,
        invitedToSunday: false
      },
      guests: [
        {
          firstName: 'Michael',
          lastName: 'Johnson',
          email: 'michael.johnson@example.com',
          guestType: 'NAMED_GUEST'
        },
        {
          firstName: 'Lisa',
          lastName: 'Johnson',
          email: 'lisa.johnson@example.com',
          guestType: 'NAMED_GUEST'
        }
      ]
    },
    {
      // Single guest - all events
      invitation: {
        invitationCode: 'WILSON001',
        invitedToFriday: true,
        invitedToSaturday: true,
        invitedToSunday: true
      },
      guests: [
        {
          firstName: 'Emily',
          lastName: 'Wilson',
          email: 'emily.wilson@example.com',
          phone: '555-0456',
          guestType: 'NAMED_GUEST'
        }
      ]
    }
  ]

  console.log('Creating family invitations...')

  for (const familyData of familyInvitations) {
    const invitation = await prisma.invitation.create({
      data: {
        ...familyData.invitation,
        guests: {
          create: familyData.guests
        }
      },
      include: {
        guests: true
      }
    })
    
    console.log(`Created invitation ${invitation.invitationCode} with ${invitation.guests.length} guests`)
  }

  // Get summary counts
  const totalInvitations = await prisma.invitation.count()
  const totalGuests = await prisma.guest.count()

  console.log(`\nSeed completed!`)
  console.log(`Total invitations: ${totalInvitations}`)
  console.log(`Total guests: ${totalGuests}`)
  
  console.log(`\nTo test the RSVP system, try these names:`)
  console.log(`- John Smith (family of 3, all events)`)
  console.log(`- Sarah Doe (2 guests, Saturday only)`)
  console.log(`- Michael Johnson (couple, Friday & Saturday)`)
  console.log(`- Emily Wilson (single guest, all events)`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })