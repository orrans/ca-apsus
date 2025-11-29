import { NotePreview } from './NotePreview.jsx'
const { useState, useEffect } = React

export function NoteList({
    notes,
    onUpdateNotes,
    onRemove,
    onUpdateTodo,
    onUpdateNote,
    onDuplicate,
}) {
    const [draggedIndex, setDraggedIndex] = useState(null)

    const onDragStart = (note, idx) => {
        console.log('start idx', idx)
        setDraggedIndex(idx)
    }

    useEffect(() => {
        console.log('changed', notes)
    }, [notes])

    const drop = (note, idx) => {
        console.log('drop', idx)
        const pinnedNotes = [...notes.filter((currNote) => currNote.isPinned)]
        const otherNotes = [...notes.filter((currNote) => !currNote.isPinned)]
        const newNotes = note.isPinned ? pinnedNotes : otherNotes
        const newOtherNotes = !note.isPinned ? pinnedNotes : otherNotes
        const [draggedItem] = newNotes.splice(draggedIndex, 1)
        newNotes.splice(idx, 0, draggedItem)
        console.log('new notes', newNotes)
        console.log('notes', notes)

        onUpdateNotes([...newNotes, ...newOtherNotes])
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
                            onDragStart={() => onDragStart(note, idx)}
                            onDrop={() => drop(note, idx)}
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
                    .map((note, idx) => (
                        <li
                            draggable="true"
                            className="note-list-item"
                            key={note.id}
                            onDragStart={() => onDragStart(note, idx)}
                            onDrop={() => drop(note, idx)}
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
        </div>
    )
}
