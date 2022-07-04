import { notesService } from '../services/note.service.js'
import { utilService } from '../../../services/util.service.js'
import { eventBusService } from '../../../services/event-bus.service.js'

import { DynamicNote } from '../../keep/cmps/note-dynamic.jsx'
import { NoteFilter } from '../../keep/cmps/note-filter.jsx'
import { NewNoteModal } from '../../keep/cmps/new-note-modal.jsx'


export class KeepApp extends React.Component {

    state = {
        notes: [],
        // pinnedNotes: [],
        isNewNoteModalOn: false,
        filterBy: {
            title: '',
            type: 'all'
        },
    }


    componentDidMount() {
        window.scrollTo(0, 0)
        this.loadNotes()
        this.searchParams()
        this.removeEventBus = eventBusService.on('search', (txt) => this.debbouncedFunc({ txt }))
    }

    componentWillUnmount() {
        this.removeEventBus();
    }

    onSetTxtFilter = (title) => {
        const titleTxt = title
        this.setState((prevState) =>
            ({ filterBy: { ...prevState.filterBy, title: titleTxt } }),
            this.loadNotes)
    }

    debbouncedFunc = utilService.debounce(this.onSetTxtFilter, 100)

    onSetTypeFilter = (type) => {
        const filterType = type
        this.setState((prevState) =>
            ({ filterBy: { ...prevState.filterBy, type: filterType } }),
            this.loadNotes)
    }

    searchParams = () => {
        const query = new URLSearchParams(this.props.location.search)
        const title = query.get('title')
        const txt = query.get('txt')
        if (title || txt) {
            // here todo1

            this.setState({ isNewNoteModalOn: true })
        }
    }

    loadNotes = () => {
        const { filterBy } = this.state
        notesService.query(filterBy).then(notes => {
            this.setState({ notes })
        })
    }

    toggleNewNoteModal = () => {
        this.setState({ isNewNoteModalOn: !this.state.isNewNoteModalOn })
    }


    render() {
        const { notes, isNewNoteModalOn } = this.state
        if (!notes) return <React.Fragment></React.Fragment>
        const notesTypes = ['all', 'txt', 'todos', 'img', 'video']
        let { type } = this.state.filterBy
        return (
            <section className="keep-app">
             
                <NoteFilter notesTypes={notesTypes}
                    onSetTypeFilter={this.onSetTypeFilter} currType={type} />
                <button className="btn-new-note" onClick={this.toggleNewNoteModal}>Create New Note</button>
                {isNewNoteModalOn &&
                    <NewNoteModal loadNotes={this.loadNotes} toggleNewNoteModal={this.toggleNewNoteModal} />
                }
                <section className="all-notes-container">
                    <section className="notes-list">
                        {notes.map(note => {
                            return <DynamicNote key={note.id} note={note} loadNotes={this.loadNotes} />
                        })}
                    </section>
                </section>

            </section>
        )
    }
}






