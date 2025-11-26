// note service

import { utilService } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'

const NOTE_KEY = 'noteDB'
const CACHE_STORAGE_KEY = 'googleNotesCache'
const gCache = utilService.loadFromStorage(CACHE_STORAGE_KEY) || {}
_createNotes()

export const noteService = {
    query,
    get,
    remove,
    save,
    getEmptyNote,
    getDefaultFilter,
}

function query(filterBy = {}) {
    return storageService.query(NOTE_KEY).then((notes) => {
        if (filterBy.txt) {
            const regExp = new RegExp(filterBy.txt, 'i')
            notes = notes.filter((note) => regExp.test(note.info.txt))
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
            backgroundColor: '#fff',
        },
        info: {
            txt: '',
        },
    }
}

function getDefaultFilter(filterBy = { title: '', minPrice: 0 }) {
    return { title: filterBy.title, minPrice: filterBy.minPrice }
}

function _saveDataToCache(key, data) {
    gCache[key] = {
        data,
        lastFetched: Date.now(),
    }
    utilService.saveToStorage(CACHE_STORAGE_KEY, gCache)
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
                    backgroundColor: '#fff',
                },
                info: {
                    txt: 'Fullstack Me Baby!',
                },
            },
            {
                id: 'n102',
                createdAt: 1112223,
                type: 'NoteImg',
                isPinned: false,
                style: {
                    backgroundColor: '#fff',
                },
                info: {
                    url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
                    title: 'Bobi and Me',
                },
            },
            {
                id: 'n103',
                createdAt: 1112224,
                type: 'NoteTodos',
                isPinned: false,
                style: {
                    backgroundColor: '#fff',
                },
                info: {
                    title: 'Get my stuff together',
                    todos: [
                        { txt: 'Driving license', isDone: true },
                        { txt: 'Coding power', isDone: false },
                    ],
                },
            },
        ]
        utilService.saveToStorage(NOTE_KEY, notes)
    }
}

function _setNextPrevNoteId(note) {
    return storageService.query(NOTE_KEY).then((notes) => {
        const noteIdx = notes.findIndex((currNote) => currNote.id === note.id)
        const nextNote = notes[noteIdx + 1] ? notes[noteIdx + 1] : notes[0]
        const prevNote = notes[noteIdx - 1] ? notes[noteIdx - 1] : notes[notes.length - 1]
        note.nextNoteId = nextNote.id
        note.prevNoteId = prevNote.id
        return note
    })
}
