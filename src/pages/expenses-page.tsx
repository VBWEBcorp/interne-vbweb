import { AnimatePresence, motion } from 'framer-motion'
import { CreditCard, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type Frequence = 'Mensuel' | 'Annuel' | 'Ponctuel'
type Expense = {
  id: string
  nom: string
  montant: number
  frequence: Frequence
  categorie: string
  note: string
}

let nid = 30
function uid() { return String(++nid) }

const defaultCategories = ['Hébergement', 'SaaS / Outils', 'Abonnement', 'Logiciel', 'Matériel', 'Autre']

const frequenceBadge: Record<Frequence, string> = {
  Mensuel: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
  Annuel: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  Ponctuel: 'bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 border-zinc-500/20',
}

function fmt(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function toMonthly(e: Expense): number {
  if (e.frequence === 'Mensuel') return e.montant
  if (e.frequence === 'Annuel') return e.montant / 12
  return 0
}

function toAnnual(e: Expense): number {
  if (e.frequence === 'Annuel') return e.montant
  if (e.frequence === 'Mensuel') return e.montant * 12
  return e.montant
}

const emptyExpense: Omit<Expense, 'id'> = {
  nom: '',
  montant: 0,
  frequence: 'Mensuel',
  categorie: '',
  note: '',
}

export function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<string[]>(defaultCategories)
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyExpense)
  const [filterFreq, setFilterFreq] = useState<Frequence | 'Tous'>('Tous')

  const filtered = useMemo(() => {
    if (filterFreq === 'Tous') return expenses
    return expenses.filter((e) => e.frequence === filterFreq)
  }, [expenses, filterFreq])

  const totals = useMemo(() => {
    const monthly = expenses.reduce((sum, e) => sum + toMonthly(e), 0)
    const annual = expenses.reduce((sum, e) => sum + toAnnual(e), 0)
    const ponctuel = expenses.filter((e) => e.frequence === 'Ponctuel').reduce((sum, e) => sum + e.montant, 0)
    return { monthly, annual, ponctuel }
  }, [expenses])

  function handleAdd() {
    if (!form.nom.trim()) return
    setExpenses((prev) => [{ ...form, id: uid() }, ...prev])
    setForm(emptyExpense)
    setShowAdd(false)
  }

  function openEdit(e: Expense) {
    const { id: _, ...rest } = e
    setForm(rest)
    setEditId(e.id)
  }

  function handleEdit() {
    if (!editId || !form.nom.trim()) return
    setExpenses((prev) => prev.map((e) => e.id === editId ? { ...form, id: editId } : e))
    setForm(emptyExpense)
    setEditId(null)
  }

  function closeModal() {
    setShowAdd(false)
    setEditId(null)
    setForm(emptyExpense)
  }

  function remove(id: string) {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
    if (editId === id) closeModal()
  }

  const byCategory = useMemo(() => {
    const map = new Map<string, Expense[]>()
    for (const e of filtered) {
      const cat = e.categorie || 'Sans catégorie'
      if (!map.has(cat)) map.set(cat, [])
      map.get(cat)!.push(e)
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b, 'fr'))
  }, [filtered])

  return (
    <div className="mx-auto max-w-xl px-4 py-6 sm:py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-1 flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5">
            <CreditCard className="size-5 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Dépenses
          </h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {expenses.length} dépense{expenses.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* KPI */}
      {expenses.length > 0 && (
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-[var(--shadow-xs)]">
            <p className="text-[11px] text-muted-foreground">Mensuel</p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">{fmt(totals.monthly)} €</p>
          </div>
          <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-[var(--shadow-xs)]">
            <p className="text-[11px] text-muted-foreground">Annuel</p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">{fmt(totals.annual)} €</p>
          </div>
          {totals.ponctuel > 0 && (
            <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-[var(--shadow-xs)]">
              <p className="text-[11px] text-muted-foreground">Ponctuel</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">{fmt(totals.ponctuel)} €</p>
            </div>
          )}
        </div>
      )}

      {/* Actions + filters */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {(['Tous', 'Mensuel', 'Annuel', 'Ponctuel'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilterFreq(f)}
              className={cn(
                'inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                filterFreq === f
                  ? 'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex h-9 items-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95"
        >
          <Plus className="size-4" />
          <span className="hidden sm:inline">Ajouter</span>
        </button>
      </div>

      {/* List by category */}
      {byCategory.length > 0 ? (
        <div className="space-y-6">
          {byCategory.map(([cat, items]) => {
            const catTotal = items.reduce((sum, e) => sum + toMonthly(e), 0)
            return (
              <div key={cat}>
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">{cat}</span>
                  <span className="text-[11px] tabular-nums text-muted-foreground/60">{fmt(catTotal)} €/mois</span>
                </div>
                <div className="space-y-2">
                  <AnimatePresence initial={false}>
                    {items.map((e) => (
                      <motion.div
                        key={e.id}
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, height: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="group rounded-2xl border border-border/50 bg-card px-4 py-3.5 shadow-[var(--shadow-xs)] transition-all hover:border-border hover:shadow-[var(--shadow-sm)] sm:px-5 sm:py-4">
                          <div className="flex items-center gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="truncate text-[15px] font-medium text-foreground">{e.nom}</p>
                                <span className={cn(
                                  'shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium',
                                  frequenceBadge[e.frequence]
                                )}>
                                  {e.frequence}
                                </span>
                              </div>
                              {e.note && <p className="mt-0.5 truncate text-xs text-muted-foreground/60">{e.note}</p>}
                            </div>
                            <p className="shrink-0 text-[15px] font-semibold tabular-nums text-foreground">
                              {fmt(e.montant)} €
                            </p>
                            <div className="flex items-center gap-0.5">
                              <button
                                onClick={() => openEdit(e)}
                                className="shrink-0 rounded-xl p-2 text-muted-foreground/40 transition-all hover:bg-muted hover:text-primary active:scale-90 sm:opacity-0 sm:group-hover:opacity-100"
                              >
                                <Pencil className="size-3.5" />
                              </button>
                              <button
                                onClick={() => remove(e.id)}
                                className="shrink-0 rounded-xl p-2 text-muted-foreground/30 transition-all hover:bg-destructive/10 hover:text-destructive active:scale-90 sm:opacity-0 sm:group-hover:opacity-100"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3 py-16 text-center"
        >
          <div className="flex size-14 items-center justify-center rounded-3xl bg-muted/50">
            <CreditCard className="size-7 text-muted-foreground/40" />
          </div>
          <p className="text-sm text-muted-foreground/60">
            {filterFreq !== 'Tous' ? 'Aucune dépense avec ce filtre.' : 'Ajoutez votre première dépense.'}
          </p>
        </motion.div>
      )}

      {/* Add / Edit modal */}
      <AnimatePresence>
        {(showAdd || editId) && (
          <Overlay onClose={closeModal}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border/50 bg-card p-5 shadow-[var(--shadow-lg)] sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute right-3 top-3 rounded-xl p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Fermer"
              >
                <X className="size-4" />
              </button>
              <h2 className="mb-5 font-display text-lg font-semibold text-foreground">
                {editId ? 'Modifier la dépense' : 'Nouvelle dépense'}
              </h2>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Nom <span className="text-destructive">*</span></Label>
                  <input
                    value={form.nom}
                    onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
                    placeholder="Ex : OVH, Figma, Notion..."
                    className="h-10 w-full rounded-xl border border-border/60 bg-background px-4 text-sm outline-none transition-all placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Montant (€) <span className="text-destructive">*</span></Label>
                    <input
                      type="number"
                      value={form.montant || ''}
                      onChange={(e) => setForm((f) => ({ ...f, montant: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.00"
                      className="h-10 w-full rounded-xl border border-border/60 bg-background px-4 text-sm outline-none transition-all placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Fréquence</Label>
                    <select
                      value={form.frequence}
                      onChange={(e) => setForm((f) => ({ ...f, frequence: e.target.value as Frequence }))}
                      className="h-10 w-full rounded-xl border border-border/60 bg-background px-3 text-sm outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                    >
                      <option value="Mensuel">Mensuel</option>
                      <option value="Annuel">Annuel</option>
                      <option value="Ponctuel">Ponctuel</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Catégorie</Label>
                  <select
                    value={form.categorie}
                    onChange={(e) => setForm((f) => ({ ...f, categorie: e.target.value }))}
                    className="h-10 w-full rounded-xl border border-border/60 bg-background px-3 text-sm outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  >
                    <option value="">— Choisir —</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Note</Label>
                  <input
                    value={form.note}
                    onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                    placeholder="Optionnel..."
                    className="h-10 w-full rounded-xl border border-border/60 bg-background px-4 text-sm outline-none transition-all placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                {editId ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(editId)}
                  >
                    <Trash2 className="size-3.5" data-icon="inline-start" />
                    Supprimer
                  </Button>
                ) : <div />}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={closeModal}>Annuler</Button>
                  <Button size="sm" onClick={editId ? handleEdit : handleAdd} disabled={!form.nom.trim() || !form.montant}>
                    {editId ? 'Enregistrer' : 'Ajouter'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </Overlay>
        )}
      </AnimatePresence>
    </div>
  )
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      {children}
    </motion.div>
  )
}
