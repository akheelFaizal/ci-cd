import React, { useState } from "react";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";

function App() {
  const [todos, setTodos] = useState([]); 

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
    };
    setTodos([...todos, newTodo]);
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div className="app">
      <div className="container">
        <h1>My Todo App</h1>
        <TodoForm onAddTodo={addTodo} />
        <TodoList
          todos={todos}
          onDeleteTodo={deleteTodo}
          onToggleTodo={toggleTodo}
        />
      </div>
    </div>
  );
}

export default App;
