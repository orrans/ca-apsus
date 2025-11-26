import { NotePreview } from './NotePreview.jsx'

export function NoteList({ notes, onRemove, onUpdateTodo, onUpdateNote, onDuplicate }) {
    return (
        <div>
            <h2>Pinned</h2>
            <ul className="note-list">
                {notes
                    .filter((note) => note.isPinned)
                    .map((note) => (
                        <li key={note.id}>
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

            <h2>Others</h2>
            <ul className="note-list">
                {notes
                    .filter((note) => !note.isPinned)
                    .map((note) => (
                        <li key={note.id}>
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
