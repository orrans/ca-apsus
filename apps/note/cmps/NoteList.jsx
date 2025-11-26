import { NotePreview } from './NotePreview.jsx'

export function NoteList({ notes, onRemove }) {
    return (
        <ul className="note-list">
            {notes.map((note) => (
                <li key={note.id}>
                    <NotePreview note={note} />
                    <section className="actions">
                        <button onClick={() => onRemove(note.id)}>&times;</button>
                    </section>
                </li>
            ))}
        </ul>
    )
}
