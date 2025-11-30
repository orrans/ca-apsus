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
    saveAll,
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
        if (filterBy.label) {
            notes = notes.filter((note) => note.labels.some((label) => label.id === filterBy.label))
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

function saveAll(arr) {
    return storageService.putAll(NOTE_KEY, arr)
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
                id: 'n201',
                createdAt: 1732947010001,
                type: 'NoteTxt',
                isPinned: true,
                style: { backgroundColor: '#ffffff' },
                info: { txt: 'Finish portfolio redesign' },
                labels: [
                    { id: 'l1', name: 'Work' },
                    { id: 'l2', name: 'Personal' },
                ],
            },
            {
                id: 'n203',
                createdAt: 1732947010003,
                type: 'NoteTodos',
                isPinned: false,
                style: { backgroundColor: '#fff3c2' },
                info: {
                    title: 'Groceries',
                    todos: [
                        { txt: 'Milk', isDone: false },
                        { txt: 'Bread', isDone: true },
                        { txt: 'Pasta', isDone: false },
                    ],
                },
                labels: [{ id: 'l4', name: 'Home' }],
            },
            {
                id: 'n204',
                createdAt: 1732947010004,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#e8f0fe' },
                info: { txt: 'Remember to stretch every morning' },
                labels: [{ id: 'l5', name: 'Health' }],
            },
            {
                id: 'n205',
                createdAt: 1732947010005,
                type: 'NoteImg',
                isPinned: false,
                style: { backgroundColor: '#fff' },
                info: {
                    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600',
                    title: 'Portrait idea',
                },
                labels: [{ id: 'l1', name: 'Work' }],
            },
            {
                id: 'n206',
                createdAt: 1732947010006,
                type: 'NoteTxt',
                isPinned: true,
                style: { backgroundColor: '#ffdede' },
                info: { txt: 'Start React animations project' },
                labels: [{ id: 'l2', name: 'Personal' }],
            },
            {
                id: 'n207',
                createdAt: 1732947010007,
                type: 'NoteTodos',
                isPinned: false,
                style: { backgroundColor: '#f0ffe0' },
                info: {
                    title: 'Morning tasks',
                    todos: [
                        { txt: 'Coffee', isDone: true },
                        { txt: 'Check emails', isDone: false },
                    ],
                },
                labels: [{ id: 'l1', name: 'Work' }],
            },
            {
                id: 'n208',
                createdAt: 1732947010008,
                type: 'NoteImg',
                isPinned: false,
                style: { backgroundColor: '#fafafa' },
                info: {
                    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600',
                    title: 'Mountain inspiration',
                },
                labels: [{ id: 'l3', name: 'Travel' }],
            },
            {
                id: 'n209',
                createdAt: 1732947010009,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#e8fdf5' },
                info: { txt: 'Idea for new app: Smart tasks' },
                labels: [{ id: 'l1', name: 'Work' }],
            },
            {
                id: 'n210',
                createdAt: 1732947010010,
                type: 'NoteTodos',
                isPinned: false,
                style: { backgroundColor: '#fff7b1' },
                info: {
                    title: 'Things to learn',
                    todos: [
                        { txt: 'TypeScript', isDone: false },
                        { txt: 'Node patterns', isDone: false },
                        { txt: 'Advanced CSS', isDone: true },
                    ],
                },
                labels: [{ id: 'l2', name: 'Personal' }],
            },
            {
                id: 'n212',
                createdAt: 1732947010012,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#f3e8ff' },
                info: { txt: 'Quote: It always seems impossible until it is done' },
                labels: [{ id: 'l2', name: 'Personal' }],
            },
            {
                id: 'n213',
                createdAt: 1732947010013,
                type: 'NoteTxt',
                isPinned: true,
                style: { backgroundColor: '#dff4ff' },
                info: { txt: 'Plan next week sprint' },
                labels: [{ id: 'l1', name: 'Work' }],
            },
            {
                id: 'n214',
                createdAt: 1732947010014,
                type: 'NoteTodos',
                isPinned: false,
                style: { backgroundColor: '#ffe8e8' },
                info: {
                    title: 'Fix at home',
                    todos: [
                        { txt: 'Change light bulb', isDone: false },
                        { txt: 'Clean balcony', isDone: false },
                    ],
                },
                labels: [{ id: 'l4', name: 'Home' }],
            },
            {
                id: 'n215',
                createdAt: 1732947010015,
                type: 'NoteImg',
                isPinned: false,
                style: { backgroundColor: '#ffffff' },
                info: {
                    url: 'https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=600',
                    title: 'Focus mode',
                },
                labels: [{ id: 'l2', name: 'Personal' }],
            },
            {
                id: 'n216',
                createdAt: 1732947010016,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#ffffe0' },
                info: { txt: 'Pick a gift for Dor and Dorin' },
                labels: [{ id: 'l4', name: 'Home' }],
            },
            {
                id: 'n217',
                createdAt: 1732947010017,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#e0fff4' },
                info: { txt: 'New animation ideas for Ari and Neri stories' },
                labels: [{ id: 'l2', name: 'Personal' }],
            },
            {
                id: 'n219',
                createdAt: 1732947010019,
                type: 'NoteTodos',
                isPinned: false,
                style: { backgroundColor: '#fff0e0' },
                info: {
                    title: 'Weekend plans',
                    todos: [
                        { txt: 'Movie night', isDone: false },
                        { txt: 'Cook something new', isDone: true },
                    ],
                },
                labels: [{ id: 'l2', name: 'Personal' }],
            },
            {
                id: 'n220',
                createdAt: 1732947010020,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#d9ecff' },
                info: { txt: 'Learn more about Playwright automation' },
                labels: [{ id: 'l1', name: 'Work' }],
            },
            {
                id: 'n221',
                createdAt: 1732947010021,
                type: 'NoteImg',
                isPinned: false,
                style: { backgroundColor: '#ffffff' },
                info: {
                    url: 'https://images.unsplash.com/photo-1433878455169-4698e60005b1?q=80&w=600',
                    title: 'Morning coffee',
                },
                labels: [{ id: 'l2', name: 'Personal' }],
            },
            {
                id: 'n222',
                createdAt: 1732947010022,
                type: 'NoteTxt',
                isPinned: true,
                style: { backgroundColor: '#ffeefc' },
                info: { txt: 'Start idea list for new mobile game' },
                labels: [{ id: 'l1', name: 'Work' }],
            },
            {
                id: 'n223',
                createdAt: 1732947010023,
                type: 'NoteTodos',
                isPinned: false,
                style: { backgroundColor: '#eaffea' },
                info: {
                    title: 'Fitness goals',
                    todos: [
                        { txt: 'Run 3 km', isDone: false },
                        { txt: 'Drink 2 L of water', isDone: true },
                    ],
                },
                labels: [{ id: 'l5', name: 'Health' }],
            },
            {
                id: 'n224',
                createdAt: 1732947010024,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#e7f7ff' },
                info: { txt: 'Write next LinkedIn post' },
                labels: [{ id: 'l1', name: 'Work' }],
            },
            {
                id: 'n225',
                createdAt: 1732947010025,
                type: 'NoteImg',
                isPinned: false,
                style: { backgroundColor: '#fafafa' },
                info: {
                    url: 'https://images.unsplash.com/photo-1541698444083-023c97d3f4b6?q=80&w=600',
                    title: 'Simple workspace',
                },
                labels: [{ id: 'l1', name: 'Work' }],
            },
            {
                id: 'n226',
                createdAt: 1732947010026,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#fff3e0' },
                info: { txt: 'Buy new notebook for ideas' },
                labels: [{ id: 'l2', name: 'Personal' }],
            },
            {
                id: 'n227',
                createdAt: 1732947010027,
                type: 'NoteTodos',
                isPinned: false,
                style: { backgroundColor: '#fafad2' },
                info: {
                    title: 'Study goals',
                    todos: [
                        { txt: 'Finish Python Day 20', isDone: true },
                        { txt: 'React components practice', isDone: false },
                    ],
                },
                labels: [{ id: 'l2', name: 'Personal' }],
            },
            {
                id: 'n228',
                createdAt: 1732947010028,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#f5f5f5' },
                info: { txt: 'Think about new character for animation project' },
                labels: [{ id: 'l2', name: 'Personal' }],
            },
            {
                id: 'n229',
                createdAt: 1732947010029,
                type: 'NoteImg',
                isPinned: false,
                style: { backgroundColor: '#ffffff' },
                info: {
                    url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=600',
                    title: 'Happy moment',
                },
                labels: [{ id: 'l4', name: 'Home' }],
            },
            {
                id: 'n230',
                createdAt: 1732947010030,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#e0e0ff' },
                info: { txt: 'Try new CSS grid layout for Keep clone' },
                labels: [{ id: 'l1', name: 'Work' }],
            },
            {
                id: 'n301',
                createdAt: 1732948010001,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#ffffff' },
                info: { txt: 'Remember to back up the project files' },
                labels: [{ id: 'l1', name: 'Work' }],
            },
            {
                id: 'n303',
                createdAt: 1732948010003,
                type: 'NoteTodos',
                isPinned: false,
                style: { backgroundColor: '#fff9c4' },
                info: {
                    title: 'House chores',
                    todos: [
                        { txt: 'Laundry', isDone: false },
                        { txt: 'Wash dishes', isDone: true },
                    ],
                },
                labels: [{ id: 'l4', name: 'Home' }],
            },
            {
                id: 'n304',
                createdAt: 1732948010004,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#e8f0fe' },
                info: { txt: 'Try new VS Code theme later' },
                labels: [{ id: 'l2', name: 'Personal' }],
            },
            {
                id: 'n305',
                createdAt: 1732948010005,
                type: 'NoteImg',
                isPinned: true,
                style: { backgroundColor: '#ffffff' },
                info: {
                    url: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?q=70&w=600',
                    title: 'Coding atmosphere',
                },
                labels: [{ id: 'l1', name: 'Work' }],
            },
            {
                id: 'n306',
                createdAt: 1732948010006,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#ffebee' },
                info: { txt: 'Check the new animation reference pack' },
                labels: [{ id: 'l6', name: 'Art' }],
            },
            {
                id: 'n307',
                createdAt: 1732948010007,
                type: 'NoteTodos',
                isPinned: false,
                style: { backgroundColor: '#f1f8e9' },
                info: {
                    title: 'Workout plan',
                    todos: [
                        { txt: '20 push ups', isDone: true },
                        { txt: 'Squats', isDone: false },
                        { txt: 'Stretching', isDone: false },
                    ],
                },
                labels: [{ id: 'l5', name: 'Health' }],
            },
            {
                id: 'n308',
                createdAt: 1732948010008,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#e0f7fa' },
                info: { txt: 'Brainstorm mobile game upgrades' },
                labels: [{ id: 'l1', name: 'Work' }],
            },
            {
                id: 'n310',
                createdAt: 1732948010010,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#ffffe0' },
                info: { txt: 'List sound effects needed for the next animation' },
                labels: [{ id: 'l6', name: 'Art' }],
            },
            {
                id: 'n311',
                createdAt: 1732948010011,
                type: 'NoteTodos',
                isPinned: false,
                style: { backgroundColor: '#e3f2fd' },
                info: {
                    title: 'Things for the trip',
                    todos: [
                        { txt: 'Charger', isDone: true },
                        { txt: 'Snacks', isDone: false },
                        { txt: 'Camera', isDone: false },
                    ],
                },
                labels: [{ id: 'l3', name: 'Travel' }],
            },
            {
                id: 'n312',
                createdAt: 1732948010012,
                type: 'NoteTxt',
                isPinned: true,
                style: { backgroundColor: '#f8bbd0' },
                info: { txt: 'Finish reading the UI design book' },
                labels: [{ id: 'l2', name: 'Personal' }],
            },
            {
                id: 'n314',
                createdAt: 1732948010014,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#f5f5f5' },
                info: { txt: 'Think about new features for Keep clone' },
                labels: [{ id: 'l1', name: 'Work' }],
            },
            {
                id: 'n315',
                createdAt: 1732948010015,
                type: 'NoteTodos',
                isPinned: false,
                style: { backgroundColor: '#fffde7' },
                info: {
                    title: 'Tasks for tomorrow',
                    todos: [
                        { txt: 'Check email replies', isDone: false },
                        { txt: 'Work on the todo list bug', isDone: false },
                        { txt: 'Try new React pattern', isDone: true },
                    ],
                },
                labels: [{ id: 'l1', name: 'Work' }],
            },
            {
                id: 'n316',
                createdAt: 1732948010016,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#ede7f6' },
                info: { txt: 'Concept ideas for next drawing session' },
                labels: [{ id: 'l6', name: 'Art' }],
            },
            {
                id: 'n318',
                createdAt: 1732948010018,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#e0ffe0' },
                info: { txt: 'Next steps for Python study plan' },
                labels: [{ id: 'l2', name: 'Personal' }],
            },
            {
                id: 'n319',
                createdAt: 1732948010019,
                type: 'NoteTodos',
                isPinned: false,
                style: { backgroundColor: '#fbe9e7' },
                info: {
                    title: 'Meal prep',
                    todos: [
                        { txt: 'Cut vegetables', isDone: false },
                        { txt: 'Cook rice', isDone: true },
                    ],
                },
                labels: [{ id: 'l4', name: 'Home' }],
            },
            {
                id: 'n320',
                createdAt: 1732948010020,
                type: 'NoteTxt',
                isPinned: true,
                style: { backgroundColor: '#e3fcec' },
                info: { txt: 'Plan next update for the Notes app' },
                labels: [{ id: 'l1', name: 'Work' }],
            },
            {
                id: 'n321',
                createdAt: 1732948010021,
                type: 'NoteImg',
                isPinned: false,
                style: { backgroundColor: '#fafafa' },
                info: {
                    url: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?q=70&w=600',
                    title: 'Mountain river',
                },
                labels: [{ id: 'l3', name: 'Travel' }],
            },
            {
                id: 'n322',
                createdAt: 1732948010022,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#fff3e0' },
                info: { txt: 'Pick a gift for the twins birthday' },
                labels: [{ id: 'l4', name: 'Home' }],
            },
            {
                id: 'n323',
                createdAt: 1732948010023,
                type: 'NoteTodos',
                isPinned: false,
                style: { backgroundColor: '#e8f5e9' },
                info: {
                    title: 'Side project tasks',
                    todos: [
                        { txt: 'Fix routing', isDone: false },
                        { txt: 'Improve layout', isDone: false },
                        { txt: 'Add keyboard shortcuts', isDone: true },
                    ],
                },
                labels: [{ id: 'l1', name: 'Work' }],
            },
            {
                id: 'n324',
                createdAt: 1732948010024,
                type: 'NoteImg',
                isPinned: false,
                style: { backgroundColor: '#ffffff' },
                info: {
                    url: 'https://images.unsplash.com/photo-1495344517868-8ebaf0a2044a?q=70&w=600',
                    title: 'Calm waters',
                },
                labels: [{ id: 'l3', name: 'Travel' }],
            },
            {
                id: 'n325',
                createdAt: 1732948010025,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#f0f4c3' },
                info: { txt: 'Research new animation effects in After Effects' },
                labels: [{ id: 'l6', name: 'Art' }],
            },
            {
                id: 'n326',
                createdAt: 1732948010026,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#e8eaf6' },
                info: { txt: 'Check job listings this weekend' },
                labels: [{ id: 'l2', name: 'Personal' }],
            },
            {
                id: 'n327',
                createdAt: 1732948010027,
                type: 'NoteImg',
                isPinned: true,
                style: { backgroundColor: '#ffffff' },
                info: {
                    url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=70&w=600',
                    title: 'Dreamy sky',
                },
                labels: [{ id: 'l2', name: 'Personal' }],
            },
            {
                id: 'n328',
                createdAt: 1732948010028,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#e0f2f1' },
                info: { txt: 'Ideas for new LinkedIn posts' },
                labels: [{ id: 'l1', name: 'Work' }],
            },
            {
                id: 'n329',
                createdAt: 1732948010029,
                type: 'NoteTodos',
                isPinned: false,
                style: { backgroundColor: '#fff8e1' },
                info: {
                    title: 'Prepare backpack',
                    todos: [
                        { txt: 'Water bottle', isDone: true },
                        { txt: 'Extra shirt', isDone: true },
                        { txt: 'Headphones', isDone: false },
                    ],
                },
                labels: [{ id: 'l3', name: 'Travel' }],
            },
            {
                id: 'n330',
                createdAt: 1732948010030,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#fce4ec' },
                info: { txt: 'Make a list of episodes for animation series' },
                labels: [{ id: 'l6', name: 'Art' }],
            },
            {
                id: 'n401',
                createdAt: 1732949010001,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#ffffff' },
                info: { txt: 'Set reminders for next week tasks' },
                labels: [{ id: 'l1', name: 'Work' }],
            },
            {
                id: 'n403',
                createdAt: 1732949010003,
                type: 'NoteTodos',
                isPinned: false,
                style: { backgroundColor: '#fff9c4' },
                info: {
                    title: 'Study tonight',
                    todos: [
                        { txt: 'Review JavaScript notes', isDone: true },
                        { txt: 'Continue React tutorial', isDone: false },
                    ],
                },
                labels: [{ id: 'l2', name: 'Personal' }],
            },
            {
                id: 'n404',
                createdAt: 1732949010004,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#f3e5f5' },
                info: { txt: 'Think about ideas for 2D animation course' },
                labels: [{ id: 'l6', name: 'Art' }],
            },
            {
                id: 'n406',
                createdAt: 1732949010006,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#e0f7fa' },
                info: { txt: 'Possible upgrades for the castle defense game' },
                labels: [{ id: 'l1', name: 'Work' }],
            },
            {
                id: 'n407',
                createdAt: 1732949010007,
                type: 'NoteTodos',
                isPinned: false,
                style: { backgroundColor: '#f1f8e9' },
                info: {
                    title: 'Prepare meeting points',
                    todos: [
                        { txt: 'Review agenda', isDone: false },
                        { txt: 'Prepare slides', isDone: false },
                    ],
                },
                labels: [{ id: 'l1', name: 'Work' }],
            },
            {
                id: 'n409',
                createdAt: 1732949010009,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#fff8e1' },
                info: { txt: 'Check bank account summary' },
                labels: [{ id: 'l4', name: 'Home' }],
            },
            {
                id: 'n410',
                createdAt: 1732949010010,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#e8f5e9' },
                info: { txt: 'List new ideas for Playwright automation scripts' },
                labels: [{ id: 'l1', name: 'Work' }],
            },
            {
                id: 'n412',
                createdAt: 1732949010012,
                type: 'NoteTodos',
                isPinned: false,
                style: { backgroundColor: '#fce4ec' },
                info: {
                    title: 'Prepare art equipment',
                    todos: [
                        { txt: 'Sharpen pencils', isDone: true },
                        { txt: 'Clean brushes', isDone: false },
                    ],
                },
                labels: [{ id: 'l6', name: 'Art' }],
            },
            {
                id: 'n413',
                createdAt: 1732949010013,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#e0f2f1' },
                info: { txt: 'Review last week commits' },
                labels: [{ id: 'l1', name: 'Work' }],
            },
            {
                id: 'n414',
                createdAt: 1732949010014,
                type: 'NoteImg',
                isPinned: true,
                style: { backgroundColor: '#ffffff' },
                info: {
                    url: 'https://images.unsplash.com/photo-1540206395-68808572332f?q=70&w=600',
                    title: 'Calm field',
                },
                labels: [{ id: 'l2', name: 'Personal' }],
            },
            {
                id: 'n415',
                createdAt: 1732949010015,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#f5f5f5' },
                info: { txt: 'Reorganize folder structure in the project' },
                labels: [{ id: 'l1', name: 'Work' }],
            },
            {
                id: 'n416',
                createdAt: 1732949010016,
                type: 'NoteTodos',
                isPinned: false,
                style: { backgroundColor: '#fffde7' },
                info: {
                    title: 'Shopping list',
                    todos: [
                        { txt: 'Olive oil', isDone: false },
                        { txt: 'Tomatoes', isDone: true },
                    ],
                },
                labels: [{ id: 'l4', name: 'Home' }],
            },
            {
                id: 'n417',
                createdAt: 1732949010017,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#ede7f6' },
                info: { txt: 'Research new design systems' },
                labels: [{ id: 'l1', name: 'Work' }],
            },
            {
                id: 'n419',
                createdAt: 1732949010019,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#e0f7fa' },
                info: { txt: 'Plan next Python project challenge' },
                labels: [{ id: 'l2', name: 'Personal' }],
            },
            {
                id: 'n420',
                createdAt: 1732949010020,
                type: 'NoteTodos',
                isPinned: false,
                style: { backgroundColor: '#f9fbe7' },
                info: {
                    title: 'Sunday cleanup',
                    todos: [
                        { txt: 'Sweep the floor', isDone: false },
                        { txt: 'Change bed sheets', isDone: true },
                    ],
                },
                labels: [{ id: 'l4', name: 'Home' }],
            },
            {
                id: 'n421',
                createdAt: 1732949010021,
                type: 'NoteTxt',
                isPinned: true,
                style: { backgroundColor: '#f3e5f5' },
                info: { txt: 'Ideas for new plugins in the IDE project' },
                labels: [{ id: 'l1', name: 'Work' }],
            },
            {
                id: 'n423',
                createdAt: 1732949010023,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#fff3e0' },
                info: { txt: 'Look up new fitness routines' },
                labels: [{ id: 'l5', name: 'Health' }],
            },
            {
                id: 'n424',
                createdAt: 1732949010024,
                type: 'NoteTodos',
                isPinned: false,
                style: { backgroundColor: '#e8f5e9' },
                info: {
                    title: 'Prepare environment',
                    todos: [
                        { txt: 'Install dependencies', isDone: true },
                        { txt: 'Run tests', isDone: false },
                    ],
                },
                labels: [{ id: 'l1', name: 'Work' }],
            },
            {
                id: 'n425',
                createdAt: 1732949010025,
                type: 'NoteImg',
                isPinned: true,
                style: { backgroundColor: '#ffffff' },
                info: {
                    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=70&w=600',
                    title: 'Sunshine view',
                },
                labels: [{ id: 'l3', name: 'Travel' }],
            },
            {
                id: 'n426',
                createdAt: 1732949010026,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#f0f4c3' },
                info: { txt: 'Find references for animation character poses' },
                labels: [{ id: 'l6', name: 'Art' }],
            },
            {
                id: 'n427',
                createdAt: 1732949010027,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#e8eaf6' },
                info: { txt: 'Write weekly study recap' },
                labels: [{ id: 'l2', name: 'Personal' }],
            },
            {
                id: 'n429',
                createdAt: 1732949010029,
                type: 'NoteTodos',
                isPinned: false,
                style: { backgroundColor: '#f0f4c3' },
                info: {
                    title: 'School tasks',
                    todos: [
                        { txt: 'Print worksheets', isDone: true },
                        { txt: 'Prepare bag', isDone: false },
                    ],
                },
                labels: [{ id: 'l2', name: 'Personal' }],
            },
            {
                id: 'n430',
                createdAt: 1732949010030,
                type: 'NoteTxt',
                isPinned: false,
                style: { backgroundColor: '#fce4ec' },
                info: { txt: 'Plan a coloring page for the kids' },
                labels: [{ id: 'l6', name: 'Art' }],
            },
        ]

        utilService.saveToStorage(NOTE_KEY, notes)
    }
}
