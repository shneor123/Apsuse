export class NewVideoNote extends React.Component{

    state = {
        note: {
            type: this.props.type,
            // isPinned: false,
            info: {
                url: '',
                title: ''
            },
            style: {
                backgroundColor: '#CC7351'
            }
        }
    }

    handleChange = ({ target }) => {
        const field = target.name
        const value = target.value
        this.setState((prevState) => ({ note: { ...prevState.note, info: { ...prevState.note.info, [field]: value } } }))
    }

    render(){
        const { note } = this.state
        const { title, url } = this.state.note.info
        const { onSaveNote } = this.props
        return(
            <section className="new-note-info">
            <form className="new-note-form" onSubmit={() => onSaveNote(event, note)}>
                <label htmlFor="title">Enter Note Title </label>
                <input type="text" id="title" name='title' value={title}
                    placeholder="Enter title here" onChange={this.handleChange} />

                <label htmlFor="url">Enter Your Video URL </label>
                <input type="text" id="url" name='url' value={url}
                    placeholder="Enter URL here" onChange={this.handleChange} />
                <button className="save-new-note-btn">Save Note</button>
            </form>
        </section>
        )
    }
}