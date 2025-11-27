import { utilService } from '../../../services/util.service.js'
import { noteService } from '../services/note.service.js'

const { useState, useEffect, useRef } = React

export function CreateNoteForm({ onCreate }) {
    const [note, setNote] = useState(noteService.getEmptyNote())
    const formRef = useRef(null)
    const [editMode, setEditMode] = useState(false)

    useEffect(() => {
        function handleClickOutside(event) {
            const formContainer = formRef.current
            const clickedElement = event.target

            if (formContainer && formContainer.contains(clickedElement)) return

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
                setNote({ ...note, type: 'NoteImg', info: { url: file } })
            })
        }
        input.click()
    }

    return (
        <div className="create-form" ref={formRef}>
            <div className="form-container">
                <div className="form-inputs">
                    {editMode && (
                        <div>
                            <input className='form-title'
                                type="text"
                                value={note.info.title}
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
                        {note.type === 'NoteTxt' && (
                            <input
                                type="text"
                                value={note.info.txt}
                                placeholder="Take a note..."
                                onInput={(event) =>
                                    setNote({ ...note, info: { txt: event.target.value } })
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
                                            value={todo.txt}
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
                                                className="btn-remove-todo"
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
                        {note.type === 'NoteImg' && (
                            <div className="img-container">
                                <div className="img-inner-container">
                                    <img className="uploaded-img" src={note.info.url} />
                                    <button className="delete-img" onClick={() => resetForm()}>
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={note.info.title}
                                        placeholder="Add title"
                                        onInput={(event) =>
                                            setNote({
                                                ...note,
                                                info: { ...note.info, title: event.target.value },
                                            })
                                        }
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={note.info.txt}
                                        placeholder="Take a note..."
                                        onInput={(event) =>
                                            setNote({
                                                ...note,
                                                info: { ...note.info, txt: event.target.value },
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {note.type !== 'NoteImg' && !editMode && (
                    <React.Fragment>
                        <button
                            className="round-btn"
                            onClick={() => {
                                setNote({
                                    ...note,
                                    type: 'NoteTodos',
                                    info: { todos: [{ txt: '', isDone: false }] },
                                })
                                setEditMode(true)
                            }}>
                            <i className="fa-regular fa-square-check"></i>
                        </button>

                        <button
                            className="round-btn"
                            onClick={() => {
                                uploadFile()
                                setEditMode(true)
                            }}>
                            <i className="fa-regular fa-image"></i>
                        </button>
                    </React.Fragment>
                )}
            </div>

            {editMode && (
                <div className="close-btn-container">
                    <button className={'close-form-btn'} onClick={() => resetForm()}>
                        Close
                    </button>
                </div>
            )}
        </div>
    )
}
