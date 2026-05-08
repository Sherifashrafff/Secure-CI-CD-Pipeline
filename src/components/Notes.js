import React, { useState } from 'react';
import './Notes.css';

const COLORS = ['#e94560', '#2196f3', '#4caf50', '#ff9800', '#9c27b0'];

const initialNotes = [
  {
    id: 1,
    title: 'Jenkins Pipeline Tips',
    body: 'Use parallel stages to speed up your pipeline. Always archive test results.',
    color: '#2196f3',
    createdAt: new Date().toLocaleString(),
    pinned: true,
  },
  {
    id: 2,
    title: 'Docker Best Practices',
    body: 'Keep images small. Use multi-stage builds. Never run as root.',
    color: '#4caf50',
    createdAt: new Date().toLocaleString(),
    pinned: false,
  },
];

function Notes() {
  const [notes, setNotes] = useState(initialNotes);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const addNote = (e) => {
    e.preventDefault();
    if (!title.trim() && !body.trim()) return;
    const note = {
      id: Date.now(),
      title: title.trim() || 'Untitled',
      body: body.trim(),
      color,
      createdAt: new Date().toLocaleString(),
      pinned: false,
    };
    setNotes(prev => [note, ...prev]);
    setTitle('');
    setBody('');
    setColor(COLORS[0]);
    setShowForm(false);
  };

  const deleteNote = (id) => setNotes(prev => prev.filter(n => n.id !== id));

  const togglePin = (id) =>
    setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));

  const filtered = notes.filter(n => {
    const q = search.toLowerCase();
    return n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q);
  });

  const pinned = filtered.filter(n => n.pinned);
  const rest = filtered.filter(n => !n.pinned);

  return (
    <div className="notes-page">
      <div className="page-header">
        <h1>Notes</h1>
        <p>{notes.length} note{notes.length !== 1 ? 's' : ''} saved</p>
      </div>

      <div className="notes-toolbar">
        <input
          className="notes-search"
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search notes"
        />
        <button className="btn-primary" onClick={() => setShowForm(v => !v)} aria-label="New note">
          {showForm ? 'Cancel' : '+ New Note'}
        </button>
      </div>

      {showForm && (
        <form className="card note-form" onSubmit={addNote}>
          <h3>New Note</h3>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="note-title-input"
            aria-label="Note title"
          />
          <textarea
            placeholder="Write your note here..."
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={4}
            className="note-body-input"
            aria-label="Note body"
          />
          <div className="note-form-footer">
            <div className="color-picker" role="group" aria-label="Note color">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  className={`color-dot ${color === c ? 'selected' : ''}`}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
            <button type="submit" className="btn-primary">Save Note</button>
          </div>
        </form>
      )}

      {pinned.length > 0 && (
        <>
          <div className="notes-section-label">Pinned</div>
          <div className="notes-grid">
            {pinned.map(note => <NoteCard key={note.id} note={note} onDelete={deleteNote} onPin={togglePin} />)}
          </div>
        </>
      )}

      {rest.length > 0 && (
        <>
          {pinned.length > 0 && <div className="notes-section-label">Others</div>}
          <div className="notes-grid">
            {rest.map(note => <NoteCard key={note.id} note={note} onDelete={deleteNote} onPin={togglePin} />)}
          </div>
        </>
      )}

      {filtered.length === 0 && (
        <div className="notes-empty">
          {search ? `No notes match "${search}"` : 'No notes yet. Create one above!'}
        </div>
      )}
    </div>
  );
}

function NoteCard({ note, onDelete, onPin }) {
  return (
    <div className="note-card" style={{ borderTopColor: note.color }} role="article">
      <div className="note-card-header">
        <h3 className="note-card-title">{note.title}</h3>
        <div className="note-card-actions">
          <button
            className={`icon-btn ${note.pinned ? 'pinned' : ''}`}
            onClick={() => onPin(note.id)}
            title={note.pinned ? 'Unpin' : 'Pin'}
            aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
          >&#128204;</button>
          <button
            className="icon-btn danger"
            onClick={() => onDelete(note.id)}
            title="Delete"
            aria-label="Delete note"
          >&#10005;</button>
        </div>
      </div>
      <p className="note-card-body">{note.body}</p>
      <span className="note-card-date">{note.createdAt}</span>
    </div>
  );
}

export default Notes;
