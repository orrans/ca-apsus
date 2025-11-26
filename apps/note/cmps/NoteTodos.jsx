export function NoteTodos({ info }) {
    return (
        <div className="note-todos">
            <h4>{info.title}</h4>
            <ul>
                {info.todos.map((todo, idx) => (
                    <li key={idx}>
                        <span style={{ textDecoration: todo.isDone ? 'line-through' : 'none' }}>
                            {todo.txt}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
