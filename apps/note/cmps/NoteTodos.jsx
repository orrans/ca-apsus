export function NoteTodos({ note, onUpdateTodo }) {
    const { info } = note
    return (
        <div className="note-todos">
            <h4>{info.title}</h4>
            <ul>
                {info.todos.map((todo, idx) => (
                    //change idx to elemnt id
                    <li key={idx}>
                        <input
                            type="checkbox"
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
