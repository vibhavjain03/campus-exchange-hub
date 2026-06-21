import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/college_mp?schema=public'
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const categories = [
    {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Phones, laptops, chargers, headphones, and other gadget gear.'
    },
    {
      name: 'Textbooks & Course Materials',
      slug: 'textbooks',
      description: 'Required course textbooks, lab manuals, and notes.'
    },
    {
      name: 'Dorm Essentials',
      slug: 'dorm-essentials',
      description: 'Mini-fridges, mirrors, storage, rugs, and room lighting.'
    },
    {
      name: 'Clothing & Apparel',
      slug: 'clothing',
      description: 'Gently used clothes, shoes, and winter jackets.'
    },
    {
      name: 'Sports & Outdoors',
      slug: 'sports-outdoors',
      description: 'Bicycles, gym equipment, skateboards, and outdoor gear.'
    },
    {
      name: 'Miscellaneous',
      slug: 'misc',
      description: 'Other items that do not fit into core categories.'
    }
  ]

  console.log('Starting category database seeding...')
  for (const cat of categories) {
    const upserted = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: cat
    })
    console.log(`Upserted category: ${upserted.name} (${upserted.slug})`)
  }
  console.log('Seeding finished successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
  .catch(async (e) => {
    console.error('Error during seeding:', e)
    await prisma.$disconnect()
    await pool.end()
    process.exit(1)
  })
