import { noteService } from '../services/note.service.js'
import { NoteList } from '../cmps/NoteList.jsx'
import { CreateNoteForm } from '../cmps/CreateNoteForm.jsx'

const { useState, useEffect } = React

export function NoteIndex() {
    const [notes, setNotes] = useState(null)

    useEffect(() => {
        loadNotes()
    }, [])

    function loadNotes() {
        noteService.query().then((notes) => setNotes(notes.sort((a, b) => b.createdAt - a.createdAt)))
    }

    function onCreateNote(note) {
        noteService.save(note).then((createdNote) => setNotes([createdNote, ...notes]))
    }

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
            <CreateNoteForm onCreate={onCreateNote} />
            <NoteList notes={notes} onRemove={onRemoveNote} />
        </section>
    )
}
