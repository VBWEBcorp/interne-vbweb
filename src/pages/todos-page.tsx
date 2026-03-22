import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Circle, Plus, Sparkles, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'

import { cn } from '@/lib/utils'

type Todo = {
  id: string
  text: string
  done: boolean
  createdAt: number
}

let nextId = 0
function uid() {
  return String(++nextId)
}

type Filter = 'all' | 'active' | 'done'

export function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  function add() {
    const text = input.trim()
    if (!text) return
    setTodos((prev) => [{ id: uid(), text, done: false, createdAt: Date.now() }, ...prev])
    setInput('')
  }

  function toggle(id: string) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    )
  }

  function remove(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  function clearDone() {
    setTodos((prev) => prev.filter((t) => !t.done))
  }

  const filtered = useMemo(() => {
    if (filter === 'active') return todos.filter((t) => !t.done)
    if (filter === 'done') return todos.filter((t) => t.done)
    return todos
  }, [todos, filter])

  const activeCount = todos.filter((t) => !t.done).length
  const doneCount = todos.filter((t) => t.done).length

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: 'all', label: 'Toutes', count: todos.length },
    { key: 'active', label: 'En cours', count: activeCount },
    { key: 'done', label: 'Faites', count: doneCount },
  ]

  return (
    <div className="mx-auto max-w-xl px-4 py-6 sm:py-10">
      {/* Hero header */}
      <div className="mb-8">
        <div className="mb-1 flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5">
            <Sparkles className="size-5 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Tâches
          </h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {activeCount === 0
            ? 'Rien à faire — profite !'
            : `${activeCount} tâche${activeCount > 1 ? 's' : ''} en cours`}
        </p>
      </div>

      {/* Input — premium pill style */}
      <form
        onSubmit={(e) => { e.preventDefault(); add() }}
        className="group relative mb-8"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ajouter une tâche..."
          className="h-12 w-full rounded-2xl border border-border/60 bg-card pl-5 pr-14 text-sm text-foreground shadow-[var(--shadow-sm)] outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary/40 focus:shadow-[var(--shadow-md)] focus:ring-2 focus:ring-primary/10 sm:h-14 sm:pl-6 sm:text-base"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-90 disabled:opacity-30 disabled:shadow-none sm:size-10 sm:rounded-xl"
        >
          <Plus className="size-4 sm:size-5" />
        </button>
      </form>

      {/* Filter pills */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex gap-1.5">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all',
                filter === f.key
                  ? 'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {f.label}
              <span className={cn(
                'tabular-nums text-[10px]',
                filter === f.key ? 'text-primary/70' : 'text-muted-foreground/60'
              )}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {doneCount > 0 && (
          <button
            onClick={clearDone}
            className="rounded-full px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            Vider
          </button>
        )}
      </div>

      {/* List */}
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {filtered.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className={cn(
                  'group flex items-center gap-3.5 rounded-2xl border border-border/50 bg-card px-4 py-3.5 shadow-[var(--shadow-xs)] transition-all sm:px-5 sm:py-4',
                  todo.done ? 'bg-muted/20' : 'hover:shadow-[var(--shadow-sm)] hover:border-border'
                )}
              >
                <button
                  onClick={() => toggle(todo.id)}
                  className="shrink-0 transition-transform active:scale-90"
                  aria-label={todo.done ? 'Marquer non fait' : 'Marquer fait'}
                >
                  {todo.done ? (
                    <CheckCircle2 className="size-6 text-emerald-500" strokeWidth={2} />
                  ) : (
                    <Circle className="size-6 text-border hover:text-primary/60" strokeWidth={1.5} />
                  )}
                </button>

                <span
                  className={cn(
                    'min-w-0 flex-1 text-[15px] leading-relaxed break-words',
                    todo.done
                      ? 'text-muted-foreground/50 line-through'
                      : 'text-foreground'
                  )}
                >
                  {todo.text}
                </span>

                <button
                  onClick={() => remove(todo.id)}
                  className="shrink-0 rounded-xl p-2 text-muted-foreground/30 transition-all hover:bg-destructive/10 hover:text-destructive active:scale-90 sm:opacity-0 sm:group-hover:opacity-100"
                  aria-label="Supprimer"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3 py-16 text-center"
          >
            <div className="flex size-14 items-center justify-center rounded-3xl bg-muted/50">
              <CheckCircle2 className="size-7 text-muted-foreground/40" />
            </div>
            <p className="text-sm text-muted-foreground/60">
              {filter === 'done' ? 'Aucune tâche terminée.' : filter === 'active' ? 'Tout est fait !' : 'Ajoutez votre première tâche.'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
