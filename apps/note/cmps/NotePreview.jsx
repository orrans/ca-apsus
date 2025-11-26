import { NoteTxt } from './NoteTxt.jsx'
import { NoteImg } from './NoteImg.jsx'
import { NoteTodos } from './NoteTodos.jsx'

export function NotePreview({ note, onRemove, onUpdateTodo }) {
    return (
        <article className="note-preview" style={note.style}>
            {note.type === 'NoteTxt' && <NoteTxt info={note.info} />}
            {note.type === 'NoteImg' && <NoteImg info={note.info} />}
            {note.type === 'NoteTodos' && <NoteTodos note={note} onUpdateTodo={onUpdateTodo} />}
            <section className="actions">
                <button onClick={() => onRemove(note.id)}>&times;</button>
            </section>
        </article>
    )
}
