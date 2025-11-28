import { utilService } from '../../../services/util.service.js'

const { useState, useEffect, useRef } = React

export function NoteInlineEdit({ onUpdate, note: noteProp, onClose }) {
    const [note, setNote] = useState(noteProp)

    useEffect(() => {
        setNote(noteProp)
    }, [noteProp])

    function updateTodo(idx, todo) {
        const todos = [...note.info.todos]
        todos[idx] = todo
        setNote({ ...note, info: { todos } })
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
        <div
            className="edit-container"
            onClick={(event) => {
                event.stopPropagation()
                onUpdate(note)
                onClose()
            }}>
            <div className="edit-form" onClick={(event) => event.stopPropagation()}>
                <div className="form-container">
                    <div className="form-inputs">
                        <div>
                            <input
                                className="form-title"
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

                        <div className="input-row">
                            {note.type === 'NoteTxt' && (
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
                                                    className="btn-remove-todo note-btn round"
                                                    onClick={() => {
                                                        const newTodos = note.info.todos.filter(
                                                            (todo, i) => i !== idx
                                                        )
                                                        setNote({
                                                            ...note,
                                                            info: { todos: newTodos },
                                                        })
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
                                        <button
                                            className="delete-img note-btn round"
                                            onClick={() => resetForm()}>
                                            <span className="material-symbols-outlined">
                                                delete
                                            </span>
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
                                                    info: {
                                                        ...note.info,
                                                        title: event.target.value,
                                                    },
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
                </div>

                <div className="close-btn-container">
                    <button
                        className={'close-form-btn note-btn'}
                        onClick={() => {
                            onClose()
                            onUpdate(note)
                        }}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}
