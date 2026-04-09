import { AnimatePresence, motion } from 'framer-motion'
import { Pencil, Plus, Settings2, Trash2, UserCircle, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { type StaffMember as Member, staffApi } from '@/lib/api'
import { cn } from '@/lib/utils'

const defaultFonctions = ['Admin', 'SEO', 'Dev']
const defaultTypes = ['Agence', 'Freelance', 'Structuré']

const badgeColor: Record<string, string> = {
  Admin: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
  SEO: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  Dev: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
}

function pickBadge(fonction: string) {
  return badgeColor[fonction] || 'bg-muted text-muted-foreground border-border/50'
}

const typeBadge: Record<string, string> = {
  Agence: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
  Freelance: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
  Structuré: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
}

function pickTypeBadge(type: string) {
  return typeBadge[type] || 'bg-muted text-muted-foreground border-border/50'
}

type Filter = 'Tous' | string

export function StaffPage() {
  const [members, setMembers] = useState<Member[]>([])

  useEffect(() => { staffApi.list().then(setMembers).catch(console.error) }, [])
  const [fonctions, setFonctions] = useState<string[]>(defaultFonctions)
  const [filter, setFilter] = useState<Filter>('Tous')
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Member, 'id'>>({ nom: '', fonction: '', tarif: '', note: '', type: '' })
  const [showFonctions, setShowFonctions] = useState(false)
  const [newFonction, setNewFonction] = useState('')

  const filtered = useMemo(() => {
    if (filter === 'Tous') return members
    return members.filter((m) => m.fonction === filter)
  }, [members, filter])

  const counts = useMemo(() => {
    const map: Record<string, number> = {}
    fonctions.forEach((f) => { map[f] = members.filter((m) => m.fonction === f).length })
    return map
  }, [members, fonctions])

  async function add() {
    if (!form.nom.trim() || !form.fonction) return
    const created = await staffApi.create({ ...form, nom: form.nom.trim() })
    setMembers((prev) => [created, ...prev])
    setForm({ nom: '', fonction: '', tarif: '', note: '', type: '' })
    setShowAdd(false)
  }

  function openEdit(m: Member) {
    const { id: _, ...rest } = m
    setForm(rest)
    setEditId(m.id)
  }

  async function saveEdit() {
    if (!editId || !form.nom.trim() || !form.fonction) return
    const updated = await staffApi.update(editId, { ...form, nom: form.nom.trim() })
    setMembers((prev) => prev.map((m) => m.id === editId ? updated : m))
    setForm({ nom: '', fonction: '', tarif: '', note: '', type: '' })
    setEditId(null)
  }

  function closeModal() {
    setShowAdd(false)
    setEditId(null)
    setForm({ nom: '', fonction: '', tarif: '', note: '', type: '' })
  }

  async function remove(id: string) {
    await staffApi.remove(id)
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  function addFonction() {
    const name = newFonction.trim()
    if (!name || fonctions.includes(name)) return
    setFonctions((prev) => [...prev, name])
    setNewFonction('')
  }

  function removeFonction(name: string) {
    setFonctions((prev) => prev.filter((f) => f !== name))
  }

  return (
    <div className="mx-auto max-w-xl px-3 py-4 sm:px-4 sm:py-10">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between sm:mb-6">
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5">
            <UserCircle className="size-5 text-primary" />
          </div>
          <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-3xl">
            Staff
          </h1>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-primary sm:text-xs">
            {members.length}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowFonctions(true)}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:size-9"
            title="Gérer les fonctions"
          >
            <Settings2 className="size-4" />
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="flex h-8 items-center gap-1 rounded-lg bg-primary px-3 text-[11px] font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95 sm:h-9 sm:gap-1.5 sm:rounded-xl sm:px-4 sm:text-xs"
          >
            <Plus className="size-3.5 sm:size-4" />
            <span className="hidden sm:inline">Ajouter</span>
          </button>
        </div>
      </div>

      {/* Category filters — stickers */}
      <div className="mb-3 flex items-center gap-1 sm:mb-5">
        <button
          onClick={() => setFilter('Tous')}
          className={cn(
            'rounded-full px-2.5 py-1 text-[11px] font-medium transition-all sm:px-3 sm:py-1.5 sm:text-xs',
            filter === 'Tous'
              ? 'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          Tous <span className="tabular-nums text-[9px] sm:text-[10px]">{members.length}</span>
        </button>
        {fonctions.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all sm:px-3 sm:py-1.5 sm:text-xs',
              filter === f
                ? cn(pickBadge(f), 'shadow-sm ring-1 ring-current/10')
                : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {f}
            <span className="tabular-nums text-[9px] sm:text-[10px]">{counts[f] || 0}</span>
          </button>
        ))}
      </div>

      {/* Dense list */}
      {filtered.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-border/50 bg-card sm:rounded-2xl">
          {filtered.map((m, i) => (
            <motion.div
              key={m.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, height: 0 }}
              className={cn(i > 0 && 'border-t border-border/30')}
            >
              <div className="group px-3 py-2 sm:px-4 sm:py-3">
                {/* Row 1: name + badges + actions */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="min-w-0 shrink truncate text-[13px] font-semibold text-foreground sm:text-[15px]">
                    {m.nom}
                  </span>

                  {/* Badges inline */}
                  <span className={cn(
                    'shrink-0 rounded-full border px-1.5 py-px text-[9px] font-medium sm:px-2 sm:py-0.5 sm:text-[10px]',
                    pickBadge(m.fonction)
                  )}>
                    {m.fonction}
                  </span>
                  {m.type && (
                    <span className={cn(
                      'hidden shrink-0 rounded-full border px-1.5 py-px text-[9px] font-medium sm:inline-flex sm:px-2 sm:py-0.5 sm:text-[10px]',
                      pickTypeBadge(m.type)
                    )}>
                      {m.type}
                    </span>
                  )}

                  <span className="flex-1" />

                  {/* Tarif compact */}
                  {m.tarif && (
                    <span className="shrink-0 text-[10px] font-medium tabular-nums text-foreground/60 sm:text-[11px]">
                      {m.tarif}
                    </span>
                  )}

                  <div className="flex shrink-0 items-center">
                    <button
                      onClick={() => openEdit(m)}
                      className="rounded-lg p-1.5 text-muted-foreground/30 transition-all active:bg-muted active:text-primary sm:opacity-0 sm:group-hover:opacity-100"
                      aria-label="Modifier"
                    >
                      <Pencil className="size-3" />
                    </button>
                    <button
                      onClick={() => remove(m.id)}
                      className="rounded-lg p-1.5 text-muted-foreground/20 transition-all active:bg-destructive/10 active:text-destructive sm:opacity-0 sm:group-hover:opacity-100"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                </div>

                {/* Row 2: note (small) */}
                {m.note && (
                  <p className="mt-0.5 truncate text-[10px] text-muted-foreground/50 sm:text-[11px]">
                    {m.note}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-3xl bg-muted/50">
            <UserCircle className="size-7 text-muted-foreground/40" />
          </div>
          <p className="text-sm text-muted-foreground/60">
            {filter !== 'Tous' ? `Aucun membre ${filter}.` : 'Ajoutez votre premier membre.'}
          </p>
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
                {editId ? 'Modifier' : 'Nouveau membre'}
              </h2>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground">Nom <span className="text-destructive">*</span></label>
                  <input
                    value={form.nom}
                    onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
                    placeholder="Nom..."
                    className="h-9 w-full rounded-lg border border-border/60 bg-background px-3 text-sm outline-none transition-all placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] text-muted-foreground">Fonction <span className="text-destructive">*</span></label>
                    <select
                      value={form.fonction}
                      onChange={(e) => setForm((f) => ({ ...f, fonction: e.target.value }))}
                      className="h-9 w-full rounded-lg border border-border/60 bg-background px-2 text-sm outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                    >
                      <option value="">—</option>
                      {fonctions.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-muted-foreground">Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                      className="h-9 w-full rounded-lg border border-border/60 bg-background px-2 text-sm outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                    >
                      <option value="">—</option>
                      {defaultTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground">Tarif</label>
                  <input
                    value={form.tarif}
                    onChange={(e) => setForm((f) => ({ ...f, tarif: e.target.value }))}
                    placeholder="Ex : 200€/mois, 8€/h..."
                    className="h-9 w-full rounded-lg border border-border/60 bg-background px-3 text-sm outline-none transition-all placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground">Note</label>
                  <input
                    value={form.note}
                    onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                    placeholder="Qualité, commentaire..."
                    className="h-9 w-full rounded-lg border border-border/60 bg-background px-3 text-sm outline-none transition-all placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                {editId ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => { remove(editId); closeModal() }}
                  >
                    <Trash2 className="size-3.5" data-icon="inline-start" />
                    Supprimer
                  </Button>
                ) : <div />}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={closeModal}>Annuler</Button>
                  <Button size="sm" onClick={editId ? saveEdit : add} disabled={!form.nom.trim() || !form.fonction}>
                    {editId ? 'OK' : 'Ajouter'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </Overlay>
        )}
      </AnimatePresence>

      {/* Fonctions manager */}
      <AnimatePresence>
        {showFonctions && (
          <Overlay onClose={() => setShowFonctions(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border/50 bg-card p-4 shadow-[var(--shadow-lg)] sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowFonctions(false)}
                className="absolute right-3 top-3 rounded-xl p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Fermer"
              >
                <X className="size-4" />
              </button>
              <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Fonctions</h2>

              <div className="mb-3 flex gap-1.5">
                <input
                  value={newFonction}
                  onChange={(e) => setNewFonction(e.target.value)}
                  placeholder="Nouvelle fonction..."
                  className="h-9 min-w-0 flex-1 rounded-lg border border-border/60 bg-background px-3 text-sm outline-none placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFonction() } }}
                />
                <button
                  onClick={addFonction}
                  disabled={!newFonction.trim()}
                  className="flex h-9 items-center gap-1 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-95 disabled:opacity-30"
                >
                  <Plus className="size-4" />
                </button>
              </div>

              <div className="space-y-1">
                {fonctions.map((f) => {
                  const count = members.filter((m) => m.fonction === f).length
                  return (
                    <div key={f} className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium',
                          pickBadge(f)
                        )}>
                          {f}
                        </span>
                        <span className="text-[10px] tabular-nums text-muted-foreground/50">{count}</span>
                      </div>
                      <button
                        className="rounded-lg p-1.5 text-muted-foreground/40 transition-colors hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => removeFonction(f)}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  )
                })}
                {fonctions.length === 0 && (
                  <p className="py-6 text-center text-sm text-muted-foreground/60">Aucune fonction.</p>
                )}
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
