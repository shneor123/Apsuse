import { notesService } from "../services/note.service.js"
import { eventBusService } from "../../../services/event-bus.service.js"

import { TxtNote } from "./note-txt.jsx"
import { ImgNote } from "./note-img.jsx"
import { TodosNote } from "./note-todo.jsx"
import { VideoNote } from "./note-video.jsx"
import { PickNoteColor } from "./note-pick-color.jsx"
import { EditNoteModal } from "././note-edit-modal.jsx"


const { Link } = ReactRouterDOM

export class DynamicNote extends React.Component {

    state = {
        note: null,
        isColorMenuOn: false,
        isEditModalOn: false
    }

    componentDidMount() {
        this.loadNote()
    }

    loadNote = () => {
        const { note } = this.props
        this.setState({ note })
    }

    onToggleTodo = (noteId, todoId) => {
        notesService.toggleTodo(noteId, todoId)
            .then((note) => {
                this.setState({ note })
            })
    }

    onDeleteNote = (noteId) => {
        notesService.deleteNote(noteId)
            .then(() => {
                this.props.loadNotes()
                eventBusService.emit(
                    'user-msg', { txt: 'Note Deleted', type: 'success' })
            })
    }

    onDuplicateNote = (noteId) => {
        notesService.duplicateNote(noteId)
            .then(() => {
                this.props.loadNotes()
                eventBusService.emit(
                    'user-msg', { txt: 'Note Duplicated', type: 'success' })
            })
    }

    onChangeBgc = (noteId, color) => {
        notesService.changeBgc(noteId, color)
            .then((note) => {
                this.setState({ note })
                this.onToggleColorMenu()
            })
    }

    onToggleColorMenu = () => {
        this.setState({ isColorMenuOn: !this.state.isColorMenuOn })
    }

    onToggleEditModal = () => {
        this.setState({ isEditModalOn: !this.state.isEditModalOn })
    }

    onSaveEdit = (ev, note) => {
        ev.preventDefault()
        notesService.saveEdit(note)
            .then(() => {
                this.setState({ note }),
                    this.onToggleEditModal()
                eventBusService.emit('user-msg', { txt: 'Edits Saved', type: 'success' })
            })
    }

    onExportNoteToEmail = (note) => {
        const subject = (note.info.title) ? note.info.title : 'No subject'
        let body = 'No body'
        switch (note.type) {
            case 'note-txt':
                body = note.info.txt
                break;
            case 'note-video':
                body = note.info.url
                break;
            case 'note-img':
                body = note.info.url
                break;
            case 'note-todos':
                const todosTxts = note.info.todos.map(todo => todo.txt)
                body = 'Todos: \n• ' + todosTxts.join('\n* ')
                break;
        }

        return `/mailapp?subject=${subject}&body=${body}`

    }

    render() {
        const { note, isColorMenuOn, isEditModalOn } = this.state
        if (!note) return <React.Fragment></React.Fragment>
        const exportTo = this.onExportNoteToEmail(note)

        return (
            <section className="note-dynamic" style={{ backgroundColor: note.style.backgroundColor }}>
                {note.type === 'note-txt' && <TxtNote note={note} />}
                {note.type === 'note-video' && <VideoNote note={note} />}
                {note.type === 'note-img' && <ImgNote note={note} />}
                {note.type === 'note-todos' && <TodosNote note={note} onToggleTodo={this.onToggleTodo} />}

                <section className="btns-note">
                    <button title="Delete" onClick={() =>
                        this.onDeleteNote(note.id)}>
                        <img src="assets/img/icons-keep/delete.png" />
                    </button>

                    <button title="Duplicate" onClick={() =>
                        this.onDuplicateNote(note.id)}>
                        <img src="assets/img/icons-keep/duplicate/duplicate.png" />
                    </button>

                    <button title="Edit" onClick={this.onToggleEditModal}>
                        <img src="assets/img/icons-keep/edit/edit1.png" />
                    </button>

                    <Link to={exportTo}>
                        <button title="Send as mail" >
                            <img src="assets/img/send.png"/></button>
                    </Link>

                    <button title="Change color" onClick={() =>
                        this.onToggleColorMenu(note.id)}>
                        <img src="assets/img/icons-keep/change-color.png" />
                    </button>

                    {isColorMenuOn && <PickNoteColor noteId={note.id} onChangeBgc={this.onChangeBgc} />}
                </section>

                {isEditModalOn && <EditNoteModal note={note} onToggleEditModal={this.onToggleEditModal}
                    onSaveEdit={this.onSaveEdit} />}
            </section>
        )
    }
}
``