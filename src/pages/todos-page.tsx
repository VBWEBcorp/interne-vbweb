import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Circle, ListTodo, Plus, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { type Todo, todosApi } from '@/lib/api'
import { cn } from '@/lib/utils'

type Priority = Todo['priority']

const STORAGE_KEY = 'vbweb-todos'

function readCachedTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Todo[]) : []
  } catch {
    return []
  }
}

function writeCachedTodos(todos: Todo[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  } catch {
    // localStorage may be unavailable (private mode, quota); ignore silently
  }
}

function newLocalId() {
  return (
    (typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2)) + '-local'
  )
}

export function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>(() => readCachedTodos())
  const [input, setInput] = useState('')
  const [inputPriority, setInputPriority] = useState<Priority>('normal')

  // Persist every change to localStorage
  useEffect(() => { writeCachedTodos(todos) }, [todos])

  // Best-effort background sync with the API (no spinner, no blocking)
  useEffect(() => {
    let cancelled = false
    todosApi.list()
      .then((remote) => { if (!cancelled && remote.length > 0) setTodos(remote) })
      .catch(() => { /* offline / no backend — keep local cache */ })
    return () => { cancelled = true }
  }, [])

  function add() {
    const text = input.trim()
    if (!text) return
    const optimistic: Todo = { id: newLocalId(), text, done: false, priority: inputPriority }
    setTodos((prev) => [optimistic, ...prev])
    setInput('')
    todosApi.create({ text, done: false, priority: inputPriority })
      .then((created) => setTodos((prev) => prev.map((t) => (t.id === optimistic.id ? created : t))))
      .catch(() => { /* keep optimistic entry as the source of truth */ })
  }

  function toggle(id: string) {
    const todo = todos.find((t) => t.id === id)
    if (!todo) return
    const next: Todo = { ...todo, done: !todo.done }
    setTodos((prev) => prev.map((t) => (t.id === id ? next : t)))
    if (id.endsWith('-local')) return
    todosApi.update(id, { text: next.text, done: next.done, priority: next.priority })
      .then((updated) => setTodos((prev) => prev.map((t) => (t.id === id ? updated : t))))
      .catch(() => { /* keep local state */ })
  }

  function remove(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id))
    if (id.endsWith('-local')) return
    todosApi.remove(id).catch(() => { /* keep local state */ })
  }

  const normalTodos = useMemo(() => todos.filter((t) => t.priority === 'normal'), [todos])
  const prioritaireTodos = useMemo(() => todos.filter((t) => t.priority === 'prioritaire'), [todos])

  const normalActive = normalTodos.filter((t) => !t.done).length
  const prioritaireActive = prioritaireTodos.filter((t) => !t.done).length

  return (
    <div className="mx-auto max-w-3xl px-3 py-4 sm:px-4 sm:py-10">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2 sm:mb-6">
        <div className="hidden sm:flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5">
          <ListTodo className="size-5 text-primary" />
        </div>
        <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-3xl">
          To-do list
        </h1>
        {(normalActive + prioritaireActive) > 0 && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-primary sm:text-xs">
            {normalActive + prioritaireActive}
          </span>
        )}
      </div>

      {/* Input */}
      <form onSubmit={(e) => { e.preventDefault(); add() }} className="mb-4 flex gap-1.5 sm:mb-6 sm:gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nouvelle tâche..."
          className="h-9 min-w-0 flex-1 rounded-lg border border-border/60 bg-card px-3 text-xs text-foreground shadow-[var(--shadow-xs)] outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 sm:h-11 sm:rounded-xl sm:px-4 sm:text-sm"
        />
        {/* Priority toggle */}
        <button
          type="button"
          onClick={() => setInputPriority((p) => p === 'normal' ? 'prioritaire' : 'normal')}
          className={cn(
            'shrink-0 rounded-lg px-2.5 text-[10px] font-semibold uppercase tracking-wide transition-all sm:rounded-xl sm:px-3 sm:text-[11px]',
            inputPriority === 'prioritaire'
              ? 'bg-red-500/10 text-red-600 ring-1 ring-red-500/20 dark:text-red-400'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {inputPriority === 'prioritaire' ? 'P' : 'N'}
        </button>
        <button
          type="submit"
          disabled={!input.trim()}
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-90 disabled:opacity-30 sm:size-11 sm:rounded-xl"
        >
          <Plus className="size-4" />
        </button>
      </form>

      {/* Two columns side by side */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        {/* Normal column */}
        <Column
          title="Normal"
          count={normalActive}
          items={normalTodos}
          color="primary"
          onToggle={toggle}
          onRemove={remove}
        />

        {/* Prioritaire column */}
        <Column
          title="Prioritaire"
          count={prioritaireActive}
          items={prioritaireTodos}
          color="red"
          onToggle={toggle}
          onRemove={remove}
        />
      </div>
    </div>
  )
}

function Column({
  title,
  count,
  items,
  color,
  onToggle,
  onRemove,
}: {
  title: string
  count: number
  items: Todo[]
  color: 'primary' | 'red'
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}) {
  const headerColor = color === 'red'
    ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
    : 'bg-primary/10 text-primary border-primary/20'

  return (
    <div className="flex flex-col">
      {/* Column header */}
      <div className={cn(
        'mb-2 flex items-center justify-between rounded-lg border px-2.5 py-1.5 sm:rounded-xl sm:px-3 sm:py-2',
        headerColor
      )}>
        <span className="text-[11px] font-semibold uppercase tracking-wide sm:text-xs">{title}</span>
        <span className="text-[10px] font-bold tabular-nums sm:text-[11px]">{count}</span>
      </div>

      {/* Items */}
      <div className="overflow-hidden rounded-lg border border-border/50 bg-card sm:rounded-xl">
        <AnimatePresence initial={false}>
          {items.map((todo, i) => (
            <motion.div
              key={todo.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              className={cn(i > 0 && 'border-t border-border/30')}
            >
              <div className={cn(
                'group flex items-start gap-1.5 px-2 py-2 sm:gap-2 sm:px-3 sm:py-2.5',
                todo.done && 'opacity-40'
              )}>
                <button
                  onClick={() => onToggle(todo.id)}
                  className="mt-0.5 shrink-0 transition-transform active:scale-90"
                >
                  {todo.done ? (
                    <CheckCircle2 className="size-4 text-emerald-500 sm:size-5" strokeWidth={2} />
                  ) : (
                    <Circle className={cn(
                      'size-4 sm:size-5',
                      color === 'red' ? 'text-red-300 hover:text-red-500' : 'text-border hover:text-primary/60'
                    )} strokeWidth={1.5} />
                  )}
                </button>

                <span className={cn(
                  'min-w-0 flex-1 break-words text-[11px] leading-snug sm:text-[13px]',
                  todo.done ? 'text-muted-foreground/50 line-through' : 'text-foreground'
                )}>
                  {todo.text}
                </span>

                <button
                  onClick={() => onRemove(todo.id)}
                  className="mt-0.5 shrink-0 rounded p-1 text-muted-foreground/20 transition-all active:bg-destructive/10 active:text-destructive sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {items.length === 0 && (
          <p className="py-8 text-center text-[10px] text-muted-foreground/40 sm:py-12 sm:text-xs">
            Vide
          </p>
        )}
      </div>
    </div>
  )
}
