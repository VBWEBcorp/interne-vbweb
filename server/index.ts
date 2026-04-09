import 'dotenv/config'

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import cors from 'cors'
import express, { type Express } from 'express'
import { MongoClient, ObjectId, type Db } from 'mongodb'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const { MONGODB_URI, MONGODB_DB = 'vbweb', PORT = '5174' } = process.env

if (!MONGODB_URI) {
  console.error('[server] MONGODB_URI is missing in .env')
  process.exit(1)
}

/* ─── Helpers ─── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toDTO(doc: any) {
  const { _id, ...rest } = doc
  return { id: _id.toHexString(), ...rest }
}

/** Register generic CRUD routes: GET, POST, PUT, DELETE on /api/:resource */
function crud(
  app: Express,
  db: Db,
  resource: string,
  sanitize: (body: unknown) => Record<string, unknown>,
) {
  const col = db.collection(resource)
  const base = `/api/${resource}`

  app.get(base, async (_req, res) => {
    try {
      const docs = await col.find({}).toArray()
      res.json(docs.map(toDTO))
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: `failed to list ${resource}` })
    }
  })

  app.post(base, async (req, res) => {
    try {
      const data = sanitize(req.body)
      const result = await col.insertOne(data)
      res.status(201).json(toDTO({ _id: result.insertedId, ...data }))
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: `failed to create ${resource}` })
    }
  })

  app.put(`${base}/:id`, async (req, res) => {
    try {
      if (!ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'invalid id' })
      const _id = new ObjectId(req.params.id)
      const data = sanitize(req.body)
      const result = await col.findOneAndUpdate({ _id }, { $set: data }, { returnDocument: 'after' })
      if (!result) return res.status(404).json({ error: 'not found' })
      res.json(toDTO(result))
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: `failed to update ${resource}` })
    }
  })

  app.delete(`${base}/:id`, async (req, res) => {
    try {
      if (!ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'invalid id' })
      const _id = new ObjectId(req.params.id)
      const result = await col.deleteOne({ _id })
      if (result.deletedCount === 0) return res.status(404).json({ error: 'not found' })
      res.status(204).end()
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: `failed to delete ${resource}` })
    }
  })
}

/* ─── Sanitizers ─── */

function sanitizeContract(body: unknown) {
  const b = (body ?? {}) as Record<string, unknown>
  return {
    dirigeant: String(b.dirigeant ?? ''),
    entreprise: String(b.entreprise ?? ''),
    dateDebut: String(b.dateDebut ?? ''),
    dateFin: String(b.dateFin ?? ''),
    mail: String(b.mail ?? ''),
    prestation: String(b.prestation ?? ''),
    montantHT: Number(b.montantHT ?? 0),
    frequence: b.frequence === 'Ponctuel' ? 'Ponctuel' : 'Mensuel',
    statut: ['Actif', 'Suspendu', 'Terminé'].includes(String(b.statut))
      ? String(b.statut)
      : 'Actif',
  }
}

function sanitizeLead(body: unknown) {
  const b = (body ?? {}) as Record<string, unknown>
  return {
    nom: String(b.nom ?? ''),
    note: String(b.note ?? ''),
    archived: Boolean(b.archived),
  }
}

function sanitizeStaff(body: unknown) {
  const b = (body ?? {}) as Record<string, unknown>
  return {
    nom: String(b.nom ?? ''),
    fonction: String(b.fonction ?? ''),
    tarif: String(b.tarif ?? ''),
    note: String(b.note ?? ''),
    type: String(b.type ?? ''),
  }
}

function sanitizeContact(body: unknown) {
  const b = (body ?? {}) as Record<string, unknown>
  return {
    nom: String(b.nom ?? ''),
    entreprise: String(b.entreprise ?? ''),
    couleur: ['vert', 'orange', 'gris'].includes(String(b.couleur))
      ? String(b.couleur)
      : 'gris',
  }
}

function sanitizeExpense(body: unknown) {
  const b = (body ?? {}) as Record<string, unknown>
  return {
    nom: String(b.nom ?? ''),
    montant: Number(b.montant ?? 0),
    frequence: ['Mensuel', 'Annuel', 'Ponctuel'].includes(String(b.frequence))
      ? String(b.frequence)
      : 'Mensuel',
    categorie: String(b.categorie ?? ''),
    note: String(b.note ?? ''),
  }
}

function sanitizeTodo(body: unknown) {
  const b = (body ?? {}) as Record<string, unknown>
  return {
    text: String(b.text ?? ''),
    done: Boolean(b.done),
    priority: b.priority === 'prioritaire' ? 'prioritaire' : 'normal',
  }
}

/* ─── Main ─── */

async function main() {
  const client = new MongoClient(MONGODB_URI!)
  await client.connect()
  console.log('[server] connected to MongoDB')

  const db: Db = client.db(MONGODB_DB)

  const app = express()
  app.use(cors())
  app.use(express.json())

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, db: MONGODB_DB })
  })

  // Register CRUD for all collections
  crud(app, db, 'contracts', sanitizeContract)
  crud(app, db, 'leads', sanitizeLead)
  crud(app, db, 'staff', sanitizeStaff)
  crud(app, db, 'contacts', sanitizeContact)
  crud(app, db, 'expenses', sanitizeExpense)
  crud(app, db, 'todos', sanitizeTodo)

  // In production: serve the built frontend
  const distPath = path.resolve(__dirname, '../dist')
  app.use(express.static(distPath))
  app.get('/{*path}', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })

  const port = Number(PORT)
  app.listen(port, () => {
    console.log(`[server] listening on http://localhost:${port}`)
  })
}

main().catch((err) => {
  console.error('[server] fatal', err)
  process.exit(1)
})
