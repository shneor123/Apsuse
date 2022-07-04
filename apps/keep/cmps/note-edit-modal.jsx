
import { EditTodosNote } from "./note-edit-todo.jsx"

export class EditNoteModal extends React.Component {

    state = {
        note: null
    }

    componentDidMount() {
        const { note } = this.props
        this.setState({ note })
    }

    handleChange = ({ target }) => {
        const field = target.name
        const value = target.value
        this.setState((prevState) =>
            ({ note: { ...prevState.note, info: { ...prevState.note.info, [field]: value } } }))
    }

    render() {
        const { note } = this.state
        if (!note) return <React.Fragment></React.Fragment>
        const { info } = note
        const { onToggleEditModal } = this.props
        return (
            <section className="edit-modal-container">
                <section className="edit-modal">
                    <section className="edit-notes-form">
                        {note.type !== 'note-todos' &&
                            <form onSubmit={() => this.props.onSaveEdit(event,note)}>

                                <label htmlFor="title">Edit Note Title
                                    <input type="text" id="title" name='title'  value={info.title}
                                        onChange={this.handleChange} />
                                </label>

                                {note.type === 'note-txt' &&
                                    <React.Fragment>
                                        <textarea name="txt" id="txt" cols="30" rows="10" value={info.txt}
                                            onChange={this.handleChange}></textarea>
                                    </React.Fragment>}

                                {note.type === 'note-img' &&
                                    <React.Fragment>
                                        <label htmlFor="url">Edit Image URL </label>
                                        <img src={info.url} />
                                        <input type="text" id="url" name='url' value={info.url}
                                            onChange={this.handleChange} />
                                    </React.Fragment>}

                                {note.type === 'note-video' &&
                                    <React.Fragment>
                                        <label htmlFor="url">Edit Video URL </label>
                                        <input type="text" id="url" name='url'value={info.url}
                                            onChange={this.handleChange} />
                                    </React.Fragment>}

                                <button className="save-edit-btn">Save Edit</button>
                            </form>
                        }
                    </section>

                    {note.type === 'note-todos' &&
                        <React.Fragment>
                            <EditTodosNote note={note} onSaveEdit={this.props.onSaveEdit} />
                        </React.Fragment>}

                    <button
                        className="close-modal-btn" onClick={() => onToggleEditModal()}>
                            x
                    </button>

                </section>
            </section>
        )
    }
}