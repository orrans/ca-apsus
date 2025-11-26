import { noteService } from '../services/note.service.js'

const { useState, useEffect } = React

export function CreateNoteForm({ onCreate }) {
    const [note, setNote] = useState(noteService.getEmptyNote())

    return (
        <div
            onBlur={() => {
                if (!note.info.txt) return
                onCreate({ ...note, createdAt: Date.now() })
                setNote(noteService.getEmptyNote())
            }}>
            <input
                type="text"
                value={note.info.txt}
                placeholder="Take a note..."
                onInput={(event) => setNote({ ...note, info: { txt: event.target.value } })}
            />
        </div>
    )
}
