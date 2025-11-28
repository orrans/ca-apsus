// note service

import { utilService } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'

const NOTE_KEY = 'noteDB'
_createNotes()

export const noteService = {
    query,
    get,
    remove,
    save,
    getEmptyNote,
}

function query(filterBy = {}) {
    return storageService.query(NOTE_KEY).then((notes) => {
        if (filterBy.txt) {
            const regExp = new RegExp(filterBy.txt, 'i')
            notes = notes.filter(
                (note) =>
                    regExp.test(note.info.txt) ||
                    regExp.test(note.info.title) ||
                    (note.info.todos && note.info.todos.some((todo) => regExp.test(todo.txt)))
            )
        }
        if (filterBy.type) {
            notes = notes.filter((note) => note.type === filterBy.type)
        }

        return notes
    })
}

function get(noteId) {
    return storageService.get(NOTE_KEY, noteId).then((note) => _setNextPrevNoteId(note))
}

function remove(noteId) {
    return storageService.remove(NOTE_KEY, noteId)
}

function save(note) {
    if (note.id) {
        return storageService.put(NOTE_KEY, note)
    } else {
        return storageService.post(NOTE_KEY, note)
    }
}

function getEmptyNote() {
    return {
        type: 'NoteTxt',
        isPinned: false,
        style: {
            backgroundColor: '#ffffff',
        },
        info: {
            txt: '',
        },
        labels: [],
    }
}

// ~~~~~~~~~~~~~~~~LOCAL FUNCTIONS~~~~~~~~~~~~~~~~~~~

function _createNotes() {
    let notes = utilService.loadFromStorage(NOTE_KEY)
    if (!notes || !notes.length) {
        notes = [
            {
                id: 'n101',
                createdAt: 1112222,
                type: 'NoteTxt',
                isPinned: true,
                style: {
                    backgroundColor: '#ffffff',
                },
                info: {
                    txt: 'Fullstack Me Baby!',
                },
                labels: [
                    {
                        id: 'n101',
                        name: 'Work',
                    },
                    {
                        id: 'n102',
                        name: 'School',
                    },
                ],
            },
            {
                id: 'n102',
                createdAt: 1112223,
                type: 'NoteImg',
                isPinned: false,
                style: {
                    backgroundColor: '#ffffff',
                },
                info: {
                    url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
                    title: 'Bobi and Me',
                },
                labels: [
                    {
                        id: 'n101',
                        name: 'Work',
                    },
                    {
                        id: 'n102',
                        name: 'School',
                    },
                    {
                        id: 'n103',
                        name: 'Home',
                    },
                ],
            },
            {
                id: 'n103',
                createdAt: 1112224,
                type: 'NoteTodos',
                isPinned: false,
                style: {
                    backgroundColor: '#ffffff',
                },
                info: {
                    title: 'Get my stuff together',
                    todos: [
                        { txt: 'Driving license', isDone: true },
                        { txt: 'Coding power', isDone: false },
                    ],
                },
                labels: [
                    {
                        id: 'n101',
                        name: 'Work',
                    },
                    {
                        id: 'n102',
                        name: 'School',
                    },
                    {
                        id: 'n103',
                        name: 'Home',
                    },
                ],
            },
        ]
        utilService.saveToStorage(NOTE_KEY, notes)
    }
}
