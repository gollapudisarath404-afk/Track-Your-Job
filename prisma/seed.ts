import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const CATEGORIES = [
  'Electronics', 'Clothing', 'Books', 'Home & Garden',
  'Sports & Outdoors', 'Toys & Games', 'Beauty & Health',
  'Automotive', 'Food & Grocery', 'Office Supplies',
  'Pet Supplies', 'Tools & Hardware', 'Music', 'Movies', 'Garden'
]

const ADJECTIVES = ['Premium', 'Essential', 'Pro', 'Ultra', 'Classic', 'Smart', 'Compact', 'Deluxe', 'Elite', 'Standard']
const NOUNS = ['Widget', 'Gadget', 'Kit', 'Pack', 'Set', 'Bundle', 'Device', 'Tool', 'Item', 'Unit']

function randomProductName(idx: number): string {
  const adj = ADJECTIVES[idx % ADJECTIVES.length]
  const noun = NOUNS[Math.floor(idx / ADJECTIVES.length) % NOUNS.length]
  return `${adj} ${noun} ${idx + 1}`
}

async function main() {
  console.log('🌱 Seeding 200,000 products...')
  const TOTAL = 200_000
  const BATCH_SIZE = 2_000
  const batches = Math.ceil(TOTAL / BATCH_SIZE)

  for (let b = 0; b < batches; b++) {
    const rows = Array.from({ length: BATCH_SIZE }, (_, j) => {
      const idx = b * BATCH_SIZE + j
      if (idx >= TOTAL) return null
      const category = CATEGORIES[idx % CATEGORIES.length]
      const price = (Math.random() * 998 + 1).toFixed(2)
      const name = randomProductName(idx)
      // Spread created_at over past 2 years for realistic data
      const daysAgo = Math.floor(Math.random() * 730)
      const createdAt = new Date(Date.now() - daysAgo * 86_400_000).toISOString()
      return `('${name.replace(/'/g, "''")}', '${category}', ${price}, '${createdAt}'::timestamptz, '${createdAt}'::timestamptz)`
    }).filter(Boolean)

    await prisma.$executeRawUnsafe(`
      INSERT INTO "Product" (id, name, category, price, "createdAt", "updatedAt")
      SELECT gen_random_uuid(), name, category, price, created_at, updated_at
      FROM (VALUES ${rows.join(',')}) AS t(name, category, price, created_at, updated_at)
    `)

    if ((b + 1) % 10 === 0) {
      console.log(`  ✓ ${Math.min((b + 1) * BATCH_SIZE, TOTAL).toLocaleString()} / ${TOTAL.toLocaleString()}`)
    }
  }

  console.log('✅ Seeding complete.')
  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
