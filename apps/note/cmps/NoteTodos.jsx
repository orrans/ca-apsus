export function NoteTodos({ note, onUpdateTodo }) {
    const { info } = note
    return (
        <div className="note-todos">
            {info.title && <h2>{info.title}</h2>}
            <ul className="note-todos-list">
                {info.todos.map((todo, idx) => (
                    //change idx to elemnt id
                    <li key={idx}>
                        <input
                            type="checkbox"
                            onClick={(event) => event.stopPropagation()}
                            checked={todo.isDone}
                            onChange={(event) =>
                                onUpdateTodo(note, idx, { ...todo, isDone: event.target.checked })
                            }
                        />
                        <span style={{ textDecoration: todo.isDone ? 'line-through' : 'none' }}>
                            {todo.txt}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
