import { noteService } from '../services/note.service.js'
import { NoteList } from '../cmps/NoteList.jsx'
import { CreateNoteForm } from '../cmps/CreateNoteForm.jsx'
import { eventBusService } from '../../../services/event-bus.service.js'
import { NoteFilterType } from '../cmps/NoteFilterType.jsx'

const { useState, useEffect } = React

export function NoteIndex() {
    const [notes, setNotes] = useState([])
    const [search, setSearch] = useState('')
    const [filterType, setFilterType] = useState(null)
    const [searchActive, setSearchActive] = useState(false)

    useEffect(() => {
        loadNotes()
    }, [])

    useEffect(() => {
        function handleSearch(value) {
            setSearch(value)
            searchNotes(value)
        }
        function handleSearchActive(value) {
            setSearchActive(value)
            if (value) setNotes([])
            else setFilterType(null)
        }
        const removeSubscribeSearch = eventBusService.on('noteSearch', handleSearch)
        const removeSubscribeSearchActive = eventBusService.on(
            'noteSearchActive',
            handleSearchActive
        )

        return () => {
            removeSubscribeSearch()
            removeSubscribeSearchActive()
        }
    }, [])

    useEffect(() => {
        searchNotes(search)
    }, [filterType])

    function loadNotes() {
        noteService
            //move only the sort to service
            .query()
            .then((notes) => setNotes(notes.sort((a, b) => b.createdAt - a.createdAt)))
    }

    function searchNotes(search) {
        noteService
            //move only the sort to service
            .query({ txt: search, type: filterType })
            .then((notes) => setNotes(notes.sort((a, b) => b.createdAt - a.createdAt)))
    }

    function onCreateNote(note) {
        noteService.save(note).then((createdNote) => setNotes([createdNote, ...notes]))
    }

    function updateTodo(note, idx, todo) {
        const todos = [...note.info.todos]
        todos[idx] = todo
        onUpdateNote({ ...note, info: { todos } })
    }

    function onUpdateNote(note) {
        const updatedNotes = [...notes]
        const idx = updatedNotes.findIndex((currNote) => currNote.id === note.id)
        updatedNotes[idx] = note
        noteService.save(note).then(() => setNotes(updatedNotes))
    }

    function onDuplicateNote(note) {
        // move to  service 40 -42
        const noteToSave = { ...note }
        delete noteToSave.id
        noteToSave.createdAt = Date.now()
        noteService
            .save(noteToSave)
            .then((savedNote) => {
                setNotes((prevNotes) => [savedNote, ...prevNotes])
            })
            .catch((err) => {
                console.log('Cannot duplicate note', err)
            })
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

    if (searchActive)
        return (
            <div>
                {!search && !filterType && (
                    <NoteFilterType onFilterChange={(type) => setFilterType(type)} />
                )}
                {(search || filterType) && (
                    <NoteList
                        notes={notes}
                        onRemove={onRemoveNote}
                        onUpdateTodo={updateTodo}
                        onUpdateNote={onUpdateNote}
                        onDuplicate={onDuplicateNote}
                    />
                )}
            </div>
        )

    if (!notes) return <div>Loading...</div>

    return (
        <section className="note-index">
            <CreateNoteForm onCreate={onCreateNote} />
            <NoteList
                notes={notes}
                onRemove={onRemoveNote}
                onUpdateTodo={updateTodo}
                onUpdateNote={onUpdateNote}
                onDuplicate={onDuplicateNote}
            />
        </section>
    )
}
