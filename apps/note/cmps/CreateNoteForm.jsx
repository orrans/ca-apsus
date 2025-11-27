import { utilService } from '../../../services/util.service.js'
import { noteService } from '../services/note.service.js'

const { useState, useEffect, useRef } = React

export function CreateNoteForm({ onCreate }) {
    const [note, setNote] = useState(noteService.getEmptyNote())
    const formRef = useRef(null)

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
                setNote(noteService.getEmptyNote())
                return
            }

            onCreate({ ...note, createdAt: Date.now() })
            setNote(noteService.getEmptyNote())
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [note, onCreate])

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
        <div className="create-form" ref={formRef}>
            <div className="input-row">
                {note.type === 'NoteTxt' && (
                    <input
                        type="text"
                        value={note.info.txt}
                        placeholder="Take a note..."
                        onInput={(event) => setNote({ ...note, info: { txt: event.target.value } })}
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
                                        updateTodo(idx, { ...todo, isDone: event.target.checked })
                                    }
                                />

                                <input
                                    className={todo.isDone ? 'checked' : ''}
                                    type="text"
                                    value={todo.txt}
                                    placeholder="List item"
                                    onInput={(event) =>
                                        updateTodo(idx, { ...todo, txt: event.target.value })
                                    }
                                />

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
                        ))}

                        <div
                            className="add-todo-btn"
                            onClick={() =>
                                updateTodo(note.info.todos.length, { txt: '', isDone: false })
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
                                className="delete-img"
                                onClick={() => setNote(noteService.getEmptyNote())}>
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
                {note.type !== 'NoteImg' && (
                    <React.Fragment>
                        <button
                            onClick={() => {
                                setNote({
                                    ...note,
                                    type: 'NoteTodos',
                                    info: { todos: [{ txt: '', isDone: false }] },
                                })
                            }}>
                            <i className="fa-regular fa-square-check"></i>
                        </button>

                        <button onClick={uploadFile}>
                            <i className="fa-regular fa-image"></i>
                        </button>
                    </React.Fragment>
                )}
            </div>
        </div>
    )
}
