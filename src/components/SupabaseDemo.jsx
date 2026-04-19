import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

export default function SupabaseDemo() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function getTodos() {
      try {
        const { data: todos, error } = await supabase.from('todos').select()
        if (error) throw error
        if (todos) {
          setTodos(todos)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    getTodos()
  }, [])

  if (loading) return <div>Loading todos...</div>
  if (error) return <div>Error: {error} (Make sure a 'todos' table exists in your Supabase project)</div>

  return (
    <div className="p-4 border rounded-lg bg-gray-900 text-white mt-4">
      <h2 className="text-xl font-bold mb-2">Supabase Todo Demo</h2>
      <ul className="list-disc pl-5">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <li key={todo.id}>{todo.name || todo.title}</li>
          ))
        ) : (
          <li>No todos found.</li>
        )}
      </ul>
    </div>
  )
}
