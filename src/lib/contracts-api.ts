import type { Contract } from '@/data/contracts'

const BASE = '/api/contracts'

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`API ${res.status}: ${text || res.statusText}`)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export async function listContracts(): Promise<Contract[]> {
  return handle<Contract[]>(await fetch(BASE))
}

export async function createContract(data: Omit<Contract, 'id'>): Promise<Contract> {
  return handle<Contract>(
    await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  )
}

export async function updateContract(id: string, data: Omit<Contract, 'id'>): Promise<Contract> {
  return handle<Contract>(
    await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  )
}

export async function deleteContract(id: string): Promise<void> {
  await handle<void>(await fetch(`${BASE}/${id}`, { method: 'DELETE' }))
}
