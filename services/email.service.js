import { loadFromStorage, makeId, saveToStorage, getRandomIntInclusive, randomTrueFalse, makeLorem } from './util.service.js'
import { storageService } from './async-storage.service.js'

const EMAIL_KEY = 'emailDB'
let gUsedEmailIds = new Set()
_initUsedEmailIds()
_createEmails()

export const emailService = {
    query,
    get,
    remove,
    save,
    getEmptyEmail,
    getDefaultFilter,
}

function query(filterBy = {}) {
    return storageService.query(EMAIL_KEY)
        .then(emails => {
            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                emails = emails.filter(email => regExp.test(email.subject))
            }
            // if (filterBy.listPrice) {
            //     emails = emails.filter(email => email.listPrice.amount >= filterBy.listPrice)
            // }
            // if (filterBy.onSale) {
            //     emails = emails.filter(email => email.listPrice.isOnSale === true)
            // }
            // if (filterBy.categories && filterBy.categories.length > 0) {
            //     const filterCategoriesLower = filterBy.categories.map(cat => cat.toLowerCase())
            //     emails = emails.filter(book => 
            //         book.categories && book.categories.some(category => 
            //             filterCategoriesLower.includes(category.toLowerCase())
            //         )
            //     )
            // }
            return emails
        })
}

function get(emailId) {
    return storageService.get(EMAIL_KEY, emailId).then(email => _setNextPrevEmailId(email))
}

function remove(emailId) {
    // return Promise.reject('Oh No!')
    return storageService.remove(EMAIL_KEY, emailId)
        .then(() => {
            gUsedEmailIds.delete(emailId)
            return emailId
        })
}

function save(email) {
    if (email.id) {
        return storageService.put(EMAIL_KEY, email)
    } else {
        email.id = _generateUniqueEmailId()
        return storageService.post(EMAIL_KEY, email)
            .then(savedEmail => {
                gUsedEmailIds.add(savedEmail.id)
                return savedEmail
            })
    }
}

function getEmptyEmail(subject, sentFrom = '', trueFalse = false) {
    return {
        isRead: trueFalse,
        from: sentFrom,
        description: '',
        subject: subject,
        sentDate: null,
        language: ''
    }
}

function getDefaultFilter() {
    return { txt: '' }
}

// function getAllCategories() {    maybe add later with primary,social,updates,promotions
//     return storageService.query(EMAIL_KEY)
//         .then(books => {
//             const categoriesSet = new Set()
//             books.forEach(book => {
//                 if (book.categories && book.categories.length > 0) {
//                     book.categories.forEach(category => {
//                         categoriesSet.add(category)
//                     })
//                 }
//             })
//             return Array.from(categoriesSet).sort()
//         })
// }

function _initUsedEmailIds() {   //used to initialize the globalused book ids var
    const emails = loadFromStorage(EMAIL_KEY)
    if (emails && emails.length) {
        emails.forEach(email => {
            if (email.id) {
                gUsedEmailIds.add(email.id)
            }
        })
    }
}

function _generateUniqueEmailId() {
    let newId = makeId()
    while (gUsedEmailIds.has(newId)) {
        newId = makeId()
    }
    return newId
}

function _createEmails() {
    let emails = loadFromStorage(EMAIL_KEY)
    if (!emails || !emails.length) {
        emails = [
            _createEmail({ subject: 'Welcome to Your New Email!', from: 'someone@example.com' }),
            _createEmail({ subject: 'Your order has shipped!', from: 'orders@shop.com' }),
            _createEmail({ subject: 'Meeting reminder: Tomorrow at 2pm', from: 'calendar@workplace.com' }),
            _createEmail({ subject: 'Weekly newsletter - Top stories', from: 'news@newsletter.io' }),
            _createEmail({ subject: 'Password reset requested', from: 'security@accounts.com' }),
            _createEmail({ subject: 'Invoice #12345 from Acme Corp', from: 'billing@acmecorp.com' }),
            _createEmail({ subject: 'You have a new message', from: 'notifications@social.net' }),
            _createEmail({ subject: 'Congratulations on your achievement!', from: 'team@company.com' }),
            _createEmail({ subject: 'Your subscription will expire soon', from: 'support@service.io' }),
            _createEmail({ subject: 'Monthly report ready for review', from: 'reports@analytics.com' }),
            _createEmail({ subject: 'New comment on your post', from: 'updates@forum.com' }),
            _createEmail({ subject: 'Special offer: 50% off today only!', from: 'deals@retail.com' }),
            _createEmail({ subject: 'Your appointment is confirmed', from: 'appointments@clinic.com' }),
            _createEmail({ subject: 'Project deadline approaching', from: 'pm@projects.io' }),
            _createEmail({ subject: 'Thank you for your purchase', from: 'sales@store.com' }),
            _createEmail({ subject: 'System maintenance scheduled', from: 'admin@platform.com' }),
            _createEmail({ subject: 'Friend request from Jane Smith', from: 'connect@network.com' }),
            _createEmail({ subject: 'Your payment was successful', from: 'payments@gateway.io' }),
            _createEmail({ subject: 'New job opportunities matching your profile', from: 'jobs@careers.com' }),
            _createEmail({ subject: 'Weekly digest: 5 new items', from: 'digest@app.io' }),
            _createEmail({ subject: 'Feedback requested: How did we do?', from: 'feedback@service.com' })
        ]
        saveToStorage(EMAIL_KEY, emails)
    }
}

function _createEmail({ subject, from, sentDate = null, language = '' }) {
    const email = getEmptyEmail(subject, from, randomTrueFalse())
    email.id = _generateUniqueEmailId()
    gUsedEmailIds.add(email.id)
    email.description = makeLorem(getRandomIntInclusive(20, 150))
    email.language = language ? language : 'en'
    email.subject = makeLorem(getRandomIntInclusive(2, 15))
    email.sentDate = sentDate ? sentDate : Date.now() - getRandomIntInclusive(0, 10000000000)
    return email
}

function _setNextPrevEmailId(email) {
    return query().then((emails) => {
        const emailIdx = emails.findIndex((currEmail) => currEmail.id === email.id)
        const nextEmail = emails[emailIdx + 1] ? emails[emailIdx + 1] : emails[0]
        const prevEmail = emails[emailIdx - 1] ? emails[emailIdx - 1] : emails[emails.length - 1]
        email.nextEmailId = nextEmail.id
        email.prevEmailId = prevEmail.id
        return email
    })
}
