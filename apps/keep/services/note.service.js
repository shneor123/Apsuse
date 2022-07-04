import { utilService } from '../../../services/util.service.js'
import { storageService } from '../../../services/storage.service.js'


export const notesService = {
    query,
    saveNote,
    deleteNote,
    duplicateNote,
    changeBgc,
    toggleTodo,
    saveEdit,
    _saveNotesToStorage,
    _loadNotesFromStorage,
}


const KEY = 'notesDB'
const KEY_PINNED = 'pinnedDB'


const gNotes = [
    {
        id: utilService.makeId(),
        type: "note-img",
        isPinned: false,
        info: {
            url: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e2/IMG_Academy_Logo.svg/1200px-IMG_Academy_Logo.svg.png",
            title: 'choose title'
        },
        style: {
            backgroundColor: "#e0ffff"
        }
    },

    {
        id: utilService.makeId(),
        type: "note-todos",
        isPinned: false,
        info: {
            title: 'choose title',
            todos: [
                {
                    id: utilService.makeId(),
                    txt: 'choclatte',
                    doneAt: new Date()
                },
                {
                    id: utilService.makeId(),
                    txt: 'milk',
                    doneAt: new Date()
                },
                {
                    id: utilService.makeId(),
                    txt: 'cola',
                    doneAt: new Date()
                },
            ]
        },
        style: {
            backgroundColor: "#faf0e6"
        }
    },

    {
        id: utilService.makeId(),
        type: 'note-txt',
        isPinned: false,
        info: {
            title: 'choose title',
            txt: 'choose text'
        },
        style: {
            backgroundColor: "#e0ffff"
        }
    },

    {
        id: utilService.makeId(),
        type: 'note-video',
        isPinned: false,
        info: {
            url: 'https://www.youtube.com/embed/dauW62xmwZQ',
            title: 'choose title'
        },
        style: {
            backgroundColor: '#faf0e6'
        }
    },

]


_createNotes()

function query(filterBy = null) {
    const notes = _loadNotesFromStorage()
    const filteredNotes = _getFilteredNotes(notes, filterBy)
    return Promise.resolve(filteredNotes)
}

function toggleTodo(noteId, todoId) {
    const notes = _loadNotesFromStorage()
    const note = notes.find(note => noteId === note.id)
    const todo = note.info.todos.find(todo => todo.id === todoId)
    if (!todo.doneAt) {
        todo.doneAt = new Date()
    } else todo.doneAt = null
    _saveNotesToStorage(notes)
    return Promise.resolve(note)
}

function changeBgc(noteId, color) {
    const notes = _loadNotesFromStorage()
    const note = notes.find(note => note.id === noteId)
    note.style.backgroundColor = color
    _saveNotesToStorage(notes)
    return Promise.resolve(note)
}

function duplicateNote(noteId) {
    let notes = _loadNotesFromStorage()
    const noteIdx = notes.findIndex(note => noteId === note.id)
    const note = JSON.parse(JSON.stringify(notes[noteIdx]))
    note.id = utilService.makeId()
    notes.splice(noteIdx, 0, note)
    _saveNotesToStorage(notes)
    return Promise.resolve()
}

function deleteNote(noteId) {
    let notes = _loadNotesFromStorage()
    notes = notes.filter(note => noteId !== note.id)
    _saveNotesToStorage(notes)
    return Promise.resolve()
}

function saveEdit(note) {
    let notes = _loadNotesFromStorage()
    const noteId = note.id
    const noteIdx = notes.findIndex(note => note.id === noteId)
    notes[noteIdx] = note
    _saveNotesToStorage(notes)
    return Promise.resolve(note)
}

function saveNote(note) {
    note.id = utilService.makeId()
    note.info.title = utilService.capitalFirstLetter(note.info.title)
    if (note.type === 'note-todos') {
        const todosArr = note.info.todos
        const todos = todosArr.map(todo => {
            return { id: utilService.makeId(), txt: todo }
        })
        note.info.todos = todos
    }
    if (note.type === 'note-video') {
        const youtubeId = utilService.getYoutubeId(note.info.url)
        note.info.url = `https://www.youtube.com/embed/${youtubeId}`
    }
    let notes = _loadNotesFromStorage()
    notes = [note, ...notes]
    _saveNotesToStorage(notes)
    return Promise.resolve()
}

function _createNotes() {
    var notes = _loadNotesFromStorage()
    if (!notes || !notes.length) {
        _saveNotesToStorage(gNotes)
    }
}

function _getFilteredNotes(notes, filterBy) {
    const { type } = filterBy
    const title = filterBy.title.txt
    let filteredNotes = notes
    if (type !== 'all') {
        filteredNotes = notes.filter(note => {
            return note.type === `note-${type}`
        })
    }
    filteredNotes = _getFilteredNotesByTitle(filteredNotes, title)
    return filteredNotes
}

function _getFilteredNotesByTitle(notes, txt) {
    if (!txt) txt = ''
    txt = txt.toLowerCase()
    return notes.filter(note => {
        let title = note.info.title.toLowerCase()
        return title.includes(txt)
    })
}

function _saveNotesToStorage(notes) {
    storageService.saveToStorage(KEY, notes)
}

function _loadNotesFromStorage() {
    return storageService.loadFromStorage(KEY)
}

