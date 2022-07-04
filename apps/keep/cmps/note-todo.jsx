
export function TodosNote({ note, onToggleTodo }) {

    return (
        <section className="todos-note note" >
            <h2>{note.info.title}</h2>
            <ul>
                {note.info.todos.map(todo => (
                    <div className="todo" key={todo.id}>
                        <li className={todo.doneAt ? 'read' : ''} >
                            {todo.txt.charAt(0).toUpperCase() + todo.txt.slice(1)}
                        </li>
                        <button onClick={() => onToggleTodo(note.id, todo.id)}>
                            {todo.doneAt ? '☑' : '☐'}
                        </button>
                    </div>
                ))}
            </ul>
        </section>
    )
}
