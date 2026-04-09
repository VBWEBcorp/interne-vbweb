import { motion } from 'framer-motion'
import { Plus, Search, Trash2, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { type Contact, type ContactColor, contactsApi } from '@/lib/api'
import { cn } from '@/lib/utils'

const colors: ContactColor[] = ['vert', 'orange', 'gris']

const dotClass: Record<ContactColor, string> = {
  vert: 'bg-emerald-500',
  orange: 'bg-amber-500',
  gris: 'bg-zinc-400',
}

const filterActive: Record<ContactColor, string> = {
  vert: 'ring-emerald-500/30 bg-emerald-500/10',
  orange: 'ring-amber-500/30 bg-amber-500/10',
  gris: 'ring-zinc-400/30 bg-zinc-400/10',
}

const order: Record<ContactColor, number> = { vert: 0, orange: 1, gris: 2 }

type Filter = 'tous' | ContactColor

export function NetworkPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [nom, setNom] = useState('')
  const [entreprise, setEntreprise] = useState('')
  const [inputColor, setInputColor] = useState<ContactColor>('gris')
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [filter, setFilter] = useState<Filter>('tous')

  useEffect(() => { contactsApi.list().then(setContacts).catch(console.error) }, [])

  async function add() {
    const n = nom.trim()
    if (!n) return
    const created = await contactsApi.create({ nom: n, entreprise: entreprise.trim(), couleur: inputColor })
    setContacts((prev) => [created, ...prev])
    setNom('')
    setEntreprise('')
  }

  async function cycleColor(c: Contact) {
    const next: ContactColor = c.couleur === 'vert' ? 'orange' : c.couleur === 'orange' ? 'gris' : 'vert'
    const updated = await contactsApi.update(c.id, { nom: c.nom, entreprise: c.entreprise, couleur: next })
    setContacts((prev) => prev.map((x) => x.id === c.id ? updated : x))
  }

  async function remove(id: string) {
    await contactsApi.remove(id)
    setContacts((prev) => prev.filter((c) => c.id !== id))
  }

  const counts = useMemo(() => ({
    vert: contacts.filter((c) => c.couleur === 'vert').length,
    orange: contacts.filter((c) => c.couleur === 'orange').length,
    gris: contacts.filter((c) => c.couleur === 'gris').length,
  }), [contacts])

  const filtered = useMemo(() => {
    let list = contacts
    if (filter !== 'tous') list = list.filter((c) => c.couleur === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (c) => c.nom.toLowerCase().includes(q) || c.entreprise.toLowerCase().includes(q)
      )
    }
    return [...list].sort((a, b) => order[a.couleur] - order[b.couleur])
  }, [contacts, search, filter])

  return (
    <div className="mx-auto max-w-xl px-3 py-4 sm:px-4 sm:py-10">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between sm:mb-6">
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5">
            <Users className="size-5 text-primary" />
          </div>
          <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-3xl">
            Partenaires
          </h1>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-primary sm:text-xs">
            {contacts.length}
          </span>
        </div>

        {contacts.length > 4 && (
          showSearch ? (
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onBlur={() => { if (!search) setShowSearch(false) }}
                placeholder="Rechercher..."
                className="h-8 w-40 rounded-lg border border-border/60 bg-card pl-9 pr-3 text-xs outline-none transition-all placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 sm:h-9 sm:w-52 sm:text-sm"
              />
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:size-9"
            >
              <Search className="size-4" />
            </button>
          )
        )}
      </div>

      {/* Color filters — dots only, no text */}
      <div className="mb-3 flex items-center gap-2 sm:mb-5">
        <button
          onClick={() => setFilter('tous')}
          className={cn(
            'rounded-full px-2.5 py-1 text-[11px] font-medium transition-all sm:px-3 sm:py-1.5 sm:text-xs',
            filter === 'tous'
              ? 'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          Tous <span className="tabular-nums text-[9px] sm:text-[10px]">{contacts.length}</span>
        </button>
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(filter === c ? 'tous' : c)}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-2.5 py-1.5 transition-all sm:px-3',
              filter === c
                ? cn('shadow-sm ring-1', filterActive[c])
                : 'hover:bg-muted'
            )}
          >
            <span className={cn('size-3 rounded-full sm:size-3.5', dotClass[c])} />
            <span className={cn(
              'tabular-nums text-[9px] sm:text-[10px]',
              filter === c ? 'text-foreground' : 'text-muted-foreground/60'
            )}>
              {counts[c]}
            </span>
          </button>
        ))}
      </div>

      {/* Add form */}
      <form
        onSubmit={(e) => { e.preventDefault(); add() }}
        className="mb-4 flex gap-1.5 sm:mb-6 sm:gap-2"
      >
        <input
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Nom..."
          className="h-9 min-w-0 flex-1 rounded-lg border border-border/60 bg-card px-3 text-xs text-foreground shadow-[var(--shadow-xs)] outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 sm:h-11 sm:rounded-xl sm:px-4 sm:text-sm"
        />
        <input
          value={entreprise}
          onChange={(e) => setEntreprise(e.target.value)}
          placeholder="Entreprise..."
          className="hidden h-9 min-w-0 flex-1 rounded-lg border border-border/60 bg-card px-3 text-xs text-foreground shadow-[var(--shadow-xs)] outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 sm:block sm:h-11 sm:rounded-xl sm:px-4 sm:text-sm"
        />
        {/* Color picker — just a dot, tap to cycle */}
        <button
          type="button"
          onClick={() => setInputColor((c) => c === 'vert' ? 'orange' : c === 'orange' ? 'gris' : 'vert')}
          className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60 transition-all active:scale-90 sm:size-11 sm:rounded-xl"
        >
          <span className={cn('size-4 rounded-full sm:size-5', dotClass[inputColor])} />
        </button>
        <button
          type="submit"
          disabled={!nom.trim()}
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-90 disabled:opacity-30 sm:size-11 sm:rounded-xl"
        >
          <Plus className="size-4" />
        </button>
      </form>

      {/* Dense list */}
      {filtered.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border/50 bg-card sm:rounded-2xl">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(i > 0 && 'border-t border-border/30')}
            >
              <div className="group flex items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4 sm:py-2.5">
                {/* Color dot — tap to cycle */}
                <button
                  onClick={() => cycleColor(c)}
                  className="shrink-0 p-1 active:scale-90"
                >
                  <span className={cn('block size-2.5 rounded-full transition-colors sm:size-3', dotClass[c.couleur])} />
                </button>

                <div className="min-w-0 flex-1">
                  <span className="truncate text-[13px] font-semibold text-foreground sm:text-[15px]">{c.nom}</span>
                  {c.entreprise && (
                    <span className="ml-2 text-[11px] text-muted-foreground/60 sm:text-xs">{c.entreprise}</span>
                  )}
                </div>

                <button
                  onClick={() => remove(c.id)}
                  className="shrink-0 rounded-lg p-1.5 text-muted-foreground/20 transition-all active:bg-destructive/10 active:text-destructive sm:opacity-0 sm:group-hover:opacity-100"
                  aria-label="Supprimer"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {filtered.length === 0 && contacts.length > 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-3xl bg-muted/50">
            <Search className="size-7 text-muted-foreground/40" />
          </div>
          <p className="text-sm text-muted-foreground/60">Aucun résultat.</p>
        </div>
      )}

      {contacts.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-3xl bg-muted/50">
            <Users className="size-7 text-muted-foreground/40" />
          </div>
          <p className="text-sm text-muted-foreground/60">Ajoutez votre premier partenaire.</p>
        </div>
      )}
    </div>
  )
}
