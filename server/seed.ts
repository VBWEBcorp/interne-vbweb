import 'dotenv/config'

import { MongoClient } from 'mongodb'

import { initialContracts } from '../src/data/contracts'

const { MONGODB_URI, MONGODB_DB = 'vbweb' } = process.env

if (!MONGODB_URI) {
  console.error('[seed] MONGODB_URI is missing in .env')
  process.exit(1)
}

async function main() {
  const client = new MongoClient(MONGODB_URI!)
  await client.connect()
  const db = client.db(MONGODB_DB)
  const col = db.collection('contracts')

  const existing = await col.countDocuments()
  if (existing > 0) {
    console.log(`[seed] collection already has ${existing} docs — skipping`)
    await client.close()
    return
  }

  const docs = initialContracts.map(({ id: _id, ...rest }) => rest)
  const result = await col.insertMany(docs)
  console.log(`[seed] inserted ${result.insertedCount} contracts`)
  await client.close()
}

main().catch((err) => {
  console.error('[seed] fatal', err)
  process.exit(1)
})
