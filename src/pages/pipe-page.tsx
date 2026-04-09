import { AnimatePresence, motion } from 'framer-motion'
import { Archive, ArchiveRestore, Plus, Target, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { type Lead, leadsApi } from '@/lib/api'
import { cn } from '@/lib/utils'

type Tab = 'active' | 'archived'

export function PipePage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [input, setInput] = useState('')
  const [tab, setTab] = useState<Tab>('active')
  const [editingNote, setEditingNote] = useState<string | null>(null)

  useEffect(() => { leadsApi.list().then(setLeads).catch(console.error) }, [])

  const activeLeads = useMemo(() => leads.filter((l) => !l.archived), [leads])
  const archivedLeads = useMemo(() => leads.filter((l) => l.archived), [leads])
  const list = tab === 'active' ? activeLeads : archivedLeads

  async function add() {
    const nom = input.trim()
    if (!nom) return
    const created = await leadsApi.create({ nom, note: '', archived: false })
    setLeads((prev) => [created, ...prev])
    setInput('')
  }

  async function toggleArchive(id: string) {
    const lead = leads.find((l) => l.id === id)
    if (!lead) return
    const updated = await leadsApi.update(id, { nom: lead.nom, note: lead.note, archived: !lead.archived })
    setLeads((prev) => prev.map((l) => l.id === id ? updated : l))
  }

  async function setNote(id: string, note: string) {
    const lead = leads.find((l) => l.id === id)
    if (!lead) return
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, note } : l))
    await leadsApi.update(id, { nom: lead.nom, note, archived: lead.archived })
  }

  async function remove(id: string) {
    await leadsApi.remove(id)
    setLeads((prev) => prev.filter((l) => l.id !== id))
  }

  return (
    <div className="mx-auto max-w-xl px-3 py-4 sm:px-4 sm:py-10">
      {/* Header compact */}
      <div className="mb-4 flex items-center justify-between sm:mb-8">
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5">
            <Target className="size-5 text-primary" />
          </div>
          <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-3xl">
            Pipe
          </h1>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-primary sm:text-xs">
            {activeLeads.length}
          </span>
        </div>
      </div>

      {/* Input compact */}
      <form onSubmit={(e) => { e.preventDefault(); add() }} className="group relative mb-4 sm:mb-8">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nouvelle piste..."
          className="h-10 w-full rounded-xl border border-border/60 bg-card pl-4 pr-12 text-xs text-foreground shadow-[var(--shadow-xs)] outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 sm:h-12 sm:rounded-2xl sm:pl-5 sm:pr-14 sm:text-sm"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="absolute right-1.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-90 disabled:opacity-30 sm:right-2 sm:size-8 sm:rounded-xl"
        >
          <Plus className="size-3.5 sm:size-4" />
        </button>
      </form>

      {/* Tabs */}
      <div className="mb-3 flex gap-1 sm:mb-5">
        {([
          { key: 'active' as Tab, label: 'En cours', count: activeLeads.length },
          { key: 'archived' as Tab, label: 'Archivées', count: archivedLeads.length },
        ]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all sm:gap-1.5 sm:px-3.5 sm:py-1.5 sm:text-xs',
              tab === t.key
                ? 'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {t.label}
            <span className={cn(
              'tabular-nums text-[9px] sm:text-[10px]',
              tab === t.key ? 'text-primary/70' : 'text-muted-foreground/60'
            )}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Dense list */}
      <div className="overflow-hidden rounded-xl border border-border/50 bg-card sm:rounded-2xl">
        <AnimatePresence initial={false}>
          {list.map((lead, i) => (
            <motion.div
              key={lead.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              className={cn(i > 0 && 'border-t border-border/30')}
            >
              <div className={cn(
                'group px-3 py-2 sm:px-4 sm:py-3',
                lead.archived && 'opacity-40'
              )}>
                {/* Row: name + note inline + actions */}
                <div className="flex items-center gap-2">
                  {/* Name */}
                  <span className="min-w-0 shrink truncate text-[13px] font-semibold text-foreground sm:text-[15px]">
                    {lead.nom}
                  </span>

                  {/* Note badge inline (if not editing) */}
                  {editingNote !== lead.id && lead.note && (
                    <button
                      onClick={() => setEditingNote(lead.id)}
                      className="hidden min-w-0 shrink-[2] sm:block"
                    >
                      <span className="inline-block max-w-[140px] truncate rounded bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        {lead.note}
                      </span>
                    </button>
                  )}

                  {/* Spacer */}
                  <span className="flex-1" />

                  {/* Actions — always visible on mobile */}
                  <div className="flex shrink-0 items-center gap-0.5">
                    {editingNote !== lead.id && !lead.note && (
                      <button
                        onClick={() => setEditingNote(lead.id)}
                        className="rounded-lg px-1.5 py-1 text-[10px] text-muted-foreground/30 transition-colors active:bg-muted sm:hover:text-muted-foreground/60"
                      >
                        +note
                      </button>
                    )}
                    <button
                      onClick={() => toggleArchive(lead.id)}
                      className={cn(
                        'rounded-lg p-1.5 transition-all active:scale-90',
                        lead.archived
                          ? 'text-primary active:bg-primary/10'
                          : 'text-muted-foreground/30 active:bg-muted'
                      )}
                      aria-label={lead.archived ? 'Désarchiver' : 'Archiver'}
                    >
                      {lead.archived ? <ArchiveRestore className="size-3.5" /> : <Archive className="size-3.5" />}
                    </button>
                    <button
                      onClick={() => remove(lead.id)}
                      className="rounded-lg p-1.5 text-muted-foreground/20 transition-all active:bg-destructive/10 active:text-destructive sm:opacity-0 sm:group-hover:opacity-100"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                </div>

                {/* Mobile note below name (if has note, not editing) */}
                {editingNote !== lead.id && lead.note && (
                  <button
                    onClick={() => setEditingNote(lead.id)}
                    className="mt-0.5 block sm:hidden"
                  >
                    <span className="text-[10px] text-muted-foreground/70">{lead.note}</span>
                  </button>
                )}

                {/* Inline edit */}
                {editingNote === lead.id && (
                  <input
                    autoFocus
                    value={lead.note}
                    onChange={(e) => setNote(lead.id, e.target.value)}
                    onBlur={() => setEditingNote(null)}
                    onKeyDown={(e) => { if (e.key === 'Enter') setEditingNote(null) }}
                    placeholder="Note..."
                    className="mt-1 w-full rounded-lg border-0 bg-muted/30 px-2 py-1.5 text-[11px] text-foreground outline-none ring-1 ring-primary/20 placeholder:text-muted-foreground/40 sm:text-xs"
                  />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {list.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-3xl bg-muted/50">
            <Target className="size-7 text-muted-foreground/40" />
          </div>
          <p className="text-sm text-muted-foreground/60">
            {tab === 'archived' ? 'Aucune piste archivée.' : 'Aucune piste en cours.'}
          </p>
        </div>
      )}
    </div>
  )
}
