import { utilService } from '../../../services/util.service.js'
import { NoteColorPicker } from './NoteColorPicker.jsx'
import { NoteLabelPicker } from './NoteLabelPicker.jsx'
import { NoteLabels } from './NoteLabels.jsx'
import { NoteVideo } from './NoteVideo.jsx'

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
                setNote({ ...note, type: 'NoteImg', info: { ...note.info, url: file } })
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
            <div
                className="edit-form"
                onClick={(event) => event.stopPropagation()}
                style={{ backgroundColor: note.style.backgroundColor }}>
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
                                />
                            )}
                            {note.type === 'NoteTodos' && (
                                <ul className="todos-list-container">
                                    {note.info.todos.map((todo, idx) => (
                                        <li key={idx} className="todo-row">
                                            <input
                                                type="checkbox"
                                                checked={todo.isDone}
                                                onChange={(event) => {
                                                    updateTodo(idx, {
                                                        ...todo,
                                                        isDone: event.target.checked,
                                                    })
                                                }}
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
                                                        setNote({
                                                            ...note,
                                                            info: { todos: newTodos },
                                                        })
                                                    }}>
                                                    ✕
                                                </button>
                                            </div>
                                        </li>
                                    ))}

                                    <li
                                        className="add-todo-btn"
                                        onClick={() =>
                                            updateTodo(note.info.todos.length, {
                                                txt: '',
                                                isDone: false,
                                            })
                                        }>
                                        + List item
                                    </li>
                                </ul>
                            )}
                        </div>
                        {note.type === 'NoteVideo' && (
                            <div>
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
                                <NoteVideo info={{ ...note.info, title: '' }} />
                            </div>
                        )}
                    </div>
                </div>
                <NoteLabels className="note-labels-inline-note" labels={note.labels} limit={5} />
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
                        }}>
                        <span className="material-symbols-outlined">image</span>
                    </button>

                    <button
                        className="note-btn round"
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

                    <NoteLabelPicker
                        value={note.labels}
                        onChange={(labels) => setNote({ ...note, labels: labels })}
                    />

                    <div className="space"></div>
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
