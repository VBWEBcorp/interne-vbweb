import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Search, Trash2, Users } from 'lucide-react'
import { useMemo, useState } from 'react'

import { cn } from '@/lib/utils'

type Contact = { id: string; nom: string; entreprise: string }

let nid = 0
function uid() { return String(++nid) }

const gradients = [
  'from-blue-500/80 to-blue-600/80',
  'from-emerald-500/80 to-teal-500/80',
  'from-orange-500/80 to-amber-500/80',
  'from-rose-500/80 to-pink-500/80',
  'from-sky-500/80 to-cyan-500/80',
  'from-slate-500/80 to-slate-600/80',
]

function pickGradient(name: string) {
  const code = name.charCodeAt(0) + (name.charCodeAt(1) || 0)
  return gradients[code % gradients.length]
}

export function NetworkPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [nom, setNom] = useState('')
  const [entreprise, setEntreprise] = useState('')
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  function add() {
    const n = nom.trim()
    if (!n) return
    setContacts((prev) => [{ id: uid(), nom: n, entreprise: entreprise.trim() }, ...prev])
    setNom('')
    setEntreprise('')
  }

  function remove(id: string) {
    setContacts((prev) => prev.filter((c) => c.id !== id))
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return contacts
    const q = search.toLowerCase()
    return contacts.filter(
      (c) => c.nom.toLowerCase().includes(q) || c.entreprise.toLowerCase().includes(q)
    )
  }, [contacts, search])

  return (
    <div className="mx-auto max-w-xl px-4 py-6 sm:py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-1 flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5">
            <Users className="size-5 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Réseau
          </h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {contacts.length} contact{contacts.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Add form */}
      <form
        onSubmit={(e) => { e.preventDefault(); add() }}
        className="mb-8 flex gap-2"
      >
        <div className="flex min-w-0 flex-1 gap-2">
          <input
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Nom..."
            className="h-12 min-w-0 flex-1 rounded-2xl border border-border/60 bg-card px-4 text-sm text-foreground shadow-[var(--shadow-sm)] outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 sm:h-14 sm:px-5 sm:text-base"
          />
          <input
            value={entreprise}
            onChange={(e) => setEntreprise(e.target.value)}
            placeholder="Entreprise..."
            className="hidden h-12 min-w-0 flex-1 rounded-2xl border border-border/60 bg-card px-4 text-sm text-foreground shadow-[var(--shadow-sm)] outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 sm:block sm:h-14 sm:px-5 sm:text-base"
          />
        </div>
        <button
          type="submit"
          disabled={!nom.trim()}
          className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-90 disabled:opacity-30 sm:size-14"
        >
          <Plus className="size-5" />
        </button>
      </form>

      {/* Search toggle */}
      {contacts.length > 4 && (
        <div className="mb-5">
          {showSearch ? (
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onBlur={() => { if (!search) setShowSearch(false) }}
                placeholder="Rechercher..."
                className="h-10 w-full rounded-xl border border-border/60 bg-card pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
              />
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Search className="size-3.5" />
              Rechercher
            </button>
          )}
        </div>
      )}

      {/* List */}
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {filtered.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="group flex items-center gap-3.5 rounded-2xl border border-border/50 bg-card px-4 py-3.5 shadow-[var(--shadow-xs)] transition-all hover:border-border hover:shadow-[var(--shadow-sm)] sm:px-5 sm:py-4">
                <div className={cn(
                  'flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-bold text-white shadow-sm',
                  pickGradient(c.nom)
                )}>
                  {c.nom.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-medium text-foreground">{c.nom}</p>
                  {c.entreprise && (
                    <p className="truncate text-xs text-muted-foreground/70">{c.entreprise}</p>
                  )}
                </div>
                <button
                  onClick={() => remove(c.id)}
                  className="shrink-0 rounded-xl p-2 text-muted-foreground/30 transition-all hover:bg-destructive/10 hover:text-destructive active:scale-90 sm:opacity-0 sm:group-hover:opacity-100"
                  aria-label="Supprimer"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && contacts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3 py-16 text-center"
          >
            <div className="flex size-14 items-center justify-center rounded-3xl bg-muted/50">
              <Search className="size-7 text-muted-foreground/40" />
            </div>
            <p className="text-sm text-muted-foreground/60">Aucun résultat.</p>
          </motion.div>
        )}

        {contacts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3 py-16 text-center"
          >
            <div className="flex size-14 items-center justify-center rounded-3xl bg-muted/50">
              <Users className="size-7 text-muted-foreground/40" />
            </div>
            <p className="text-sm text-muted-foreground/60">Ajoutez votre premier contact.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
