import { AnimatePresence, motion } from 'framer-motion'
import { Pencil, Plus, Settings2, Trash2, UserCircle, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Member = {
  id: string
  nom: string
  fonction: string
  tarif: string
  note: string
  type: string
}

let nid = 50
function uid() { return String(++nid) }

const defaultFonctions = ['Dev', 'SEO', 'Design', 'Commercial', 'Admin', 'Support']
const defaultTypes = ['Agence', 'Freelance', 'Structuré']

const fonctionColors: Record<string, string> = {
  Dev: 'from-blue-500/80 to-blue-600/80',
  SEO: 'from-emerald-500/80 to-teal-500/80',
  Design: 'from-rose-500/80 to-pink-500/80',
  Commercial: 'from-orange-500/80 to-amber-500/80',
  Admin: 'from-slate-500/80 to-slate-600/80',
  Support: 'from-sky-500/80 to-cyan-500/80',
}

function pickColor(fonction: string) {
  if (fonctionColors[fonction]) return fonctionColors[fonction]
  const code = fonction.charCodeAt(0) + (fonction.charCodeAt(1) || 0)
  const fallbacks = Object.values(fonctionColors)
  return fallbacks[code % fallbacks.length]
}

const badgeColor: Record<string, string> = {
  Dev: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  SEO: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  Design: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  Commercial: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
  Admin: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
  Support: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
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

const initialMembers: Member[] = [
  { id: '1', nom: 'Webia', fonction: 'SEO', tarif: '', note: 'Serieux + équipe quali', type: 'Structuré' },
  { id: '2', nom: 'WeonWeb', fonction: 'SEO', tarif: '400€ one shot / après 200€/mois', note: 'Qualité en SEO — Moyen, pas vraiment agence', type: 'Agence' },
  { id: '3', nom: 'Tom Adan', fonction: 'SEO', tarif: '350€ one shot / après 50€/mois', note: 'Qualité SEO', type: 'Freelance' },
  { id: '4', nom: 'Neha Verma', fonction: 'SEO', tarif: '200–300€ mensuel', note: 'Qualité SEO — Agence solide mais indienne, galère', type: 'Agence' },
  { id: '5', nom: 'Hai Agency', fonction: 'SEO', tarif: '4€/h · 32€/jour · 640€/mois', note: 'Moyen', type: 'Agence' },
  { id: '6', nom: 'Youtarget', fonction: 'SEO', tarif: '', note: 'Pas mal', type: 'Agence' },
  { id: '7', nom: 'Rafandeferana Maminiaina', fonction: 'Dev', tarif: '90€/semaine', note: 'À tester', type: 'Freelance' },
  { id: '8', nom: 'Claudio', fonction: 'Dev', tarif: '8€/h', note: 'Serieux', type: 'Freelance' },
  { id: '9', nom: 'Mbola', fonction: 'Dev', tarif: '50€/site', note: 'Très moyen', type: 'Freelance' },
]

export function StaffPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [fonctions, setFonctions] = useState<string[]>(defaultFonctions)
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Member, 'id'>>({ nom: '', fonction: '', tarif: '', note: '', type: '' })
  const [showFonctions, setShowFonctions] = useState(false)
  const [newFonction, setNewFonction] = useState('')

  function add() {
    if (!form.nom.trim() || !form.fonction) return
    setMembers((prev) => [{ ...form, nom: form.nom.trim(), id: uid() }, ...prev])
    setForm({ nom: '', fonction: '', tarif: '', note: '', type: '' })
    setShowAdd(false)
  }

  function openEdit(m: Member) {
    const { id: _, ...rest } = m
    setForm(rest)
    setEditId(m.id)
  }

  function saveEdit() {
    if (!editId || !form.nom.trim() || !form.fonction) return
    setMembers((prev) => prev.map((m) => m.id === editId ? { ...form, nom: form.nom.trim(), id: editId } : m))
    setForm({ nom: '', fonction: '', tarif: '', note: '', type: '' })
    setEditId(null)
  }

  function closeModal() {
    setShowAdd(false)
    setEditId(null)
    setForm({ nom: '', fonction: '', tarif: '', note: '', type: '' })
  }

  function remove(id: string) {
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

  const grouped = fonctions
    .map((f) => ({ fonction: f, members: members.filter((m) => m.fonction === f) }))
    .filter((g) => g.members.length > 0)

  const ungrouped = members.filter((m) => !fonctions.includes(m.fonction))
  if (ungrouped.length > 0) {
    grouped.push({ fonction: 'Autre', members: ungrouped })
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-6 sm:py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-1 flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5">
            <UserCircle className="size-5 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Staff
          </h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {members.length} membre{members.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Actions */}
      <div className="mb-6 flex items-center gap-2">
        <button
          onClick={() => setShowAdd(true)}
          className="flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95"
        >
          <Plus className="size-4" />
          Ajouter
        </button>
        <button
          onClick={() => setShowFonctions(true)}
          className="flex size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title="Gérer les fonctions"
        >
          <Settings2 className="size-4" />
        </button>
      </div>

      {/* Grouped list */}
      {grouped.length > 0 ? (
        <div className="space-y-6">
          {grouped.map((group) => (
            <div key={group.fonction}>
              <div className="mb-2.5 flex items-center gap-2">
                <span className={cn(
                  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium',
                  pickBadge(group.fonction)
                )}>
                  {group.fonction}
                </span>
                <span className="text-xs tabular-nums text-muted-foreground/50">{group.members.length}</span>
              </div>
              <div className="space-y-2">
                <AnimatePresence initial={false}>
                  {group.members.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, height: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="group rounded-2xl border border-border/50 bg-card px-4 py-3.5 shadow-[var(--shadow-xs)] transition-all hover:border-border hover:shadow-[var(--shadow-sm)] sm:px-5 sm:py-4">
                        <div className="flex items-center gap-3.5">
                          <div className={cn(
                            'flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-bold text-white shadow-sm',
                            pickColor(m.fonction)
                          )}>
                            {m.nom.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-[15px] font-medium text-foreground">{m.nom}</p>
                              {m.type && (
                                <span className={cn(
                                  'shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium',
                                  pickTypeBadge(m.type)
                                )}>
                                  {m.type}
                                </span>
                              )}
                            </div>
                            {m.tarif && (
                              <p className="mt-0.5 text-xs font-medium tabular-nums text-foreground/70">{m.tarif}</p>
                            )}
                            {m.note && (
                              <p className="mt-0.5 text-xs text-muted-foreground/60">{m.note}</p>
                            )}
                          </div>
                          <div className="flex shrink-0 items-center gap-0.5">
                            <button
                              onClick={() => openEdit(m)}
                              className="rounded-xl p-2 text-muted-foreground/40 transition-all hover:bg-muted hover:text-primary active:scale-90 sm:opacity-0 sm:group-hover:opacity-100"
                              aria-label="Modifier"
                            >
                              <Pencil className="size-3.5" />
                            </button>
                            <button
                              onClick={() => remove(m.id)}
                              className="rounded-xl p-2 text-muted-foreground/30 transition-all hover:bg-destructive/10 hover:text-destructive active:scale-90 sm:opacity-0 sm:group-hover:opacity-100"
                              aria-label="Supprimer"
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
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3 py-16 text-center"
        >
          <div className="flex size-14 items-center justify-center rounded-3xl bg-muted/50">
            <UserCircle className="size-7 text-muted-foreground/40" />
          </div>
          <p className="text-sm text-muted-foreground/60">Ajoutez votre premier membre.</p>
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
                {editId ? 'Modifier' : 'Nouveau membre'}
              </h2>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground">Nom <span className="text-destructive">*</span></label>
                  <input
                    value={form.nom}
                    onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
                    placeholder="Nom complet..."
                    className="h-10 w-full rounded-xl border border-border/60 bg-background px-4 text-sm outline-none transition-all placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">Fonction <span className="text-destructive">*</span></label>
                    <select
                      value={form.fonction}
                      onChange={(e) => setForm((f) => ({ ...f, fonction: e.target.value }))}
                      className="h-10 w-full rounded-xl border border-border/60 bg-background px-3 text-sm outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                    >
                      <option value="">— Choisir —</option>
                      {fonctions.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                      className="h-10 w-full rounded-xl border border-border/60 bg-background px-3 text-sm outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                    >
                      <option value="">— Choisir —</option>
                      {defaultTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground">Tarif</label>
                  <input
                    value={form.tarif}
                    onChange={(e) => setForm((f) => ({ ...f, tarif: e.target.value }))}
                    placeholder="Ex : 200€/mois, 8€/h..."
                    className="h-10 w-full rounded-xl border border-border/60 bg-background px-4 text-sm outline-none transition-all placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground">Note</label>
                  <input
                    value={form.note}
                    onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                    placeholder="Qualité, commentaire..."
                    className="h-10 w-full rounded-xl border border-border/60 bg-background px-4 text-sm outline-none transition-all placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
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
                    {editId ? 'Enregistrer' : 'Ajouter'}
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
              className="relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border/50 bg-card p-5 shadow-[var(--shadow-lg)] sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowFonctions(false)}
                className="absolute right-3 top-3 rounded-xl p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Fermer"
              >
                <X className="size-4" />
              </button>
              <h2 className="mb-1 font-display text-lg font-semibold text-foreground">Fonctions</h2>
              <p className="mb-5 text-sm text-muted-foreground">Gérez les catégories de fonctions.</p>

              <div className="mb-4 flex gap-2">
                <input
                  value={newFonction}
                  onChange={(e) => setNewFonction(e.target.value)}
                  placeholder="Nouvelle fonction..."
                  className="h-10 min-w-0 flex-1 rounded-xl border border-border/60 bg-background px-4 text-sm outline-none placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFonction() } }}
                />
                <button
                  onClick={addFonction}
                  disabled={!newFonction.trim()}
                  className="flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-95 disabled:opacity-30"
                >
                  <Plus className="size-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                {fonctions.map((f) => {
                  const count = members.filter((m) => m.fonction === f).length
                  return (
                    <div key={f} className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/20 px-3.5 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium',
                          pickBadge(f)
                        )}>
                          {f}
                        </span>
                        <span className="text-[10px] tabular-nums text-muted-foreground/50">{count} membre{count > 1 ? 's' : ''}</span>
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
