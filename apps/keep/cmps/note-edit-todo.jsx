import { todosService } from "../services/todos.service.js"

export class EditTodosNote extends React.Component {

    state = {
        note: null,
        newTodoTxt: '',
        isAddNewTodoOn: false
    }


    componentDidMount() {
        const { note } = this.props
        this.setState({ note })
    }

    handleChange = (ev, idx) => {
        const value = ev.target.value
        let { note } = this.state
        note.info.todos[idx].txt = value
        this.setState({ note })
    }

    handleNewTodoChange = ({ target }) => {
        const newTodoTxt = target.value
        this.setState({ newTodoTxt })
    }

    toggleAddNewTodo = () => {
        this.setState({ isAddNewTodoOn: !this.state.isAddNewTodoOn })
    }

    onAddTodo = (ev, note) => {
        ev.preventDefault()
        const { value } = ev.target[0]
        todosService.addTodo(value, note.id)
            .then((note) => {
                this.props.onSaveEdit(ev, note)
            }
            )
    }

    onDeleteTodo = (ev, note, todoId) => {
        ev.preventDefault()
        todosService.deleteTodo(note.id, todoId)
            .then((note => {
                this.setState({ note })
            }))
    }

    render() {
        const { note, newTodoTxt, isAddNewTodoOn } = this.state
        if (!note) return <React.Fragment></React.Fragment>
        const { info } = note
        return (
            <section className="edit-todos-note">
                <h2>{isAddNewTodoOn ? 'Add new Todo' : 'Edit your todos'}  </h2>
                <button
                    className="toggle-add-edit-todo" onClick={this.toggleAddNewTodo}>
                    {isAddNewTodoOn ? 'Edit existing Todos' : 'Add new Todo'}
                </button>

                {!isAddNewTodoOn &&
                    <section className="edit-todos">
                        <form onSubmit={() => this.props.onSaveEdit(event, note)}>
                            {info.todos.map((todo, idx) => {
                                return (
                                    <div className="todo-to-edit" key={idx}><input type="text"
                                        value={todo.txt} onChange={() => this.handleChange(event, idx)} />
                                        <button className="remove-todo-btn" onClick={() =>
                                            this.onDeleteTodo(note, event, todo.id)}>
                                            x </button>
                                    </div>
                                )
                            })}
                            <button className="save-todos-changes-btn"> Save Edits</button>
                        </form>
                    </section>}
                {isAddNewTodoOn && <section className="add-todo">
                    <form onSubmit={() => this.onAddTodo(event, note)}>
                        <input type="text" value={newTodoTxt} onChange={this.handleNewTodoChange} />
                        <button className="save-todos-changes-btn">add Todo</button>
                    </form>
                </section>}
            </section>
        )
    }
}
