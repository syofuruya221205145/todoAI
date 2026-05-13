import { useEffect, useState } from "react"

type Todo = {
  title: string
  completed: boolean
  mood?: string
}

function App() {
  // LocalStorageから初期読み込み
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos =
      localStorage.getItem("todos")

    return savedTodos
      ? JSON.parse(savedTodos)
      : []
  })

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

    // 未完了 → 完了時だけ感情入力
    if (!currentTodo.completed) {
      const mood = prompt(
        "今の気分を入力してください 😊 😫 😐"
      )

      currentTodo.mood = mood || ""
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

  return (
    <div>
      <h1>感情ログTodo</h1>

      {/* 入力欄 */}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* 追加ボタン */}
      <button onClick={addTodo}>
        追加
      </button>

      {/* Todo一覧 */}
      {todos.map((todo, index) => (
        <div key={index}>
          <p>
            {todo.title}
            {todo.completed ? " ✅" : ""}
          </p>

          {/* 気分表示 */}
          {todo.mood && (
            <p>
              気分: {todo.mood}
            </p>
          )}

          {/* 完了ボタン */}
          <button
            onClick={() => toggleTodo(index)}
          >
            完了
          </button>

          {/* 削除ボタン */}
          <button
            onClick={() => deleteTodo(index)}
          >
            削除
          </button>
        </div>
      ))}
    </div>
  )
}

export default App