import { NoteTxt } from './NoteTxt.jsx'
import { NoteImg } from './NoteImg.jsx'
import { NoteTodos } from './NoteTodos.jsx'

export function NotePreview({ note, onRemove, onUpdateTodo, onUpdateNote, onDuplicate }) {
    return (
        <article className="note-preview" style={note.style}>
            <div
                className="pinned"
                onClick={() => onUpdateNote({ ...note, isPinned: !note.isPinned })}>
                <span
                    className={
                        (note.isPinned ? 'material-symbols-filled' : '') +
                        ' material-symbols-outlined'
                    }>
                    keep
                </span>
            </div>
            {note.type === 'NoteTxt' && <NoteTxt info={note.info} />}
            {note.type === 'NoteImg' && <NoteImg info={note.info} />}
            {note.type === 'NoteTodos' && <NoteTodos note={note} onUpdateTodo={onUpdateTodo} />}
            <section className="actions">
                <button onClick={() => onRemove(note.id)}>
                    <span className="material-symbols-outlined">delete</span>
                </button>
                <input
                    type="color"
                    value={note.style.backgroundColor}
                    onChange={(event) =>
                        onUpdateNote({ ...note, style: { backgroundColor: event.target.value } })
                    }
                />
                <button onClick={() => onDuplicate(note)}>
                    <span className="material-symbols-outlined">file_copy</span>
                </button>
            </section>
        </article>
    )
}
