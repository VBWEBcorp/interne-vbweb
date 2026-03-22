import { AnimatePresence, motion } from 'framer-motion'
import { Archive, ArchiveRestore, Plus, Target, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'

import { cn } from '@/lib/utils'

type Lead = { id: string; nom: string; note: string; archived: boolean }

let nid = 50
function uid() { return String(++nid) }

const initial: Lead[] = [
  { id: '1', nom: 'Solatrack', note: 'OK mais attendre encore', archived: false },
  { id: '2', nom: 'Céramique Gaëlle', note: 'ça sent le KO', archived: false },
  { id: '3', nom: 'Milla x 2', note: '', archived: false },
  { id: '4', nom: 'Édouard x 1', note: '', archived: false },
  { id: '5', nom: 'Saint Martin x 1', note: '', archived: false },
  { id: '6', nom: 'Aurore', note: '', archived: false },
  { id: '7', nom: 'Cousin Zidane', note: '', archived: false },
  { id: '8', nom: 'Nathan e-commerce', note: '', archived: false },
  { id: '9', nom: 'Melissa', note: 'OK', archived: false },
  { id: '10', nom: 'Bisous Tatoo', note: '', archived: false },
  { id: '11', nom: 'Roazon Bière', note: '', archived: false },
  { id: '12', nom: 'Salomé Carte', note: '', archived: false },
  { id: '13', nom: 'Myriam SEO', note: '', archived: false },
  { id: '14', nom: 'Matineh Food', note: 'OK', archived: false },
  { id: '15', nom: 'Benoît Local', note: 'OK', archived: false },
  { id: '16', nom: 'Actimaine Refonte', note: 'OK', archived: false },
  { id: '17', nom: 'Hill Carrelage', note: 'ça sent le KO', archived: false },
  { id: '18', nom: 'Pote Evan', note: '', archived: false },
  { id: '19', nom: 'Massage', note: 'EN ATTENTE Octobre', archived: false },
  { id: '20', nom: 'Ibrahim', note: 'PAS DE REP', archived: false },
  { id: '21', nom: 'François Ortho', note: 'OK', archived: false },
  { id: '22', nom: 'Benoît Nouvel Engagement', note: 'OK', archived: false },
]

type Tab = 'active' | 'archived'

export function PipePage() {
  const [leads, setLeads] = useState<Lead[]>(initial)
  const [input, setInput] = useState('')
  const [tab, setTab] = useState<Tab>('active')
  const [editingNote, setEditingNote] = useState<string | null>(null)

  const activeLeads = useMemo(() => leads.filter((l) => !l.archived), [leads])
  const archivedLeads = useMemo(() => leads.filter((l) => l.archived), [leads])
  const list = tab === 'active' ? activeLeads : archivedLeads

  function add() {
    const nom = input.trim()
    if (!nom) return
    setLeads((prev) => [{ id: uid(), nom, note: '', archived: false }, ...prev])
    setInput('')
  }

  function toggleArchive(id: string) {
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, archived: !l.archived } : l))
  }

  function setNote(id: string, note: string) {
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, note } : l))
  }

  function remove(id: string) {
    setLeads((prev) => prev.filter((l) => l.id !== id))
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-6 sm:py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-1 flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5">
            <Target className="size-5 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Pipe
          </h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {activeLeads.length} piste{activeLeads.length > 1 ? 's' : ''} en cours
        </p>
      </div>

      {/* Input */}
      <form onSubmit={(e) => { e.preventDefault(); add() }} className="group relative mb-8">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nouvelle piste..."
          className="h-12 w-full rounded-2xl border border-border/60 bg-card pl-5 pr-14 text-sm text-foreground shadow-[var(--shadow-sm)] outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary/40 focus:shadow-[var(--shadow-md)] focus:ring-2 focus:ring-primary/10 sm:h-14 sm:pl-6 sm:text-base"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-90 disabled:opacity-30 sm:size-10"
        >
          <Plus className="size-4 sm:size-5" />
        </button>
      </form>

      {/* Tabs */}
      <div className="mb-5 flex gap-1.5">
        {([
          { key: 'active' as Tab, label: 'En cours', count: activeLeads.length },
          { key: 'archived' as Tab, label: 'Archivées', count: archivedLeads.length },
        ]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all',
              tab === t.key
                ? 'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {t.label}
            <span className={cn(
              'tabular-nums text-[10px]',
              tab === t.key ? 'text-primary/70' : 'text-muted-foreground/60'
            )}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {list.map((lead) => (
            <motion.div
              key={lead.id}
              layout
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={cn(
                'group rounded-2xl border border-border/50 bg-card px-4 py-3.5 shadow-[var(--shadow-xs)] transition-all sm:px-5 sm:py-4',
                lead.archived ? 'opacity-50' : 'hover:shadow-[var(--shadow-sm)] hover:border-border'
              )}>
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-muted to-muted/50 text-xs font-bold text-muted-foreground">
                    {lead.nom.charAt(0).toUpperCase()}
                  </div>
                  <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-foreground">{lead.nom}</span>

                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => toggleArchive(lead.id)}
                      className={cn(
                        'shrink-0 rounded-xl p-2 transition-all active:scale-90',
                        lead.archived
                          ? 'text-primary hover:bg-primary/10'
                          : 'text-muted-foreground/40 hover:bg-muted hover:text-muted-foreground'
                      )}
                      aria-label={lead.archived ? 'Désarchiver' : 'Archiver'}
                    >
                      {lead.archived ? <ArchiveRestore className="size-4" /> : <Archive className="size-4" />}
                    </button>
                    <button
                      onClick={() => remove(lead.id)}
                      className="shrink-0 rounded-xl p-2 text-muted-foreground/30 transition-all hover:bg-destructive/10 hover:text-destructive active:scale-90 sm:opacity-0 sm:group-hover:opacity-100"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                {editingNote === lead.id ? (
                  <input
                    autoFocus
                    value={lead.note}
                    onChange={(e) => setNote(lead.id, e.target.value)}
                    onBlur={() => setEditingNote(null)}
                    onKeyDown={(e) => { if (e.key === 'Enter') setEditingNote(null) }}
                    placeholder="Ajouter une note..."
                    className="mt-2.5 w-full rounded-lg border-0 bg-muted/40 px-3 py-2 text-xs text-foreground outline-none ring-1 ring-primary/20 placeholder:text-muted-foreground/40"
                  />
                ) : (
                  <button
                    onClick={() => setEditingNote(lead.id)}
                    className="mt-2 block w-full text-left text-xs"
                  >
                    {lead.note ? (
                      <span className="inline-flex rounded-lg bg-muted/40 px-2.5 py-1.5 text-muted-foreground">{lead.note}</span>
                    ) : (
                      <span className="text-muted-foreground/30 hover:text-muted-foreground/60">+ note</span>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {list.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3 py-16 text-center"
          >
            <div className="flex size-14 items-center justify-center rounded-3xl bg-muted/50">
              <Target className="size-7 text-muted-foreground/40" />
            </div>
            <p className="text-sm text-muted-foreground/60">
              {tab === 'archived' ? 'Aucune piste archivée.' : 'Aucune piste en cours.'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
