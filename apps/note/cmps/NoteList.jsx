import { NotePreview } from './NotePreview.jsx'

export function NoteList({ notes, onRemove, onUpdateTodo, onUpdateNote, onDuplicate }) {
    return (
        <div className="notes-container">
            <h2 className="note-list-title">Pinned</h2>
            <ul className="note-list">
                {notes
                    .filter((note) => note.isPinned)
                    .map((note) => (
                        <li className="note-list-item"  key={note.id}>
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
                        <li className="note-list-item" key={note.id}>
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
