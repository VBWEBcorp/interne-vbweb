import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowUpRight,
  Calendar,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  FileText,
  Mail,
  PauseCircle,
  Pencil,
  Plus,
  Search,
  Settings2,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  type Contract,
  type ContractStatus,
  defaultPrestations,
  generateId,
  initialContracts,
  parseDateFR,
  statusOrder,
} from '@/data/contracts'
import { cn } from '@/lib/utils'

type SortKey = keyof Contract
type SortDir = 'asc' | 'desc'

const statusColors: Record<ContractStatus, string> = {
  Actif: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  Suspendu: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  Terminé: 'bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 border-zinc-500/20',
}

const statusDot: Record<ContractStatus, string> = {
  Actif: 'bg-emerald-500',
  Suspendu: 'bg-amber-500',
  Terminé: 'bg-zinc-400',
}

const statusFilters: ContractStatus[] = ['Actif', 'Suspendu', 'Terminé']

const emptyContract: Omit<Contract, 'id'> = {
  dirigeant: '',
  entreprise: '',
  dateDebut: '',
  dateFin: '',
  mail: '',
  prestation: 'SEO',
  montantHT: 0,
  frequence: 'Mensuel',
  statut: 'Actif',
}

function fmt(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>(initialContracts)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ContractStatus | 'Tous'>('Tous')
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyContract)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [prestations, setPrestations] = useState<string[]>(defaultPrestations)
  const [newPrestation, setNewPrestation] = useState('')
  const [showPrestations, setShowPrestations] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const filtered = useMemo(() => {
    let list = contracts

    if (statusFilter !== 'Tous') {
      list = list.filter((c) => c.statut === statusFilter)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (c) =>
          c.dirigeant.toLowerCase().includes(q) ||
          c.entreprise.toLowerCase().includes(q) ||
          c.mail.toLowerCase().includes(q) ||
          c.prestation.toLowerCase().includes(q)
      )
    }

    list = [...list].sort((a, b) => {
      if (sortKey) {
        const aVal = a[sortKey]
        const bVal = b[sortKey]
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDir === 'asc' ? aVal - bVal : bVal - aVal
        }
        const cmp = String(aVal).localeCompare(String(bVal), 'fr')
        return sortDir === 'asc' ? cmp : -cmp
      }
      const statusCmp = statusOrder[a.statut] - statusOrder[b.statut]
      if (statusCmp !== 0) return statusCmp
      return parseDateFR(b.dateDebut) - parseDateFR(a.dateDebut)
    })

    return list
  }, [contracts, search, statusFilter, sortKey, sortDir])

  const stats = useMemo(() => {
    const actifs = contracts.filter((c) => c.statut === 'Actif')
    const suspendus = contracts.filter((c) => c.statut === 'Suspendu')
    const termines = contracts.filter((c) => c.statut === 'Terminé')

    const htActifs = actifs.reduce((sum, c) => sum + c.montantHT, 0)
    const htSuspendus = suspendus.reduce((sum, c) => sum + c.montantHT, 0)
    const htTermines = termines.reduce((sum, c) => sum + c.montantHT, 0)

    return {
      total: contracts.length,
      actifs: actifs.length,
      suspendus: suspendus.length,
      termines: termines.length,
      htActifs,
      ttcActifs: htActifs * 1.2,
      htSuspendus,
      htTermines,
    }
  }, [contracts])

  const filteredTotal = useMemo(() => {
    return filtered.reduce((sum, c) => sum + c.montantHT, 0)
  }, [filtered])

  function handleAdd() {
    if (!form.entreprise.trim()) return
    setContracts((prev) => [{ ...form, id: generateId() }, ...prev])
    setForm(emptyContract)
    setShowAdd(false)
  }

  function openEdit(contract: Contract) {
    const { id: _, ...rest } = contract
    setForm(rest)
    setEditId(contract.id)
  }

  function handleEdit() {
    if (!editId || !form.entreprise.trim()) return
    setContracts((prev) =>
      prev.map((c) => (c.id === editId ? { ...form, id: editId } : c))
    )
    setForm(emptyContract)
    setEditId(null)
  }

  function closeEdit() {
    setEditId(null)
    setForm(emptyContract)
  }

  function handleDelete(id: string) {
    setContracts((prev) => prev.filter((c) => c.id !== id))
    setDeleteId(null)
  }

  function addPrestation() {
    const name = newPrestation.trim()
    if (!name || prestations.includes(name)) return
    setPrestations((prev) => [...prev, name])
    setForm((f) => ({ ...f, prestation: name }))
    setNewPrestation('')
  }

  function removePrestation(name: string) {
    setPrestations((prev) => prev.filter((p) => p !== name))
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronDown className="size-3 opacity-0 group-hover:opacity-40" />
    return sortDir === 'asc' ? (
      <ChevronUp className="size-3 text-primary" />
    ) : (
      <ChevronDown className="size-3 text-primary" />
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-10 lg:px-8">

      {/* Header */}
      <div className="mb-8">
        <div className="mb-1 flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5">
            <FileText className="size-5 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Contrats
          </h1>
          <Badge variant="secondary" className="ml-1 tabular-nums">
            {filtered.length}
          </Badge>
        </div>
      </div>

      {/* KPI cards */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard icon={Users} label="Total" value={String(stats.total)} color="from-primary/15 to-primary/5" iconColor="text-primary" />
        <KpiCard icon={ArrowUpRight} label="Actifs" value={String(stats.actifs)} color="from-emerald-500/15 to-emerald-500/5" iconColor="text-emerald-500" valueColor="text-emerald-600 dark:text-emerald-400" />
        <KpiCard icon={PauseCircle} label="Suspendus" value={String(stats.suspendus)} color="from-amber-500/15 to-amber-500/5" iconColor="text-amber-500" valueColor="text-amber-600 dark:text-amber-400" />
        <KpiCard icon={CircleDollarSign} label="HT / mois" value={`${fmt(stats.htActifs)} €`} color="from-primary/15 to-primary/5" iconColor="text-primary" small />
        <KpiCard icon={CircleDollarSign} label="TTC / mois" value={`${fmt(stats.ttcActifs)} €`} color="from-primary/15 to-primary/5" iconColor="text-primary" small />
      </div>

      {/* Distribution bar */}
      <div className="mb-8">
        <div className="flex h-2 overflow-hidden rounded-full bg-muted">
          {stats.total > 0 && (
            <>
              <div className="bg-emerald-500 transition-all" style={{ width: `${(stats.actifs / stats.total) * 100}%` }} />
              <div className="bg-amber-500 transition-all" style={{ width: `${(stats.suspendus / stats.total) * 100}%` }} />
              <div className="bg-zinc-400 transition-all" style={{ width: `${(stats.termines / stats.total) * 100}%` }} />
            </>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-emerald-500" />{stats.actifs} actifs — {fmt(stats.htActifs)} €</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-amber-500" />{stats.suspendus} suspendus — {fmt(stats.htSuspendus)} €</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-zinc-400" />{stats.termines} terminés — {fmt(stats.htTermines)} €</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(['Tous', ...statusFilters] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                statusFilter === s
                  ? 'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {s !== 'Tous' && (
                <span className={cn('size-1.5 rounded-full', statusDot[s as ContractStatus])} />
              )}
              {s}
              <span className={cn(
                'tabular-nums text-[10px]',
                statusFilter === s ? 'text-primary/70' : 'text-muted-foreground/60'
              )}>
                {s === 'Tous' ? stats.total : s === 'Actif' ? stats.actifs : s === 'Suspendu' ? stats.suspendus : stats.termines}
              </span>
            </button>
          ))}

          {statusFilter !== 'Tous' && (
            <span className="ml-2 text-xs tabular-nums text-muted-foreground">
              {fmt(filteredTotal)} € HT
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {showSearch ? (
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50" />
              <input
                autoFocus
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onBlur={() => { if (!search) setShowSearch(false) }}
                className="h-9 w-48 rounded-xl border border-border/60 bg-card pl-9 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 sm:w-56"
              />
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Search className="size-4" />
            </button>
          )}

          <button
            onClick={() => setShowPrestations(true)}
            className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Gérer les prestations"
          >
            <Settings2 className="size-4" />
          </button>

          <button
            onClick={() => setShowAdd(true)}
            className="flex h-9 items-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">Ajouter</span>
          </button>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-border/50 bg-card shadow-[var(--shadow-sm)] md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <SortTh label="Entreprise" col="entreprise" />
                <SortTh label="Dirigeant" col="dirigeant" />
                <SortTh label="Début" col="dateDebut" />
                <SortTh label="Fin" col="dateFin" />
                <SortTh label="Email" col="mail" className="hidden lg:table-cell" />
                <SortTh label="Prestation" col="prestation" />
                <SortTh label="HT/mois" col="montantHT" />
                <SortTh label="Statut" col="statut" />
                <th className="w-20 px-2 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.map((c) => (
                <tr key={c.id} className="transition-colors hover:bg-muted/20">
                  <td className="px-4 py-3.5 font-medium text-foreground whitespace-nowrap">{c.entreprise}</td>
                  <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">{c.dirigeant}</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground whitespace-nowrap">
                      <Calendar className="size-3 shrink-0 text-muted-foreground/40" />
                      {c.dateDebut || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground whitespace-nowrap">
                      <Calendar className="size-3 shrink-0 text-muted-foreground/40" />
                      {c.dateFin || '—'}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3.5 lg:table-cell">
                    {c.mail ? (
                      <a
                        href={`mailto:${c.mail}`}
                        className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-primary"
                      >
                        <Mail className="size-3.5 shrink-0" />
                        <span className="max-w-[160px] truncate">{c.mail}</span>
                      </a>
                    ) : (
                      <span className="text-muted-foreground/30">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                    {c.prestation || '—'}
                  </td>
                  <td className="px-4 py-3.5 tabular-nums font-semibold text-foreground whitespace-nowrap">
                    {fmt(c.montantHT)} €
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap',
                      statusColors[c.statut]
                    )}>
                      <span className={cn('size-1.5 rounded-full', statusDot[c.statut])} />
                      {c.statut}
                    </span>
                  </td>
                  <td className="px-2 py-3.5">
                    <div className="flex items-center gap-0.5">
                      <button
                        className="rounded-lg p-1.5 text-muted-foreground/40 transition-colors hover:bg-muted hover:text-primary"
                        onClick={() => openEdit(c)}
                        aria-label={`Modifier ${c.entreprise}`}
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        className="rounded-lg p-1.5 text-muted-foreground/30 transition-colors hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setDeleteId(c.id)}
                        aria-label={`Supprimer ${c.entreprise}`}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center text-muted-foreground/60">
                    Aucun contrat trouvé.
                  </td>
                </tr>
              )}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr className="border-t border-border/50 bg-muted/20">
                  <td colSpan={6} className="px-4 py-3 text-xs font-medium text-muted-foreground">
                    Total — {filtered.length} contrat{filtered.length > 1 ? 's' : ''}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-sm font-bold text-foreground whitespace-nowrap">
                    {fmt(filteredTotal)} €
                  </td>
                  <td />
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="space-y-2.5 md:hidden">
        <AnimatePresence initial={false}>
          {filtered.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-[var(--shadow-xs)] transition-all active:scale-[0.99]">
                {/* Top row */}
                <div className="mb-2.5 flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold text-foreground">{c.entreprise}</p>
                    {c.dirigeant && <p className="truncate text-xs text-muted-foreground">{c.dirigeant}</p>}
                  </div>
                  <span className={cn(
                    'ml-2 inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium',
                    statusColors[c.statut]
                  )}>
                    <span className={cn('size-1.5 rounded-full', statusDot[c.statut])} />
                    {c.statut}
                  </span>
                </div>

                {/* Info grid */}
                <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-muted/30 px-2.5 py-2">
                    <p className="text-muted-foreground/60">Montant HT</p>
                    <p className="mt-0.5 font-semibold tabular-nums text-foreground">{fmt(c.montantHT)} €</p>
                  </div>
                  <div className="rounded-lg bg-muted/30 px-2.5 py-2">
                    <p className="text-muted-foreground/60">Prestation</p>
                    <p className="mt-0.5 font-medium text-foreground">{c.prestation || '—'}</p>
                  </div>
                  {(c.dateDebut || c.dateFin) && (
                    <div className="col-span-2 rounded-lg bg-muted/30 px-2.5 py-2">
                      <p className="text-muted-foreground/60">Période</p>
                      <p className="mt-0.5 font-medium text-foreground">
                        {c.dateDebut || '?'} → {c.dateFin || '?'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1">
                  {c.mail && (
                    <a
                      href={`mailto:${c.mail}`}
                      className="rounded-xl p-2 text-muted-foreground/50 transition-colors hover:text-primary"
                    >
                      <Mail className="size-4" />
                    </a>
                  )}
                  <button
                    onClick={() => openEdit(c)}
                    className="rounded-xl p-2 text-muted-foreground/50 transition-colors hover:text-primary"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(c.id)}
                    className="rounded-xl p-2 text-muted-foreground/30 transition-colors hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16">
            <div className="flex size-14 items-center justify-center rounded-3xl bg-muted/50">
              <FileText className="size-7 text-muted-foreground/40" />
            </div>
            <p className="text-sm text-muted-foreground/60">Aucun contrat trouvé.</p>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="rounded-2xl border border-border/50 bg-muted/20 px-4 py-3 text-center">
            <p className="text-xs text-muted-foreground">
              {filtered.length} contrat{filtered.length > 1 ? 's' : ''} — <span className="font-semibold tabular-nums text-foreground">{fmt(filteredTotal)} € HT</span>
            </p>
          </div>
        )}
      </div>

      {/* Add modal */}
      <AnimatePresence>
        {showAdd && (
          <Overlay onClose={() => setShowAdd(false)}>
            <ModalContent onClose={() => setShowAdd(false)} title="Nouveau contrat">
              <ContractForm form={form} setForm={setForm} prestations={prestations} />
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowAdd(false)}>
                  Annuler
                </Button>
                <Button size="sm" onClick={handleAdd} disabled={!form.entreprise.trim()}>
                  Ajouter
                </Button>
              </div>
            </ModalContent>
          </Overlay>
        )}
      </AnimatePresence>

      {/* Edit modal */}
      <AnimatePresence>
        {editId && (
          <Overlay onClose={closeEdit}>
            <ModalContent onClose={closeEdit} title="Modifier le contrat">
              <ContractForm form={form} setForm={setForm} prestations={prestations} />
              <div className="mt-6 flex items-center justify-between">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => { closeEdit(); setDeleteId(editId) }}
                >
                  <Trash2 className="size-3.5" data-icon="inline-start" />
                  Supprimer
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={closeEdit}>
                    Annuler
                  </Button>
                  <Button size="sm" onClick={handleEdit} disabled={!form.entreprise.trim()}>
                    Enregistrer
                  </Button>
                </div>
              </div>
            </ModalContent>
          </Overlay>
        )}
      </AnimatePresence>

      {/* Prestations manager */}
      <AnimatePresence>
        {showPrestations && (
          <Overlay onClose={() => setShowPrestations(false)}>
            <ModalContent onClose={() => setShowPrestations(false)} title="Catégories de prestations" subtitle="Créez et gérez vos types de prestations.">
              <div className="mb-4 flex gap-2">
                <input
                  value={newPrestation}
                  onChange={(e) => setNewPrestation(e.target.value)}
                  placeholder="Nouvelle catégorie..."
                  className="h-10 min-w-0 flex-1 rounded-xl border border-border/60 bg-background px-4 text-sm outline-none placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addPrestation() } }}
                />
                <button
                  onClick={addPrestation}
                  disabled={!newPrestation.trim()}
                  className="flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-95 disabled:opacity-30"
                >
                  <Plus className="size-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                {prestations.map((p) => {
                  const usedCount = contracts.filter((c) => c.prestation === p).length
                  return (
                    <div key={p} className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/20 px-3.5 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{p}</span>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] tabular-nums text-muted-foreground">
                          {usedCount}
                        </span>
                      </div>
                      <button
                        className="rounded-lg p-1.5 text-muted-foreground/40 transition-colors hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => removePrestation(p)}
                        aria-label={`Supprimer ${p}`}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  )
                })}
                {prestations.length === 0 && (
                  <p className="py-6 text-center text-sm text-muted-foreground/60">
                    Aucune catégorie.
                  </p>
                )}
              </div>
            </ModalContent>
          </Overlay>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteId && (
          <Overlay onClose={() => setDeleteId(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-sm rounded-2xl border border-border/50 bg-card p-6 shadow-[var(--shadow-lg)]"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="mb-2 font-display text-base font-semibold text-foreground">
                Supprimer ce contrat ?
              </h2>
              <p className="mb-6 text-sm text-muted-foreground">
                Cette action est irréversible.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setDeleteId(null)}>
                  Annuler
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(deleteId)}>
                  Supprimer
                </Button>
              </div>
            </motion.div>
          </Overlay>
        )}
      </AnimatePresence>
    </div>
  )

  function SortTh({ label, col, className }: { label: string; col: SortKey; className?: string }) {
    return (
      <th
        className={cn(
          'group cursor-pointer px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70 transition-colors hover:text-foreground select-none',
          className
        )}
        onClick={() => handleSort(col)}
      >
        <span className="inline-flex items-center gap-1">
          {label}
          <SortIcon col={col} />
        </span>
      </th>
    )
  }
}

/* ─── Sub-components ─── */

function KpiCard({ icon: Icon, label, value, color, iconColor, valueColor, small }: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  color: string
  iconColor: string
  valueColor?: string
  small?: boolean
}) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-[var(--shadow-xs)] transition-all hover:shadow-[var(--shadow-sm)]">
      <div className={cn('mb-3 flex size-9 items-center justify-center rounded-xl bg-gradient-to-br', color)}>
        <Icon className={cn('size-4', iconColor)} />
      </div>
      <p className={cn(
        'tabular-nums font-semibold',
        small ? 'text-lg' : 'text-2xl',
        valueColor || 'text-foreground'
      )}>
        {value}
      </p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{label}</p>
    </div>
  )
}

function ModalContent({ children, onClose, title, subtitle }: {
  children: React.ReactNode
  onClose: () => void
  title: string
  subtitle?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border/50 bg-card p-5 shadow-[var(--shadow-lg)] sm:p-6"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute right-3 top-3 rounded-xl p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Fermer"
      >
        <X className="size-4" />
      </button>
      <h2 className="mb-1 font-display text-lg font-semibold text-foreground">{title}</h2>
      {subtitle && <p className="mb-5 text-sm text-muted-foreground">{subtitle}</p>}
      {!subtitle && <div className="mb-5" />}
      {children}
    </motion.div>
  )
}

function ContractForm({
  form,
  setForm,
  prestations,
}: {
  form: Omit<Contract, 'id'>
  setForm: React.Dispatch<React.SetStateAction<Omit<Contract, 'id'>>>
  prestations: string[]
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FormField label="Entreprise" value={form.entreprise} onChange={(v) => setForm((f) => ({ ...f, entreprise: v }))} required />
      <FormField label="Dirigeant" value={form.dirigeant} onChange={(v) => setForm((f) => ({ ...f, dirigeant: v }))} />
      <FormField label="Date début" value={form.dateDebut} onChange={(v) => setForm((f) => ({ ...f, dateDebut: v }))} placeholder="05/01/2025" />
      <FormField label="Date fin" value={form.dateFin} onChange={(v) => setForm((f) => ({ ...f, dateFin: v }))} placeholder="05/01/2026" />
      <FormField label="Email" value={form.mail} onChange={(v) => setForm((f) => ({ ...f, mail: v }))} type="email" />

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Prestation</Label>
        <select
          value={form.prestation}
          onChange={(e) => setForm((f) => ({ ...f, prestation: e.target.value }))}
          className="h-10 w-full rounded-xl border border-border/60 bg-background px-3 text-sm outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
        >
          <option value="">— Choisir —</option>
          {prestations.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <FormField
        label="Montant HT / mois"
        value={String(form.montantHT || '')}
        onChange={(v) => setForm((f) => ({ ...f, montantHT: parseFloat(v) || 0 }))}
        type="number"
      />
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Statut</Label>
        <select
          value={form.statut}
          onChange={(e) => setForm((f) => ({ ...f, statut: e.target.value as ContractStatus }))}
          className="h-10 w-full rounded-xl border border-border/60 bg-background px-3 text-sm outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
        >
          <option value="Actif">Actif</option>
          <option value="Suspendu">Suspendu</option>
          <option value="Terminé">Terminé</option>
        </select>
      </div>
    </div>
  )
}

function FormField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 rounded-xl text-sm"
      />
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
