import { utilService } from '../../../services/util.service.js'
import { notesService } from "./note.service.js";


export const todosService = {
    addTodo,
    deleteTodo,
    updateTodosEdit
}

function updateTodosEdit(note){
    let notes = notesService._loadNotesFromStorage()
    const noteId = note.id
    const noteIdx = notes.findIndex(note => note.id === noteId)
    notes[noteIdx ] = note
    notesService._saveNotesToStorage(notes)
    return Promise.resolve(note)
}

function deleteTodo(noteId,todoId){
    let notes = notesService._loadNotesFromStorage()
    let note = notes.find(note => note.id === noteId)
    let todoIdx = note.info.todos.findIndex(todo => todo.id === todoId)
    note.info.todos.splice(todoIdx,1)
    notesService._saveNotesToStorage(notes)
    return Promise.resolve(note)
}

function addTodo(todo,noteId){
    let notes = notesService._loadNotesFromStorage()
    let note = notes.find(note => note.id === noteId)
    note.info.todos.push({id: utilService.makeId(), txt: todo, doneAt: null})
    notesService._saveNotesToStorage(notes)
    return Promise.resolve(note)
}