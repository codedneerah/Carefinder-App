import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Todo = {
  id: string | number;
  name?: string;
};

export function SupabaseTodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getTodos() {
      try {
        if (!supabase) {
          setError("Supabase is not configured (missing env vars). ");
          return;
        }

        const { data, error: queryError } = await supabase
          .from("todos")
          .select("id, name");

        if (queryError) throw queryError;
        setTodos((data ?? []) as Todo[]);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    }

    void getTodos();
  }, []);

  if (loading) {
    return (
      <section className="page">
        <h1>Supabase Todos</h1>
        <p>Loading…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page">
        <h1>Supabase Todos</h1>
        <p style={{ color: "#b42318" }}>{error}</p>
      </section>
    );
  }

  return (
    <section className="page">
      <h1>Supabase Todos</h1>
      {todos.length ? (
        <ul>
          {todos.map((todo) => (
            <li key={String(todo.id)}>{todo.name ?? "(no name)"}</li>
          ))}
        </ul>
      ) : (
        <p>No todos found.</p>
      )}
    </section>
  );
}

