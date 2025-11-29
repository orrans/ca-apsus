import { NotePreview } from './NotePreview.jsx'
const { useState, useEffect } = React

export function NoteList({ notes, setNotes, onRemove, onUpdateTodo, onUpdateNote, onDuplicate }) {
    const [draggedIndex, setDraggedIndex] = useState(null)

    const onDragStart = (idx) => {
        console.log('start idx', idx)
        setDraggedIndex(idx)
    }

    const drop = (idx) => {
        console.log('drop', idx)
        const newNotes = [...notes]
        const [draggedItem] = newNotes.splice(draggedIndex, 1)
        newNotes.splice(idx, 0, draggedItem)
        console.log('new notes', newNotes)
        console.log('notes', notes)

        setNotes(newNotes)
    }

    function allowDrop(event) {
        event.preventDefault()
    }

    return (
        <div className="notes-container">
            <h2 className="note-list-title">Pinned</h2>
            <ul className="note-list">
                {notes
                    .filter((note) => note.isPinned)
                    .map((note, idx) => (
                        <li
                            draggable="true"
                            className="note-list-item"
                            key={note.id}
                            onDragStart={() => onDragStart(idx)}
                            onDrop={() => drop(idx)}
                            onDragOver={allowDrop}>
                            <NotePreview
                                note={note}
                                onRemove={onRemove}
                                onUpdateTodo={onUpdateTodo}
                                onUpdateNote={onUpdateNote}
                                onDuplicate={onDuplicate}
                            />
                        </li>
                    ))}
            </ul>

            <h2 className="note-list-title">Others</h2>
            <ul className="note-list">
                {notes
                    .filter((note) => !note.isPinned)
                    .map((note) => (
                        <li draggable="true" className="note-list-item" key={note.id}>
                            <NotePreview
                                note={note}
                                onRemove={onRemove}
                                onUpdateTodo={onUpdateTodo}
                                onUpdateNote={onUpdateNote}
                                onDuplicate={onDuplicate}
                            />
                        </li>
                    ))}
            </ul>
        </div>
    )
}
