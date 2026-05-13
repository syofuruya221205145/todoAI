import { useEffect, useState } from "react"

type Todo = {
  title: string
  completed: boolean
  mood?: string
}

function App() {
  // Todo一覧
  const [todos, setTodos] = useState<Todo[]>([])

  // 入力欄
  const [text, setText] = useState("")

  // 初回読み込み
  useEffect(() => {
    const savedTodos =
      localStorage.getItem("todos")

    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  // todosが変わるたび保存
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

    if (!currentTodo.completed) {
      const mood = prompt(
        "今の気分を入力してください 😊 😫 😐"
      )

      currentTodo.mood = mood || ""
    }

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

      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={addTodo}>
        追加
      </button>

      {todos.map((todo, index) => (
        <div key={index}>
          <p>
            {todo.title}
            {todo.completed ? " ✅" : ""}
          </p>

          {todo.mood && (
            <p>
              気分: {todo.mood}
            </p>
          )}

          <button
            onClick={() => toggleTodo(index)}
          >
            完了
          </button>

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