import { MongoClient, ObjectId, type Db } from 'mongodb'

const { MONGODB_URI, MONGODB_DB = 'VBWEB' } = process.env

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

async function getDb(): Promise<Db> {
  if (cachedDb) return cachedDb
  if (!MONGODB_URI) throw new Error('MONGODB_URI missing')
  cachedClient = new MongoClient(MONGODB_URI)
  await cachedClient.connect()
  cachedDb = cachedClient.db(MONGODB_DB)
  return cachedDb
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toDTO(doc: any) {
  const { _id, ...rest } = doc
  return { id: _id.toHexString(), ...rest }
}

/* ─── Sanitizers ─── */

const sanitizers: Record<string, (body: unknown) => Record<string, unknown>> = {
  contracts(body: unknown) {
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
        ? String(b.statut) : 'Actif',
    }
  },
  leads(body: unknown) {
    const b = (body ?? {}) as Record<string, unknown>
    return { nom: String(b.nom ?? ''), note: String(b.note ?? ''), archived: Boolean(b.archived) }
  },
  staff(body: unknown) {
    const b = (body ?? {}) as Record<string, unknown>
    return {
      nom: String(b.nom ?? ''), fonction: String(b.fonction ?? ''),
      tarif: String(b.tarif ?? ''), note: String(b.note ?? ''), type: String(b.type ?? ''),
    }
  },
  contacts(body: unknown) {
    const b = (body ?? {}) as Record<string, unknown>
    return {
      nom: String(b.nom ?? ''), entreprise: String(b.entreprise ?? ''),
      couleur: ['vert', 'orange', 'gris'].includes(String(b.couleur)) ? String(b.couleur) : 'gris',
    }
  },
  expenses(body: unknown) {
    const b = (body ?? {}) as Record<string, unknown>
    return {
      nom: String(b.nom ?? ''), montant: Number(b.montant ?? 0),
      frequence: ['Mensuel', 'Annuel', 'Ponctuel'].includes(String(b.frequence)) ? String(b.frequence) : 'Mensuel',
      categorie: String(b.categorie ?? ''), note: String(b.note ?? ''),
    }
  },
  todos(body: unknown) {
    const b = (body ?? {}) as Record<string, unknown>
    return {
      text: String(b.text ?? ''), done: Boolean(b.done),
      priority: b.priority === 'prioritaire' ? 'prioritaire' : 'normal',
    }
  },
}

const RESOURCES = Object.keys(sanitizers)

function json(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(body),
  }
}

export async function handler(event: { path: string; httpMethod: string; body?: string | null }) {
  const { httpMethod } = event

  // CORS preflight
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    }
  }

  // Parse path: /api/{resource} or /api/{resource}/{id}
  const match = event.path.match(/\/api\/([a-z]+)(?:\/([a-f0-9]{24}))?$/)
  if (!match) return json(404, { error: 'not found' })

  const resource = match[1]
  const id = match[2]

  if (!RESOURCES.includes(resource)) return json(404, { error: 'unknown resource' })

  const sanitize = sanitizers[resource]

  try {
    const db = await getDb()
    const col = db.collection(resource)

    // GET /api/{resource} — list all
    if (httpMethod === 'GET' && !id) {
      const docs = await col.find({}).toArray()
      return json(200, docs.map(toDTO))
    }

    // POST /api/{resource} — create
    if (httpMethod === 'POST' && !id) {
      const data = sanitize(JSON.parse(event.body || '{}'))
      const result = await col.insertOne(data)
      return json(201, toDTO({ _id: result.insertedId, ...data }))
    }

    // PUT /api/{resource}/{id} — update
    if (httpMethod === 'PUT' && id) {
      if (!ObjectId.isValid(id)) return json(400, { error: 'invalid id' })
      const data = sanitize(JSON.parse(event.body || '{}'))
      const result = await col.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: data },
        { returnDocument: 'after' },
      )
      if (!result) return json(404, { error: 'not found' })
      return json(200, toDTO(result))
    }

    // DELETE /api/{resource}/{id} — delete
    if (httpMethod === 'DELETE' && id) {
      if (!ObjectId.isValid(id)) return json(400, { error: 'invalid id' })
      const result = await col.deleteOne({ _id: new ObjectId(id) })
      if (result.deletedCount === 0) return json(404, { error: 'not found' })
      return { statusCode: 204, body: '' }
    }

    return json(405, { error: 'method not allowed' })
  } catch (err) {
    console.error(err)
    return json(500, { error: 'server error' })
  }
}
