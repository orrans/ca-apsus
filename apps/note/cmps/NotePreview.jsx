import { NoteTxt } from './NoteTxt.jsx'
import { NoteImg } from './NoteImg.jsx'
import { NoteTodos } from './NoteTodos.jsx'

export function NotePreview({ note, onRemove, onUpdateTodo, onUpdateNote }) {
    return (
        <article className="note-preview" style={note.style}>
            {note.type === 'NoteTxt' && <NoteTxt info={note.info} />}
            {note.type === 'NoteImg' && <NoteImg info={note.info} />}
            {note.type === 'NoteTodos' && <NoteTodos note={note} onUpdateTodo={onUpdateTodo} />}
            <section className="actions">
                <button onClick={() => onRemove(note.id)}>
                    <i className="fa-solid fa-trash-can"></i>
                </button>
                <input
                    type="color"
                    value={note.style.backgroundColor}
                    onChange={(event) =>
                        onUpdateNote({ ...note, style: { backgroundColor: event.target.value } })
                    }
                />
            </section>
        </article>
    )
}
