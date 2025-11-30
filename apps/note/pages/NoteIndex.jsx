import { noteService } from '../services/note.service.js'
import { labelService } from '../services/label.service.js'
import { NoteList } from '../cmps/NoteList.jsx'
import { CreateNoteForm } from '../cmps/CreateNoteForm.jsx'
import { eventBusService } from '../../../services/event-bus.service.js'
import { NoteFilterType } from '../cmps/NoteFilterType.jsx'
import { LabelsSidebar } from '../cmps/LabelsSidebar.jsx'

const { useState, useEffect } = React

export function NoteIndex() {
    const [notes, setNotes] = useState([])
    const [search, setSearch] = useState('')
    const [filterType, setFilterType] = useState(null)
    const [searchActive, setSearchActive] = useState(false)
    const [labelFilter, setLabelFilter] = useState(null)

    useEffect(() => {
        loadNotes()
    }, [])

    useEffect(() => {
        function handleSearch(value) {
            setSearch(value)
            searchNotes(value)
        }
        function handleSearchActive(value) {
            console.log('value', value)
            setSearchActive(value)
            if (value) setNotes([])
            else setFilterType(null)
        }
        const removeSubscribeSearch = eventBusService.on('noteSearch', handleSearch)
        const removeSubscribeSearchActive = eventBusService.on(
            'noteSearchActive',
            handleSearchActive
        )

        const removeLabelsSub = eventBusService.on('labelsChanged', (payload) => {
            if (!payload) return

            if (payload.removedId) {
                setNotes((prevNotes) => {
                    const updated = prevNotes.map((note) => ({
                        ...note,
                        labels: (note.labels || []).filter((l) => l && l.id !== payload.removedId),
                    }))
                    noteService.saveAll(updated)
                    return updated
                })
            } else if (payload.id) {
                setNotes((prevNotes) => {
                    const updated = prevNotes.map((note) => ({
                        ...note,
                        labels: (note.labels || []).map((l) =>
                            l && l.id === payload.id ? payload : l
                        ),
                    }))
                    noteService.saveAll(updated)
                    return updated
                })
            }
        })

        return () => {
            removeSubscribeSearch()
            removeSubscribeSearchActive()
            removeLabelsSub()
        }
    }, [])

    useEffect(() => {
        searchNotes(search)
    }, [filterType])

    useEffect(() => {
        searchNotes(search)
    }, [labelFilter])

    function loadNotes() {
        noteService.query().then((notes) => setNotes(notes)) //.sort((a, b) => b.createdAt - a.createdAt)))
    }

    function searchNotes(search) {
        noteService
            .query({ txt: search, type: filterType, label: labelFilter })
            .then((notes) => setNotes(notes.sort((a, b) => b.createdAt - a.createdAt)))
    }

    function onCreateNote(note) {
        noteService.save(note).then((createdNote) => setNotes([createdNote, ...notes]))
    }

    function onUpdateNotes(notesArr) {
        setNotes(notesArr)
        noteService.saveAll(notesArr).then(() => setNotes(notesArr))
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

    // simplified: set label filter directly where used

    function updateFilterType(type) {
        setFilterType(type)
        eventBusService.emit('setNoteFilterType', type)
    }

    if (searchActive)
        return (
            <div>
                {!search && !filterType && (
                    <NoteFilterType onFilterChange={(type) => updateFilterType(type)} />
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
                onUpdateNotes={onUpdateNotes}
            />
            <LabelsSidebar label={labelFilter} onFilter={(labelId) => setLabelFilter(labelId)} />
        </section>
    )
}
