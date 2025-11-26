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
            // check that the click element is not inside the form container
            if (formContainer && !formContainer.contains(clickedElement)) {
                if (note.type === 'NoteTxt' && !note.info.txt) return
                // check that at least one todo have text
                if (note.type === 'NoteTodos' && !note.info.todos.some((todo) => todo.txt)) return

                onCreate({ ...note, createdAt: Date.now() })
                setNote(noteService.getEmptyNote())
            }
        }

        //the listener is on all the body
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [note])

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
                    <div>
                        {note.info.todos.map((todo, idx) => (
                            <div key={idx}>
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
                                    onInput={(event) =>
                                        updateTodo(idx, { ...todo, txt: event.target.value })
                                    }
                                />
                            </div>
                        ))}
                        <div
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
