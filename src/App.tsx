import { useEffect, useState } from "react" 

// todoの内容の型を定義
type Todo = {
  title: string //タイトル
  completed: boolean // 達成したかどうか
  mood?: number // 満足度
}

function App() {
  // LocalStorageから初期読み込み
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos =
      localStorage.getItem("todos") // 初期値はtodosで更新,stringで返却 or NULL

    return savedTodos
      ? JSON.parse(savedTodos) // saveTodosに中身があるならJSON変換
      : [] // saveTodosがNULLなら空配列を返す
  })
// ここまで5/13

  // input管理
  const [text, setText] = useState("")

  // todos変更時に保存
  useEffect(() => {
    localStorage.setItem(
      "todos",
      JSON.stringify(todos)
    )
  }, [todos])

  // Todo追加
  const addTodo = () => {
    if (text === "") return

    const newTodo: Todo = {
      title: text,
      completed: false
    }

    setTodos([...todos, newTodo])

    setText("")
  }

  // 完了切り替え
  const toggleTodo = (index: number) => {
    const newTodos = [...todos]

    const currentTodo = newTodos[index]

    // 未完了 → 完了時だけ気分入力
    if (!currentTodo.completed) {
      const mood = Number(
        prompt(
          "今の気分を1〜5で入力してください\n1: 😫 〜 5: 😄"
        )
      )

      // 1〜5だけ許可
      if (mood >= 1 && mood <= 5) {
        currentTodo.mood = mood
      }
    }

    // true / false反転
    currentTodo.completed =
      !currentTodo.completed

    setTodos(newTodos)
  }

  // 削除
  const deleteTodo = (index: number) => {
    const newTodos = todos.filter(
      (_, i) => i !== index
    )

    setTodos(newTodos)
  }

  // 数字 → 絵文字変換
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-lg">
        {/* タイトル */}
        <h1 className="mb-6 text-center text-4xl font-bold">
          感情ログTodo
        </h1>

        {/* 入力欄 */}
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Todoを入力"
            className="flex-1 rounded-lg border p-3 outline-none focus:ring-2"
          />

          <button
            onClick={addTodo}
            className="rounded-lg border px-5 py-3 font-bold transition hover:scale-105"
          >
            追加
          </button>
        </div>

        {/* Todo一覧 */}
        <div className="space-y-4">
          {todos.map((todo, index) => (
            <div
              key={index}
              className="rounded-xl border bg-gray-50 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-lg font-semibold ${
                      todo.completed
                        ? "text-gray-400 line-through"
                        : ""
                    }`}
                  >
                    {todo.title}
                  </p>

                  {/* 気分表示 */}
                  {todo.mood && (
                    <p className="mt-1 text-sm text-gray-600">
                      気分:
                      {" "}
                      {todo.mood}
                      {" "}
                      {moodEmoji(todo.mood)}
                    </p>
                  )}
                </div>

                {/* ボタン */}
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleTodo(index)}
                    className="rounded-lg border px-3 py-2 text-sm transition hover:scale-105"
                  >
                    完了
                  </button>

                  <button
                    onClick={() => deleteTodo(index)}
                    className="rounded-lg border px-3 py-2 text-sm transition hover:scale-105"
                  >
                    削除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Todoがない時 */}
        {todos.length === 0 && (
          <p className="mt-6 text-center text-gray-500">
            Todoがまだありません
          </p>
        )}
      </div>
    </div>
  )
}

export default App