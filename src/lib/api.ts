/* Generic API helper for all collections */

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`API ${res.status}: ${text || res.statusText}`)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

function crudApi<T extends { id: string }>(base: string) {
  return {
    async list(): Promise<T[]> {
      return handle<T[]>(await fetch(base))
    },
    async create(data: Omit<T, 'id'>): Promise<T> {
      return handle<T>(
        await fetch(base, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }),
      )
    },
    async update(id: string, data: Omit<T, 'id'>): Promise<T> {
      return handle<T>(
        await fetch(`${base}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }),
      )
    },
    async remove(id: string): Promise<void> {
      await handle<void>(await fetch(`${base}/${id}`, { method: 'DELETE' }))
    },
  }
}

/* ─── Types ─── */

export type Lead = {
  id: string
  nom: string
  note: string
  archived: boolean
}

export type StaffMember = {
  id: string
  nom: string
  fonction: string
  tarif: string
  note: string
  type: string
}

export type ContactColor = 'vert' | 'orange' | 'gris'

export type Contact = {
  id: string
  nom: string
  entreprise: string
  couleur: ContactColor
}

export type Expense = {
  id: string
  nom: string
  montant: number
  frequence: 'Mensuel' | 'Annuel' | 'Ponctuel'
  categorie: string
  note: string
}

export type Todo = {
  id: string
  text: string
  done: boolean
  priority: 'normal' | 'prioritaire'
}

/* ─── API instances ─── */

export const leadsApi = crudApi<Lead>('/api/leads')
export const staffApi = crudApi<StaffMember>('/api/staff')
export const contactsApi = crudApi<Contact>('/api/contacts')
export const expensesApi = crudApi<Expense>('/api/expenses')
export const todosApi = crudApi<Todo>('/api/todos')
