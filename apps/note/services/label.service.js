// label service

import { utilService } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'

const LABEL_KEY = 'labelDB'
_createLabels()

export const labelService = {
    query,
    get,
    remove,
    save,
    getEmptyLabel,
}

function query(filterBy = '') {
    return storageService.query(LABEL_KEY).then((labels) => {
        if (filterBy) {
            const regExp = new RegExp(filterBy, 'i')
            labels = labels.filter((label) => regExp.test(label.name))
        }
        return labels
    })
}

function get(labelId) {
    return storageService.get(LABEL_KEY, labelId)
}

function remove(labelId) {
    return storageService.remove(LABEL_KEY, labelId)
}

function save(label) {
    if (label.id) {
        return storageService.put(LABEL_KEY, label)
    } else {
        return storageService.post(LABEL_KEY, label)
    }
}

function getEmptyLabel() {
    return {
        name: '',
    }
}

// ~~~~~~~~~~~~~~~~LOCAL FUNCTIONS~~~~~~~~~~~~~~~~~~~

function _createLabels() {
    let labels = utilService.loadFromStorage(LABEL_KEY)
    if (!labels || !labels.length) {
        labels = [
            { id: 'l1', name: 'Work' },
            { id: 'l2', name: 'Personal' },
            { id: 'l3', name: 'Travel' },
            { id: 'l4', name: 'Home' },
            { id: 'l5', name: 'Health' },
            { id: 'l6', name: 'Art' },
        ]
        utilService.saveToStorage(LABEL_KEY, labels)
    }
}
