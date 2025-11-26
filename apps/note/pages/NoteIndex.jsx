import { noteService } from '../services/note.service.js'
import { NoteList } from '../cmps/NoteList.jsx'

const { useState, useEffect } = React

export function NoteIndex() {
    const [notes, setNotes] = useState(null)

    useEffect(() => {
        noteService.query().then((notes) => setNotes(notes))
    }, [])

    function onRemoveNote(noteId) {
        noteService
            .remove(noteId)
            .then(() => {
                const updatedNotes = notes.filter((note) => note.id !== noteId)
                setNotes(updatedNotes)
            })
            .catch((err) => {
                console.log('Problems removing note:', err)
            })
    }

    if (!notes) return <div>Loading...</div>

    return (
        <section className="note-index">
            <NoteList notes={notes} onRemove={onRemoveNote} />
        </section>
    )
}
