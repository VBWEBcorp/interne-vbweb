import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  Bell,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  Mail,
  Pencil,
  Plus,
  Search,
  Settings2,
  Trash2,
  TrendingUp,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  type Contract,
  type ContractStatus,
  defaultPrestations,
  parseDateFR,
  statusOrder,
} from '@/data/contracts'
import {
  createContract,
  deleteContract as apiDeleteContract,
  listContracts,
  updateContract,
} from '@/lib/contracts-api'
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

const THREE_MONTHS_MS = 1000 * 60 * 60 * 24 * 90

function isExpiringSoon(c: Contract): boolean {
  if (c.statut !== 'Actif') return false
  const end = parseDateFR(c.dateFin)
  if (!end) return false
  const now = Date.now()
  // Only warn if end date is in the future AND within 3 months
  return end >= now && end - now <= THREE_MONTHS_MS
}

function daysLeft(dateFR: string): number {
  const t = parseDateFR(dateFR)
  if (!t) return 0
  return Math.ceil((t - Date.now()) / (1000 * 60 * 60 * 24))
}

export function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
  const [showAlerts, setShowAlerts] = useState(false)
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    listContracts()
      .then((data) => {
        if (!cancelled) {
          setContracts(data)
          setError(null)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

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
    return {
      total: contracts.length,
      actifs: contracts.filter((c) => c.statut === 'Actif').length,
      suspendus: contracts.filter((c) => c.statut === 'Suspendu').length,
      termines: contracts.filter((c) => c.statut === 'Terminé').length,
    }
  }, [contracts])

  const monthlyRevenue = useMemo(
    () => contracts.filter((c) => c.statut === 'Actif').reduce((s, c) => s + c.montantHT, 0),
    [contracts],
  )

  const suspendedTotal = useMemo(
    () => contracts.filter((c) => c.statut === 'Suspendu').reduce((s, c) => s + c.montantHT, 0),
    [contracts],
  )

  const terminatedTotal = useMemo(
    () => contracts.filter((c) => c.statut === 'Terminé').reduce((s, c) => s + c.montantHT, 0),
    [contracts],
  )

  const expiringSoon = useMemo(
    () =>
      contracts
        .filter(isExpiringSoon)
        .sort((a, b) => parseDateFR(a.dateFin) - parseDateFR(b.dateFin)),
    [contracts],
  )

  const filteredTotal = useMemo(() => {
    return filtered.reduce((sum, c) => sum + c.montantHT, 0)
  }, [filtered])

  async function handleAdd() {
    if (!form.entreprise.trim()) return
    try {
      const created = await createContract(form)
      setContracts((prev) => [created, ...prev])
      setForm(emptyContract)
      setShowAdd(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  function openEdit(contract: Contract) {
    const { id: _, ...rest } = contract
    setForm(rest)
    setEditId(contract.id)
  }

  async function handleEdit() {
    if (!editId || !form.entreprise.trim()) return
    try {
      const updated = await updateContract(editId, form)
      setContracts((prev) => prev.map((c) => (c.id === editId ? updated : c)))
      setForm(emptyContract)
      setEditId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  function closeEdit() {
    setEditId(null)
    setForm(emptyContract)
  }

  async function handleDelete(id: string) {
    try {
      await apiDeleteContract(id)
      setContracts((prev) => prev.filter((c) => c.id !== id))
      setDeleteId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
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
    <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-10 lg:px-8">

      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-2 sm:mb-6">
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5">
            <FileText className="size-5 text-primary" />
          </div>
          <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-3xl">
            Contrats
          </h1>
          <Badge variant="secondary" className="ml-1 tabular-nums text-[10px] sm:text-xs">
            {filtered.length}
          </Badge>
        </div>

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setShowAlerts((v) => !v)}
            className={cn(
              'relative flex size-10 items-center justify-center rounded-2xl border transition-all',
              expiringSoon.length > 0
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400'
                : 'border-border/60 bg-card text-muted-foreground hover:bg-muted'
            )}
            aria-label="Alertes contrats"
          >
            <Bell className="size-4" />
            {expiringSoon.length > 0 && (
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-sm">
                {expiringSoon.length}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showAlerts && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowAlerts(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 z-40 w-80 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xl"
                >
                  <div className="border-b border-border/50 bg-amber-500/5 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="size-4 text-amber-500" />
                      <p className="text-sm font-semibold text-foreground">
                        Fins de contrat — 3 mois
                      </p>
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {expiringSoon.length === 0
                        ? 'Aucune alerte 🎉'
                        : `${expiringSoon.length} contrat${expiringSoon.length > 1 ? 's' : ''} à renouveler ou remplacer`}
                    </p>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {expiringSoon.length === 0 ? (
                      <p className="px-4 py-6 text-center text-xs text-muted-foreground/60">
                        Tout est tranquille pour l'instant.
                      </p>
                    ) : (
                      expiringSoon.map((c) => {
                        const days = daysLeft(c.dateFin)
                        return (
                          <div
                            key={c.id}
                            className="flex items-center justify-between gap-3 border-b border-border/30 px-4 py-3 last:border-b-0 hover:bg-muted/30"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-foreground">
                                {c.entreprise}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                Fin le {c.dateFin} — {fmt(c.montantHT)} € HT
                              </p>
                            </div>
                            <span className="shrink-0 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                              J-{days}
                            </span>
                          </div>
                        )
                      })
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Revenue banner */}
      <div className="mb-4 overflow-hidden rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-3 sm:mb-6 sm:rounded-2xl sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/15 sm:size-10 sm:rounded-xl">
              <TrendingUp className="size-4 text-emerald-600 dark:text-emerald-400 sm:size-5" />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wide text-muted-foreground sm:text-[11px]">
                Revenu mensuel
              </p>
              <p className="font-display text-lg font-bold tabular-nums text-foreground sm:text-3xl">
                {fmt(monthlyRevenue)} <span className="text-xs text-muted-foreground sm:text-lg">€ HT</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] uppercase tracking-wide text-muted-foreground sm:text-[11px]">Actifs</p>
            <p className="text-lg font-bold tabular-nums text-emerald-600 dark:text-emerald-400 sm:text-2xl">
              {stats.actifs}
            </p>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 border-t border-emerald-500/10 pt-2 text-[10px] text-muted-foreground sm:mt-3 sm:gap-x-4 sm:gap-y-1 sm:pt-2.5 sm:text-[11px]">
          <span className="inline-flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-amber-500" />
            Susp. <span className="tabular-nums font-medium text-foreground/80">{fmt(suspendedTotal)} €</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-zinc-400" />
            Term. <span className="tabular-nums font-medium text-foreground/80">{fmt(terminatedTotal)} €</span>
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-3 flex flex-col gap-2 sm:mb-5 sm:flex-row sm:gap-3 sm:items-center sm:justify-between">
        {/* Filters */}
        <div className="flex items-center gap-1">
          {(['Tous', ...statusFilters] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs',
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
                'tabular-nums text-[9px] sm:text-[10px]',
                statusFilter === s ? 'text-primary/70' : 'text-muted-foreground/60'
              )}>
                {s === 'Tous' ? stats.total : s === 'Actif' ? stats.actifs : s === 'Suspendu' ? stats.suspendus : stats.termines}
              </span>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {showSearch ? (
            <div className="relative flex-1 sm:flex-initial">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50" />
              <input
                autoFocus
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onBlur={() => { if (!search) setShowSearch(false) }}
                className="h-8 w-full rounded-lg border border-border/60 bg-card pl-9 pr-3 text-xs outline-none transition-all placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 sm:h-9 sm:w-56 sm:rounded-xl sm:text-sm"
              />
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:size-9 sm:rounded-xl"
            >
              <Search className="size-4" />
            </button>
          )}

          <button
            onClick={() => setShowPrestations(true)}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:size-9 sm:rounded-xl"
            title="Gérer les prestations"
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

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-4 text-xs text-muted-foreground">Chargement…</div>
      )}

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-border/50 bg-card shadow-[var(--shadow-sm)] md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <SortTh label="Entreprise" col="entreprise" />
                <SortTh label="HT/mois" col="montantHT" />
                <SortTh label="Statut" col="statut" />
                <SortTh label="Début" col="dateDebut" />
                <SortTh label="Fin" col="dateFin" />
                <SortTh label="Email" col="mail" className="hidden lg:table-cell" />
                <SortTh label="Prestation" col="prestation" />
                <th className="w-20 px-2 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.map((c) => {
                const expiring = isExpiringSoon(c)
                return (
                <tr
                  key={c.id}
                  className={cn(
                    'transition-colors hover:bg-muted/20',
                    expiring && 'bg-amber-500/5 hover:bg-amber-500/10'
                  )}
                >
                  <td className="px-4 py-3.5 text-[15px] font-semibold text-foreground whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {expiring && (
                        <span title={`J-${daysLeft(c.dateFin)}`}>
                          <AlertTriangle className="size-3.5 shrink-0 text-amber-500" />
                        </span>
                      )}
                      {c.entreprise}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 tabular-nums text-[15px] font-bold text-foreground whitespace-nowrap">
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
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground whitespace-nowrap">
                      <Calendar className="size-3 shrink-0 text-muted-foreground/40" />
                      {c.dateDebut || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn(
                      'inline-flex items-center gap-1.5 whitespace-nowrap',
                      expiring ? 'font-semibold text-amber-600 dark:text-amber-400' : 'text-muted-foreground'
                    )}>
                      <Calendar className={cn('size-3 shrink-0', expiring ? 'text-amber-500' : 'text-muted-foreground/40')} />
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
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-muted-foreground/60">
                    Aucun contrat trouvé.
                  </td>
                </tr>
              )}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr className="border-t border-border/50 bg-muted/20">
                  <td className="px-4 py-3 text-xs font-medium text-muted-foreground whitespace-nowrap">
                    Total — {filtered.length} contrat{filtered.length > 1 ? 's' : ''}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-sm font-bold text-foreground whitespace-nowrap">
                    {fmt(filteredTotal)} €
                  </td>
                  <td colSpan={6} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Mobile list — dense, scannable */}
      <div className="md:hidden">
        {/* Column header */}
        <div className="mb-1 flex items-center px-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
          <span className="flex-1">Entreprise</span>
          <span className="w-20 text-right">HT/mois</span>
          <span className="w-20 text-right">Statut</span>
        </div>

        <div className="overflow-hidden rounded-xl border border-border/50 bg-card">
          {filtered.map((c, i) => {
            const expiring = isExpiringSoon(c)
            return (
              <div
                key={c.id}
                className={cn(
                  'group',
                  i > 0 && 'border-t border-border/30',
                  expiring && 'bg-amber-500/5',
                )}
              >
                {/* Main row — always visible */}
                <button
                  className="flex w-full items-center px-3 py-2.5 text-left active:bg-muted/30"
                  onClick={() => setExpandedMobile(expandedMobile === c.id ? null : c.id)}
                >
                  {/* Entreprise */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      {expiring && <AlertTriangle className="size-3 shrink-0 text-amber-500" />}
                      <span className="truncate text-[13px] font-semibold text-foreground">{c.entreprise}</span>
                    </div>
                    {expiring && (
                      <p className="mt-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                        J-{daysLeft(c.dateFin)}
                      </p>
                    )}
                  </div>
                  {/* Montant */}
                  <span className="w-20 shrink-0 text-right text-[13px] font-bold tabular-nums text-foreground">
                    {fmt(c.montantHT)}€
                  </span>
                  {/* Statut badge */}
                  <span className="ml-2 w-20 shrink-0 text-right">
                    <span className={cn(
                      'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium',
                      statusColors[c.statut]
                    )}>
                      <span className={cn('size-1.5 rounded-full', statusDot[c.statut])} />
                      {c.statut}
                    </span>
                  </span>
                </button>

                {/* Expanded details — tap to reveal */}
                <AnimatePresence>
                  {expandedMobile === c.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border/20 bg-muted/10 px-3 py-2.5">
                        <div className="grid grid-cols-3 gap-2 text-[11px]">
                          <div>
                            <p className="text-muted-foreground/50">Prestation</p>
                            <p className="font-medium text-foreground">{c.prestation || '—'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground/50">Début</p>
                            <p className="font-medium text-foreground">{c.dateDebut || '—'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground/50">Fin</p>
                            <p className={cn(
                              'font-medium',
                              expiring ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'
                            )}>{c.dateFin || '—'}</p>
                          </div>
                        </div>
                        {/* Quick actions */}
                        <div className="mt-2 flex items-center gap-1 border-t border-border/20 pt-2">
                          {c.mail && (
                            <a
                              href={`mailto:${c.mail}`}
                              className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] text-muted-foreground active:bg-muted"
                            >
                              <Mail className="size-3.5" />
                              Email
                            </a>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); openEdit(c) }}
                            className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] text-muted-foreground active:bg-muted"
                          >
                            <Pencil className="size-3.5" />
                            Modifier
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteId(c.id) }}
                            className="ml-auto flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] text-red-500 active:bg-red-500/10"
                          >
                            <Trash2 className="size-3.5" />
                            Suppr.
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16">
            <div className="flex size-14 items-center justify-center rounded-3xl bg-muted/50">
              <FileText className="size-7 text-muted-foreground/40" />
            </div>
            <p className="text-sm text-muted-foreground/60">Aucun contrat trouvé.</p>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="mt-2 flex items-center justify-between rounded-xl bg-muted/30 px-3 py-2.5 text-xs">
            <span className="text-muted-foreground">{filtered.length} contrat{filtered.length > 1 ? 's' : ''}</span>
            <span className="font-bold tabular-nums text-foreground">{fmt(filteredTotal)} € HT</span>
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
