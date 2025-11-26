import { NotePreview } from './NotePreview.jsx'

export function NoteList({ notes, onRemove, onUpdateTodo }) {
    return (
        <ul className="note-list">
            {notes.map((note) => (
                <li key={note.id}>
                    <NotePreview note={note} onRemove={onRemove} onUpdateTodo={onUpdateTodo} />
                </li>
            ))}
        </ul>
    )
}
