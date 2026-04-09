import { AnimatePresence, motion } from 'framer-motion'
import { CreditCard, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { type Expense, expensesApi } from '@/lib/api'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type Frequence = Expense['frequence']

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
  const [categories] = useState<string[]>(defaultCategories)
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => { expensesApi.list().then(setExpenses).catch(console.error) }, [])
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

  const counts = useMemo(() => ({
    Mensuel: expenses.filter((e) => e.frequence === 'Mensuel').length,
    Annuel: expenses.filter((e) => e.frequence === 'Annuel').length,
    Ponctuel: expenses.filter((e) => e.frequence === 'Ponctuel').length,
  }), [expenses])

  async function handleAdd() {
    if (!form.nom.trim()) return
    const created = await expensesApi.create(form)
    setExpenses((prev) => [created, ...prev])
    setForm(emptyExpense)
    setShowAdd(false)
  }

  function openEdit(e: Expense) {
    const { id: _, ...rest } = e
    setForm(rest)
    setEditId(e.id)
  }

  async function handleEdit() {
    if (!editId || !form.nom.trim()) return
    const updated = await expensesApi.update(editId, form)
    setExpenses((prev) => prev.map((e) => e.id === editId ? updated : e))
    setForm(emptyExpense)
    setEditId(null)
  }

  function closeModal() {
    setShowAdd(false)
    setEditId(null)
    setForm(emptyExpense)
  }

  async function remove(id: string) {
    await expensesApi.remove(id)
    setExpenses((prev) => prev.filter((e) => e.id !== id))
    if (editId === id) closeModal()
  }

  return (
    <div className="mx-auto max-w-xl px-3 py-4 sm:px-4 sm:py-10">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between sm:mb-6">
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5">
            <CreditCard className="size-5 text-primary" />
          </div>
          <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-3xl">
            Dépenses
          </h1>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-primary sm:text-xs">
            {expenses.length}
          </span>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex h-8 items-center gap-1 rounded-lg bg-primary px-3 text-[11px] font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95 sm:h-9 sm:gap-1.5 sm:rounded-xl sm:px-4 sm:text-xs"
        >
          <Plus className="size-3.5 sm:size-4" />
          <span className="hidden sm:inline">Ajouter</span>
        </button>
      </div>

      {/* Totals banner — compact */}
      {expenses.length > 0 && (
        <div className="mb-4 overflow-hidden rounded-xl border border-red-500/15 bg-gradient-to-br from-red-500/8 via-red-500/4 to-transparent p-3 sm:mb-6 sm:rounded-2xl sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[9px] uppercase tracking-wide text-muted-foreground sm:text-[11px]">Charges mensuelles</p>
              <p className="font-display text-lg font-bold tabular-nums text-foreground sm:text-2xl">
                {fmt(totals.monthly)} <span className="text-xs text-muted-foreground sm:text-sm">€/mois</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-wide text-muted-foreground sm:text-[11px]">Annuel</p>
              <p className="text-base font-bold tabular-nums text-foreground/80 sm:text-xl">
                {fmt(totals.annual)} <span className="text-[10px] text-muted-foreground sm:text-xs">€</span>
              </p>
            </div>
          </div>
          {totals.ponctuel > 0 && (
            <div className="mt-2 border-t border-red-500/10 pt-2 text-[10px] text-muted-foreground sm:text-[11px]">
              Ponctuel : <span className="tabular-nums font-medium text-foreground/80">{fmt(totals.ponctuel)} €</span>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="mb-3 flex items-center gap-1 sm:mb-5">
        {(['Tous', 'Mensuel', 'Annuel', 'Ponctuel'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilterFreq(f)}
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all sm:px-3 sm:py-1.5 sm:text-xs',
              filterFreq === f
                ? 'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {f}
            {f !== 'Tous' && (
              <span className={cn(
                'tabular-nums text-[9px] sm:text-[10px]',
                filterFreq === f ? 'text-primary/70' : 'text-muted-foreground/60'
              )}>
                {counts[f]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Dense list */}
      {filtered.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-border/50 bg-card sm:rounded-2xl">
          {filtered.map((e, i) => (
            <motion.div
              key={e.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, height: 0 }}
              className={cn(i > 0 && 'border-t border-border/30')}
            >
              <div className="group px-3 py-2 sm:px-4 sm:py-3">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {/* Name */}
                  <span className="min-w-0 shrink truncate text-[13px] font-semibold text-foreground sm:text-[15px]">
                    {e.nom}
                  </span>

                  {/* Freq badge */}
                  <span className={cn(
                    'shrink-0 rounded-full border px-1.5 py-px text-[9px] font-medium sm:px-2 sm:py-0.5 sm:text-[10px]',
                    frequenceBadge[e.frequence]
                  )}>
                    {e.frequence}
                  </span>

                  {/* Category small */}
                  {e.categorie && (
                    <span className="hidden shrink-0 text-[10px] text-muted-foreground/50 sm:inline">
                      {e.categorie}
                    </span>
                  )}

                  <span className="flex-1" />

                  {/* Amount */}
                  <span className="shrink-0 text-[13px] font-bold tabular-nums text-foreground sm:text-[15px]">
                    {fmt(e.montant)}€
                  </span>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center">
                    <button
                      onClick={() => openEdit(e)}
                      className="rounded-lg p-1.5 text-muted-foreground/30 transition-all active:bg-muted active:text-primary sm:opacity-0 sm:group-hover:opacity-100"
                      aria-label="Modifier"
                    >
                      <Pencil className="size-3" />
                    </button>
                    <button
                      onClick={() => remove(e.id)}
                      className="rounded-lg p-1.5 text-muted-foreground/20 transition-all active:bg-destructive/10 active:text-destructive sm:opacity-0 sm:group-hover:opacity-100"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                </div>

                {/* Note small */}
                {e.note && (
                  <p className="mt-0.5 truncate text-[10px] text-muted-foreground/50 sm:text-[11px]">
                    {e.note}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-3xl bg-muted/50">
            <CreditCard className="size-7 text-muted-foreground/40" />
          </div>
          <p className="text-sm text-muted-foreground/60">
            {filterFreq !== 'Tous' ? 'Aucune dépense avec ce filtre.' : 'Ajoutez votre première dépense.'}
          </p>
        </div>
      )}

      {/* Footer total */}
      {filtered.length > 0 && (
        <div className="mt-2 flex items-center justify-between rounded-xl bg-muted/30 px-3 py-2.5 text-xs">
          <span className="text-muted-foreground">{filtered.length} dépense{filtered.length > 1 ? 's' : ''}</span>
          <span className="font-bold tabular-nums text-foreground">
            {fmt(filtered.reduce((s, e) => s + e.montant, 0))} €
          </span>
        </div>
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
              className="relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border/50 bg-card p-4 shadow-[var(--shadow-lg)] sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute right-3 top-3 rounded-xl p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Fermer"
              >
                <X className="size-4" />
              </button>
              <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
                {editId ? 'Modifier' : 'Nouvelle dépense'}
              </h2>

              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">Nom <span className="text-destructive">*</span></Label>
                  <input
                    value={form.nom}
                    onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
                    placeholder="Ex : OVH, Figma, Notion..."
                    className="h-9 w-full rounded-lg border border-border/60 bg-background px-3 text-sm outline-none transition-all placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Montant (€) <span className="text-destructive">*</span></Label>
                    <input
                      type="number"
                      value={form.montant || ''}
                      onChange={(e) => setForm((f) => ({ ...f, montant: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.00"
                      className="h-9 w-full rounded-lg border border-border/60 bg-background px-3 text-sm outline-none transition-all placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Fréquence</Label>
                    <select
                      value={form.frequence}
                      onChange={(e) => setForm((f) => ({ ...f, frequence: e.target.value as Frequence }))}
                      className="h-9 w-full rounded-lg border border-border/60 bg-background px-2 text-sm outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                    >
                      <option value="Mensuel">Mensuel</option>
                      <option value="Annuel">Annuel</option>
                      <option value="Ponctuel">Ponctuel</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">Catégorie</Label>
                  <select
                    value={form.categorie}
                    onChange={(e) => setForm((f) => ({ ...f, categorie: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/60 bg-background px-2 text-sm outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  >
                    <option value="">—</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">Note</Label>
                  <input
                    value={form.note}
                    onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                    placeholder="Optionnel..."
                    className="h-9 w-full rounded-lg border border-border/60 bg-background px-3 text-sm outline-none transition-all placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
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
                    {editId ? 'OK' : 'Ajouter'}
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
