
export class NewTxtNote extends React.Component {

    state = {
        note: {
            type: this.props.type,
            isPinned: false,
            info: {
                title: '',
                txt: ''
            },
            style: {
                backgroundColor: '#FCFFA6'
            }
        }
    }

    componentDidMount() {
        const { exportedMail } = this.props
        if (exportedMail) {
            this.setState((prevState) =>
            ({
                note: {
                    ...prevState.note, info: {
                        ...prevState.note.info,
                        title: exportedMail.title, txt: exportedMail.txt
                    }
                }
            }))
        }
    }

    handleChange = ({ target }) => {
        const field = target.name
        const value = target.value
        this.setState((prevState) =>
            ({ note: { ...prevState.note, info: { ...prevState.note.info, [field]: value } } }))
    }

    render() {
        const { note } = this.state
        const { title, txt } = this.state.note.info
        const { onSaveNote } = this.props
        return (
            <section className="new-note-info">
                <form className="new-note-form"
                    onSubmit={() => onSaveNote(event, note)}>
                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" name='title' value={title}
                        placeholder="Enter title here"
                        onChange={this.handleChange} />

                    <textarea name="txt" id="txt" cols="30" rows="10"
                        value={txt} onChange={this.handleChange}>
                    </textarea>
                    <button className="save-new-note-btn">Save Note</button>
                </form>
            </section>
        )
    }
}