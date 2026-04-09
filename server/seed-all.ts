import 'dotenv/config'

import { MongoClient } from 'mongodb'

const { MONGODB_URI, MONGODB_DB = 'vbweb' } = process.env

if (!MONGODB_URI) {
  console.error('[seed] MONGODB_URI is missing in .env')
  process.exit(1)
}

const leads = [
  { nom: 'Solatrack', note: 'OK mais attendre encore', archived: false },
  { nom: 'Céramique Gaëlle', note: 'ça sent le KO', archived: false },
  { nom: 'Milla x 2', note: '', archived: false },
  { nom: 'Édouard x 1', note: '', archived: false },
  { nom: 'Saint Martin x 1', note: '', archived: false },
  { nom: 'Aurore', note: '', archived: false },
  { nom: 'Cousin Zidane', note: '', archived: false },
  { nom: 'Nathan e-commerce', note: '', archived: false },
  { nom: 'Melissa', note: 'OK', archived: false },
  { nom: 'Bisous Tatoo', note: '', archived: false },
  { nom: 'Roazon Bière', note: '', archived: false },
  { nom: 'Salomé Carte', note: '', archived: false },
  { nom: 'Myriam SEO', note: '', archived: false },
  { nom: 'Matineh Food', note: 'OK', archived: false },
  { nom: 'Benoît Local', note: 'OK', archived: false },
  { nom: 'Actimaine Refonte', note: 'OK', archived: false },
  { nom: 'Hill Carrelage', note: 'ça sent le KO', archived: false },
  { nom: 'Pote Evan', note: '', archived: false },
  { nom: 'Massage', note: 'EN ATTENTE Octobre', archived: false },
  { nom: 'Ibrahim', note: 'PAS DE REP', archived: false },
  { nom: 'François Ortho', note: 'OK', archived: false },
  { nom: 'Benoît Nouvel Engagement', note: 'OK', archived: false },
]

const staff = [
  { nom: 'Webia', fonction: 'SEO', tarif: '', note: 'Serieux + équipe quali', type: 'Structuré' },
  { nom: 'WeonWeb', fonction: 'SEO', tarif: '400€ one shot / après 200€/mois', note: 'Qualité en SEO — Moyen, pas vraiment agence', type: 'Agence' },
  { nom: 'Tom Adan', fonction: 'SEO', tarif: '350€ one shot / après 50€/mois', note: 'Qualité SEO', type: 'Freelance' },
  { nom: 'Neha Verma', fonction: 'SEO', tarif: '200–300€ mensuel', note: 'Qualité SEO — Agence solide mais indienne, galère', type: 'Agence' },
  { nom: 'Hai Agency', fonction: 'SEO', tarif: '4€/h · 32€/jour · 640€/mois', note: 'Moyen', type: 'Agence' },
  { nom: 'Youtarget', fonction: 'SEO', tarif: '', note: 'Pas mal', type: 'Agence' },
  { nom: 'Rafandeferana Maminiaina', fonction: 'Dev', tarif: '90€/semaine', note: 'À tester', type: 'Freelance' },
  { nom: 'Claudio', fonction: 'Dev', tarif: '8€/h', note: 'Serieux', type: 'Freelance' },
  { nom: 'Mbola', fonction: 'Dev', tarif: '50€/site', note: 'Très moyen', type: 'Freelance' },
]

async function main() {
  const client = new MongoClient(MONGODB_URI!)
  await client.connect()
  const db = client.db(MONGODB_DB)

  // Seed leads
  const leadsCol = db.collection('leads')
  const existingLeads = await leadsCol.countDocuments()
  if (existingLeads === 0) {
    const result = await leadsCol.insertMany(leads)
    console.log(`[seed] inserted ${result.insertedCount} leads`)
  } else {
    console.log(`[seed] leads already has ${existingLeads} docs — skipping`)
  }

  // Seed staff
  const staffCol = db.collection('staff')
  const existingStaff = await staffCol.countDocuments()
  if (existingStaff === 0) {
    const result = await staffCol.insertMany(staff)
    console.log(`[seed] inserted ${result.insertedCount} staff`)
  } else {
    console.log(`[seed] staff already has ${existingStaff} docs — skipping`)
  }

  await client.close()
}

main().catch((err) => {
  console.error('[seed] fatal', err)
  process.exit(1)
})
