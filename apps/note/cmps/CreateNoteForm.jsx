import { utilService } from '../../../services/util.service.js'
import { noteService } from '../services/note.service.js'
import { NoteColorPicker } from './NoteColorPicker.jsx'

// /email/compose? title=my note & body= note about the rain

const { useState, useEffect, useRef } = React

export function CreateNoteForm({ onCreate }) {
    const [note, setNote] = useState(noteService.getEmptyNote())
    const formRef = useRef(null)
    const [editMode, setEditMode] = useState(false)

    useEffect(() => {
        const search = window.location.search || window.location.hash.split('?')[1]
        const params = Object.fromEntries(new URLSearchParams(search))
        if (params.title || params.body) {
            setEditMode(true)
            setNote({
                ...note,
                info: { ...note.info, title: params.title || '', txt: params.body || '' },
            })
        }
    }, [])

    useEffect(() => {
        function handleClickOutside(event) {
            const formContainer = formRef.current
            const clickedElement = event.target

            if (formContainer && formContainer.contains(clickedElement)) return

            if (event.target.closest('.color-popup')) {
                return
            }

            const isTxtEmpty = note.type === 'NoteTxt' && !note.info.txt && !note.info.title

            const isTodosEmpty =
                note.type === 'NoteTodos' &&
                !note.info.title &&
                !note.info.todos.some((todo) => todo.txt.trim().length > 0)

            const isImgEmpty = note.type === 'NoteImg' && !note.info.url && !note.info.title

            if (isTxtEmpty || isTodosEmpty || isImgEmpty) {
                resetForm()
                return
            }

            onCreate({ ...note, createdAt: Date.now() })
            resetForm()
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [note, onCreate])

    function updateTodo(idx, todo) {
        const todos = [...note.info.todos]
        todos[idx] = todo
        setNote({ ...note, info: { todos } })
    }

    function resetForm() {
        setNote(noteService.getEmptyNote())
        setEditMode(false)
    }

    function uploadFile() {
        const input = document.createElement('input')
        input.type = 'file'
        input.onchange = (event) => {
            const file = event.target.files[0]
            utilService.fileToBase64(file).then((file) => {
                setNote({ ...note, type: 'NoteImg', info: { ...note.info, url: file } })
            })
        }
        input.click()
    }

    return (
        <div
            className="create-form"
            ref={formRef}
            style={{ backgroundColor: note.style.backgroundColor }}>
            {editMode && (
                <div
                    className="pinned"
                    onClick={() => setNote({ ...note, isPinned: !note.isPinned })}>
                    <span
                        className={
                            (note.isPinned ? 'material-symbols-filled' : '') +
                            ' material-symbols-outlined'
                        }>
                        keep
                    </span>
                </div>
            )}
            <div className="form-container">
                <div className="form-inputs">
                    {note.type === 'NoteImg' && (
                        <div className="img-container">
                            <div className="img-inner-container">
                                <img className="uploaded-img" src={note.info.url} />
                                <button
                                    className="delete-img note-btn round"
                                    onClick={() =>
                                        setNote({
                                            ...note,
                                            type: note.info.todos ? 'NoteTodos' : 'NoteTxt',
                                            info: { ...note.info, url: '' },
                                        })
                                    }>
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        </div>
                    )}
                    {editMode && (
                        <div>
                            <input
                                className="form-title"
                                type="text"
                                value={note.info.title || ''}
                                placeholder="Title"
                                onInput={(event) =>
                                    setNote({
                                        ...note,
                                        info: { ...note.info, title: event.target.value },
                                    })
                                }
                            />
                        </div>
                    )}
                    <div className="input-row">
                        {(note.type === 'NoteTxt' || note.type === 'NoteImg') && (
                            <input
                                type="text"
                                value={note.info.txt || ''}
                                placeholder="Take a note..."
                                onInput={(event) =>
                                    setNote({
                                        ...note,
                                        info: { ...note.info, txt: event.target.value },
                                    })
                                }
                                onFocus={() => setEditMode(true)}
                            />
                        )}
                        {note.type === 'NoteTodos' && (
                            <div className="todos-list-container">
                                {note.info.todos.map((todo, idx) => (
                                    <div key={idx} className="todo-row">
                                        <input
                                            type="checkbox"
                                            checked={todo.isDone}
                                            onChange={(event) =>
                                                updateTodo(idx, {
                                                    ...todo,
                                                    isDone: event.target.checked,
                                                })
                                            }
                                        />

                                        <input
                                            className={todo.isDone ? 'checked' : ''}
                                            type="text"
                                            value={todo.txt || ''}
                                            placeholder="List item"
                                            onInput={(event) =>
                                                updateTodo(idx, {
                                                    ...todo,
                                                    txt: event.target.value,
                                                })
                                            }
                                        />
                                        <div>
                                            <button
                                                className="btn-remove-todo note-btn round"
                                                onClick={() => {
                                                    const newTodos = note.info.todos.filter(
                                                        (todo, i) => i !== idx
                                                    )
                                                    setNote({ ...note, info: { todos: newTodos } })
                                                }}>
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <div
                                    className="add-todo-btn"
                                    onClick={() =>
                                        updateTodo(note.info.todos.length, {
                                            txt: '',
                                            isDone: false,
                                        })
                                    }>
                                    + List item
                                </div>
                            </div>
                        )}

                        {note.type === 'NoteVideo' && (
                            <input
                                type="text"
                                value={note.info.url || ''}
                                placeholder="Enter YouTube URL..."
                                onInput={(event) =>
                                    setNote({
                                        ...note,
                                        info: { ...note.info, url: event.target.value },
                                    })
                                }
                            />
                        )}
                    </div>
                </div>
                {note.type !== 'NoteImg' && !editMode && (
                    <React.Fragment>
                        <button
                            className="note-btn round note-type-btn"
                            onClick={() => {
                                setNote({
                                    ...note,
                                    type: 'NoteTodos',
                                    info: { todos: [{ txt: '', isDone: false }] },
                                })
                                setEditMode(true)
                            }}>
                            <span className="material-symbols-outlined">check_box</span>
                        </button>

                        <button
                            className="note-btn round note-type-btn"
                            onClick={() => {
                                uploadFile()
                                setEditMode(true)
                            }}>
                            <span className="material-symbols-outlined">image</span>
                        </button>

                        <button
                            className="note-btn round note-type-btn"
                            onClick={() => {
                                setNote({
                                    ...note,
                                    type: 'NoteVideo',
                                    info: { url: '' },
                                })
                                setEditMode(true)
                            }}>
                            <span className="material-symbols-outlined">movie</span>
                        </button>
                    </React.Fragment>
                )}
            </div>

            {editMode && (
                <div className="toolbar-container">
                    <NoteColorPicker
                        value={note.style.backgroundColor || ''}
                        onChange={(color) =>
                            setNote({ ...note, style: { backgroundColor: color } })
                        }
                    />

                    <button
                        className="note-btn round"
                        onClick={() => {
                            uploadFile()
                            setEditMode(true)
                        }}>
                        <span className="material-symbols-outlined">image</span>
                    </button>
                    <div className="space"></div>
                    <button className={'close-form-btn note-btn'} onClick={() => resetForm()}>
                        Close
                    </button>
                </div>
            )}
        </div>
    )
}
