import { useState, useRef, useEffect } from 'react'
import './index.css'

function App() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('notes')
    return saved ? JSON.parse(saved) : []
  })
  const [inputValue, setInputValue] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')

  const inputRef = useRef(null)

  // Persist notes to localStorage
  useEffect(() => {
    console.log('Saving to localStorage:', notes)
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  // Focus input on initial load
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const addNote = () => {
    console.log('Adding note:', inputValue)
    if (!inputValue.trim()) return

    const newNote = {
      id: Date.now(),
      text: inputValue.trim(),
    }

    setNotes([newNote, ...notes])
    setInputValue('')
    inputRef.current?.focus()
  }

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id))
  }

  const startEditing = (note) => {
    setEditingId(note.id)
    setEditValue(note.text)
  }

  const saveEdit = () => {
    if (!editValue.trim()) {
      setEditingId(null)
      return
    }

    setNotes(notes.map(note =>
      note.id === editingId ? { ...note, text: editValue.trim() } : note
    ))
    setEditingId(null)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addNote()
    }
  }

  return (
    <div className="glass-container animate-in">
      <h1 className="app-title">Velvet Notes</h1>

      <div className="input-section">
        <input
          ref={inputRef}
          type="text"
          className="note-input"
          placeholder="Write a new note..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button className="btn btn-primary" onClick={addNote}>
          Add Note
        </button>
      </div>

      <div className="notes-grid">
        {notes.length === 0 ? (
          <p style={{ textAlign: 'center', gridColumn: '1/-1', color: 'var(--text-muted)' }}>
            No notes yet. Start writing something magic!
          </p>
        ) : (
          notes.map(note => (
            <div key={note.id} className="note-card animate-in">
              {editingId === note.id ? (
                <textarea
                  className="edit-input"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  autoFocus
                  onBlur={saveEdit}
                  rows={4}
                />
              ) : (
                <p className="note-text">{note.text}</p>
              )}

              <div className="note-actions">
                {editingId === note.id ? (
                  <button className="btn btn-success-link" onClick={saveEdit}>
                    Save
                  </button>
                ) : (
                  <>
                    <button className="btn btn-success-link" onClick={() => startEditing(note)}>
                      Edit
                    </button>
                    <button className="btn btn-danger-link" onClick={() => deleteNote(note.id)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App
