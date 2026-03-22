export type ContractStatus = 'Actif' | 'Suspendu' | 'Terminé'
export type ContractFrequency = 'Mensuel' | 'Ponctuel'

export type Contract = {
  id: string
  dirigeant: string
  entreprise: string
  dateDebut: string
  dateFin: string
  mail: string
  prestation: string
  montantHT: number
  frequence: ContractFrequency
  statut: ContractStatus
}

let nextId = 100

export function generateId() {
  return String(++nextId)
}

export const statusOrder: Record<ContractStatus, number> = {
  Actif: 0,
  Suspendu: 1,
  Terminé: 2,
}

export function parseDateFR(d: string): number {
  if (!d) return 0
  const parts = d.split('/')
  if (parts.length !== 3) return 0
  const [day, month, year] = parts
  return new Date(+year, +month - 1, +day).getTime()
}

export const defaultPrestations = [
  'SEO',
  'Maintenance web',
  'Maintenance web / SEO',
  'Site web',
  "Paiement de l'outil",
]

export const initialContracts: Contract[] = [
  // ── Actifs ──
  { id: '1', dirigeant: 'Damien Lambert', entreprise: 'Actimaine', dateDebut: '05/12/2024', dateFin: '05/06/2026', mail: 'contact@acti-maine.fr', prestation: 'SEO', montantHT: 480, frequence: 'Mensuel', statut: 'Actif' },
  { id: '2', dirigeant: 'Pierre Guillard', entreprise: 'Méréo', dateDebut: '05/10/2024', dateFin: '05/10/2025', mail: 'guiard.pierre@gmail.com', prestation: 'SEO', montantHT: 150, frequence: 'Mensuel', statut: 'Actif' },
  { id: '3', dirigeant: 'Adeline Babel', entreprise: 'COMIZI', dateDebut: '05/05/2025', dateFin: '05/05/2026', mail: 'ababel@comizi.fr', prestation: 'SEO', montantHT: 250, frequence: 'Mensuel', statut: 'Actif' },
  { id: '4', dirigeant: 'Julien Bidois', entreprise: 'Julien Bidois Chef', dateDebut: '05/04/2025', dateFin: '04/04/2026', mail: 'julienbidois8@gmail.com', prestation: 'SEO', montantHT: 250, frequence: 'Mensuel', statut: 'Actif' },
  { id: '5', dirigeant: 'Zidane Desbarres', entreprise: 'DP RENOV', dateDebut: '05/11/2024', dateFin: '05/07/2027', mail: 'desbarrephillippe@gmail.com', prestation: 'SEO', montantHT: 291.67, frequence: 'Mensuel', statut: 'Actif' },
  { id: '6', dirigeant: 'Philippe Paumier', entreprise: 'Ventsetcourbes', dateDebut: '05/04/2025', dateFin: '05/08/2026', mail: 'ventsetcourbes@gmail.com', prestation: 'SEO', montantHT: 316.67, frequence: 'Mensuel', statut: 'Actif' },
  { id: '7', dirigeant: 'David Botton', entreprise: 'Boat On Yacht Club', dateDebut: '05/04/2025', dateFin: '05/10/2026', mail: 'botton.david@gmail.com', prestation: 'Maintenance web / SEO', montantHT: 692.5, frequence: 'Mensuel', statut: 'Actif' },
  { id: '8', dirigeant: 'Clément Nignol', entreprise: 'STM BZH', dateDebut: '05/06/2025', dateFin: '05/10/2026', mail: 'clement.nignol@stm-bzh.fr', prestation: 'SEO', montantHT: 333.3, frequence: 'Mensuel', statut: 'Actif' },
  { id: '9', dirigeant: 'Edouard Suchet', entreprise: 'ES COMMUNICATION', dateDebut: '05/06/2025', dateFin: '05/06/2026', mail: 'edouard@es-solutions.fr', prestation: 'SEO', montantHT: 250, frequence: 'Mensuel', statut: 'Actif' },
  { id: '10', dirigeant: 'Julien Bidoit', entreprise: 'Chef Julien Bidois', dateDebut: '05/04/2025', dateFin: '05/04/2026', mail: 'julienbidois8@gmail.com', prestation: 'SEO', montantHT: 300, frequence: 'Mensuel', statut: 'Actif' },
  { id: '11', dirigeant: 'Mehrad', entreprise: 'Matineh Food', dateDebut: '05/11/2025', dateFin: '05/11/2026', mail: 'contact@matinehfood.com', prestation: 'SEO', montantHT: 300, frequence: 'Mensuel', statut: 'Actif' },
  { id: '14', dirigeant: 'Ibrahim', entreprise: 'Renov +', dateDebut: '05/01/2025', dateFin: '05/01/2026', mail: 'contact@sas-renovplus.com', prestation: 'SEO', montantHT: 500, frequence: 'Mensuel', statut: 'Actif' },
  { id: '15', dirigeant: 'Ibrahim', entreprise: 'Matcha', dateDebut: '05/01/2025', dateFin: '05/01/2026', mail: 'contact@sas-renovplus.com', prestation: 'SEO', montantHT: 500, frequence: 'Mensuel', statut: 'Actif' },
  { id: '16', dirigeant: 'SAS Elasto', entreprise: 'SAS Elasto', dateDebut: '05/01/2027', dateFin: '05/01/2028', mail: 'contact@saselasto.fr', prestation: 'SEO', montantHT: 350, frequence: 'Mensuel', statut: 'Actif' },
  { id: '17', dirigeant: 'Fauve Paris', entreprise: 'Fauve Paris', dateDebut: '05/01/2027', dateFin: '05/01/2028', mail: 'contact@fauveparis.fr', prestation: 'SEO', montantHT: 1800, frequence: 'Mensuel', statut: 'Actif' },
  { id: '18', dirigeant: 'Jade Lefeuvre', entreprise: 'Solatrack', dateDebut: '05/01/2027', dateFin: '05/01/2028', mail: 'sis.jadelefeuvre@gmail.com', prestation: 'Maintenance web', montantHT: 200, frequence: 'Mensuel', statut: 'Actif' },
  { id: '19', dirigeant: 'Jade Lefeuvre', entreprise: 'Solatrack', dateDebut: '05/01/2027', dateFin: '05/01/2028', mail: 'sis.jadelefeuvre@gmail.com', prestation: "Paiement de l'outil", montantHT: 1200, frequence: 'Mensuel', statut: 'Actif' },
  { id: '20', dirigeant: 'Bangkok', entreprise: 'Bangkok', dateDebut: '05/01/2025', dateFin: '05/01/2026', mail: 'contact@bangkok-restaurant.fr', prestation: 'SEO', montantHT: 400, frequence: 'Mensuel', statut: 'Actif' },
  { id: '21', dirigeant: 'Killian Tertrais', entreprise: 'Selfie Life', dateDebut: '05/01/2025', dateFin: '05/01/2026', mail: 'killian@selfielife.fr', prestation: 'SEO', montantHT: 300, frequence: 'Mensuel', statut: 'Actif' },

  // ── Suspendus ──
  { id: '12', dirigeant: 'Stéphane Hortelano', entreprise: 'Rennes Pneus', dateDebut: '05/04/2025', dateFin: '05/04/2026', mail: 'contact@rennespneus.fr', prestation: 'SEO', montantHT: 500, frequence: 'Mensuel', statut: 'Suspendu' },
  { id: '13', dirigeant: 'Ahmed', entreprise: 'AS Prestige', dateDebut: '05/07/2025', dateFin: '05/07/2026', mail: 'contact@asprestige.fr', prestation: 'SEO', montantHT: 500, frequence: 'Mensuel', statut: 'Suspendu' },

  // ── Terminés ──
  { id: '30', dirigeant: 'Benoît Planchon', entreprise: 'Happy Kite Surf', dateDebut: '05/11/2024', dateFin: '05/11/2025', mail: 'benoitplanchon@gmail.com', prestation: 'SEO', montantHT: 316.67, frequence: 'Mensuel', statut: 'Terminé' },
  { id: '31', dirigeant: 'Brad Mouche', entreprise: 'ECO HABITAT', dateDebut: '05/06/2025', dateFin: '05/06/2026', mail: 'ecohabitat44.contact@gmail.com', prestation: 'SEO', montantHT: 416.67, frequence: 'Mensuel', statut: 'Terminé' },
  { id: '32', dirigeant: 'Safak Evin', entreprise: 'LAS SIETTE', dateDebut: '05/07/2024', dateFin: '05/07/2025', mail: 'safak.evin@las-siette.fr', prestation: 'SEO', montantHT: 100, frequence: 'Mensuel', statut: 'Terminé' },
  { id: '33', dirigeant: 'Louise Lequipee', entreprise: 'EPICU', dateDebut: '05/04/2024', dateFin: '05/08/2025', mail: 'contact@epicu.fr', prestation: 'Site web', montantHT: 550, frequence: 'Mensuel', statut: 'Terminé' },
  { id: '34', dirigeant: 'William Claudi', entreprise: 'Protecttoit', dateDebut: '05/04/2024', dateFin: '05/04/2025', mail: 'protecttoit@gmail.com', prestation: 'SEO', montantHT: 400, frequence: 'Mensuel', statut: 'Terminé' },
  { id: '35', dirigeant: 'Gautier Lorgeoux', entreprise: 'Pépites', dateDebut: '05/05/2022', dateFin: '05/05/2025', mail: 'contact@pepites-lacave.com', prestation: 'SEO', montantHT: 455, frequence: 'Mensuel', statut: 'Terminé' },
  { id: '36', dirigeant: 'Camille', entreprise: 'Guest House Service', dateDebut: '05/07/2025', dateFin: '05/07/2026', mail: 'contact@guesthomeservice.fr', prestation: 'SEO', montantHT: 500, frequence: 'Mensuel', statut: 'Terminé' },
  { id: '37', dirigeant: 'Marc Suchet', entreprise: 'Mister Pool', dateDebut: '05/03/2025', dateFin: '05/09/2026', mail: 'info@mister-pool.fr', prestation: 'Maintenance web / SEO', montantHT: 1167, frequence: 'Mensuel', statut: 'Terminé' },
  { id: '38', dirigeant: 'Maxime Guillois', entreprise: 'Maxx Le Magicien', dateDebut: '05/12/2024', dateFin: '05/12/2025', mail: 'guilloismaxime@yahoo.fr', prestation: 'SEO', montantHT: 291.67, frequence: 'Mensuel', statut: 'Terminé' },
]
