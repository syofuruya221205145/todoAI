import { useEffect, useState } from "react"

type Todo = {
  id: string
  title: string
  completed: boolean
  mood?: number
}

function parseStoredTodos(raw: string | null): Todo[] {
  if (!raw) return []
  try {
    const data = JSON.parse(raw) as unknown
    if (!Array.isArray(data)) return []
    return data.map((item): Todo => {
      const o = item as Partial<Todo> & { id?: string }
      const mood =
        typeof o.mood === "number" &&
        Number.isInteger(o.mood) &&
        o.mood >= 1 &&
        o.mood <= 5
          ? o.mood
          : undefined
      return {
        id: o.id && typeof o.id === "string" ? o.id : crypto.randomUUID(),
        title: typeof o.title === "string" ? o.title : "",
        completed: Boolean(o.completed),
        ...(mood !== undefined ? { mood } : {}),
      }
    })
  } catch {
    return []
  }
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() =>
    parseStoredTodos(localStorage.getItem("todos"))
  )
  const [text, setText] = useState("")
  const [showCompleted, setShowCompleted] = useState(true)
  const [moodTargetId, setMoodTargetId] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (text.trim() === "") return
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: text.trim(),
      completed: false,
    }
    setTodos((prev) => [...prev, newTodo])
    setText("")
  }

  const toggleTodo = (id: string) => {
    const todo = todos.find((t) => t.id === id)
    if (!todo) return
    if (todo.completed) {
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, completed: false, mood: undefined } : t
        )
      )
      return
    }
    setMoodTargetId(id)
  }

  const completeWithMood = (mood: 1 | 2 | 3 | 4 | 5) => {
    if (!moodTargetId) return
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === moodTargetId
          ? { ...todo, completed: true, mood }
          : todo
      )
    )
    setMoodTargetId(null)
  }

  const cancelMoodPicker = () => setMoodTargetId(null)

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  const moodEmoji = (mood?: number) => {
    switch (mood) {
      case 1:
        return "😫"
      case 2:
        return "😢"
      case 3:
        return "😐"
      case 4:
        return "😊"
      case 5:
        return "😄"
      default:
        return ""
    }
  }

  const activeTodos = todos.filter((t) => !t.completed)
  const completedTodos = todos.filter((t) => t.completed)

  const moodTargetTitle =
    todos.find((t) => t.id === moodTargetId)?.title ?? ""

  const renderTodoCard = (todo: Todo) => (
    <div
      key={todo.id}
      className={`rounded-xl border p-4 shadow-sm transition ${
        todo.completed
          ? "border-slate-600/60 bg-slate-800/40"
          : "border-violet-500/25 bg-slate-800/70 hover:border-violet-400/40"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p
            className={`text-lg font-semibold ${
              todo.completed ? "text-slate-500 line-through" : "text-slate-100"
            }`}
          >
            {todo.title}
          </p>
          {todo.completed && todo.mood !== undefined && (
            <p className="mt-1 text-sm text-slate-400">
              気分: {todo.mood} {moodEmoji(todo.mood)}
            </p>
          )}
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => toggleTodo(todo.id)}
            className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-violet-500"
          >
            {todo.completed ? "未完了に戻す" : "完了"}
          </button>
          <button
            type="button"
            onClick={() => deleteTodo(todo.id)}
            className="rounded-lg border border-slate-500/80 bg-slate-800 px-3 py-2 text-sm text-slate-200 transition hover:border-rose-400/60 hover:text-rose-200"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl shadow-violet-900/20 backdrop-blur-md sm:p-8">
        <h1 className="mb-2 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          感情ログTodo
        </h1>
        <p className="mb-8 text-center text-sm text-slate-400">
          完了時に気分を1〜5で記録します
        </p>

        <div className="mb-8 flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="Todoを入力"
            className="min-w-0 flex-1 rounded-xl border border-slate-600 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none ring-violet-500/40 placeholder:text-slate-500 focus:border-violet-500 focus:ring-2"
          />
          <button
            type="button"
            onClick={addTodo}
            className="shrink-0 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:bg-violet-500 active:scale-[0.98]"
          >
            追加
          </button>
        </div>

        {todos.length === 0 ? (
          <p className="text-center text-slate-500">Todoがまだありません</p>
        ) : (
          <div className="space-y-8">
            <section className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                進行中 ({activeTodos.length})
              </h2>
              {activeTodos.length === 0 ? (
                <p className="text-sm text-slate-500">進行中のTodoはありません</p>
              ) : (
                <div className="space-y-3">{activeTodos.map(renderTodoCard)}</div>
              )}
            </section>

            {completedTodos.length > 0 && (
              <section className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    完了 ({completedTodos.length})
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowCompleted((v) => !v)}
                    className="rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-violet-500/50 hover:text-white"
                  >
                    {showCompleted ? "完了を隠す" : "完了を表示"}
                  </button>
                </div>
                {showCompleted && (
                  <div className="space-y-3">
                    {completedTodos.map(renderTodoCard)}
                  </div>
                )}
              </section>
            )}
          </div>
        )}
      </div>

      {moodTargetId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mood-dialog-title"
        >
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <h3
              id="mood-dialog-title"
              className="text-center text-lg font-semibold text-white"
            >
              今の気分は？
            </h3>
            <p className="mt-2 line-clamp-2 text-center text-sm text-slate-400">
              「{moodTargetTitle}」を完了します
            </p>
            <p className="mt-1 text-center text-xs text-slate-500">
              1（つらい）〜 5（最高）
            </p>
            <div className="mt-6 grid grid-cols-5 gap-2">
              {([1, 2, 3, 4, 5] as const).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => completeWithMood(n)}
                  className="flex flex-col items-center gap-1 rounded-xl border border-slate-600 bg-slate-800 py-3 text-sm font-medium text-slate-200 transition hover:border-violet-500 hover:bg-violet-600/20 hover:text-white"
                >
                  <span className="text-xl">{moodEmoji(n)}</span>
                  <span>{n}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={cancelMoodPicker}
              className="mt-4 w-full rounded-xl border border-slate-600 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
