import React, { useState, useReducer } from 'react';
import './TodoList.css';

const FILTERS = ['all', 'active', 'completed'];

function todosReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [
        ...state,
        { id: Date.now(), text: action.text.trim(), done: false, createdAt: new Date().toLocaleString() },
      ];
    case 'TOGGLE':
      return state.map(t => t.id === action.id ? { ...t, done: !t.done } : t);
    case 'DELETE':
      return state.filter(t => t.id !== action.id);
    case 'EDIT':
      return state.map(t => t.id === action.id ? { ...t, text: action.text } : t);
    case 'CLEAR_COMPLETED':
      return state.filter(t => !t.done);
    default:
      return state;
  }
}

const initialTodos = [
  { id: 1, text: 'Set up Jenkins pipeline', done: true, createdAt: 'Today' },
  { id: 2, text: 'Write unit tests', done: true, createdAt: 'Today' },
  { id: 3, text: 'Deploy to staging', done: false, createdAt: 'Today' },
  { id: 4, text: 'Run E2E tests', done: false, createdAt: 'Today' },
];

function TodoList() {
  const [todos, dispatch] = useReducer(todosReducer, initialTodos);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  const addTodo = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    dispatch({ type: 'ADD', text: input });
    setInput('');
  };

  const startEdit = (todo) => {
    setEditId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id) => {
    if (editText.trim()) dispatch({ type: 'EDIT', id, text: editText.trim() });
    setEditId(null);
  };

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.done;
    if (filter === 'completed') return t.done;
    return true;
  });

  const activeCount = todos.filter(t => !t.done).length;
  const completedCount = todos.filter(t => t.done).length;

  return (
    <div className="todo-page">
      <div className="page-header">
        <h1>To-Do List</h1>
        <p>Track your tasks &mdash; {activeCount} remaining, {completedCount} done</p>
      </div>

      <div className="card">
        <form className="todo-form" onSubmit={addTodo}>
          <input
            type="text"
            className="todo-input"
            placeholder="Add a new task..."
            value={input}
            onChange={e => setInput(e.target.value)}
            aria-label="New task input"
          />
          <button type="submit" className="btn-primary" aria-label="Add task">Add</button>
        </form>
      </div>

      <div className="filter-bar">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'all' && <span className="filter-count">{todos.length}</span>}
            {f === 'active' && <span className="filter-count">{activeCount}</span>}
            {f === 'completed' && <span className="filter-count">{completedCount}</span>}
          </button>
        ))}
        {completedCount > 0 && (
          <button
            className="filter-btn clear-btn"
            onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })}
          >
            Clear completed
          </button>
        )}
      </div>

      <ul className="todo-list">
        {filtered.length === 0 && (
          <li className="todo-empty">No tasks here. {filter === 'all' ? 'Add one above!' : ''}</li>
        )}
        {filtered.map(todo => (
          <li key={todo.id} className={`todo-item ${todo.done ? 'done' : ''}`}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => dispatch({ type: 'TOGGLE', id: todo.id })}
              className="todo-check"
              aria-label={`Mark "${todo.text}" as ${todo.done ? 'incomplete' : 'complete'}`}
            />
            {editId === todo.id ? (
              <input
                className="todo-edit-input"
                value={editText}
                onChange={e => setEditText(e.target.value)}
                onBlur={() => saveEdit(todo.id)}
                onKeyDown={e => e.key === 'Enter' && saveEdit(todo.id)}
                autoFocus
                aria-label="Edit task"
              />
            ) : (
              <span
                className="todo-text"
                onDoubleClick={() => startEdit(todo)}
                title="Double-click to edit"
              >
                {todo.text}
              </span>
            )}
            <span className="todo-date">{todo.createdAt}</span>
            <div className="todo-actions">
              <button
                className="icon-btn"
                onClick={() => startEdit(todo)}
                aria-label="Edit task"
                title="Edit"
              >&#9998;</button>
              <button
                className="icon-btn danger"
                onClick={() => dispatch({ type: 'DELETE', id: todo.id })}
                aria-label="Delete task"
                title="Delete"
              >&#10005;</button>
            </div>
          </li>
        ))}
      </ul>

      {todos.length > 0 && (
        <div className="todo-stats">
          <span className="badge badge-info">{todos.length} total</span>
          <span className="badge badge-success">{completedCount} done</span>
          <span className="badge badge-warning">{activeCount} remaining</span>
          <span className="progress-bar-wrap">
            <span
              className="progress-bar-fill"
              style={{ width: `${todos.length ? (completedCount / todos.length) * 100 : 0}%` }}
            />
          </span>
          <span className="progress-pct">{todos.length ? Math.round((completedCount / todos.length) * 100) : 0}%</span>
        </div>
      )}
    </div>
  );
}

export default TodoList;
