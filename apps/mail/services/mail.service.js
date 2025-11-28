import { loadFromStorage, makeId, saveToStorage, getRandomIntInclusive, randomTrueFalse, makeLorem, isToday, getTimeString } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'

const EMAIL_KEY = 'emailDB'
const loggedinUser = { email: 'user@appsus.com', fullname: 'Mahatma Appsus' }

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
    countUnreadEmails,
    sendEmail,
    readEmail,
    getFolderCount,
    getEmailCounts,
    moveToTrash,
    saveDraft,
    getDateString,
}

function query(filterBy = {}) {
    const { txt = '', folder } = filterBy
    return storageService.query(EMAIL_KEY)
        .then(emails => {
            if (folder) {
                // Handle special folders: starred and important
                if (folder === 'starred') {
                    emails = emails.filter(email => email.isStarred === true)
                } else if (folder === 'important') {
                    emails = emails.filter(email => email.isImportant === true)
                } else {
                    // Regular folder filtering
                    emails = emails.filter(email => email.folder === folder)
                }
            }
            if (txt) {
                const regExp = new RegExp(txt, 'i')
                emails = emails.filter(email =>
                    regExp.test(email.subject) ||
                    regExp.test(email.from) ||
                    regExp.test(email.body)
                )
            }
            return emails
        })
}

function get(emailId) {
    return storageService.get(EMAIL_KEY, emailId).then(email => _setNextPrevEmailId(email))
}

function remove(emailId) {
    return get(emailId).then(email => {
        if (email.folder !== 'trash') {
            return moveToTrash(email)
        }
        return storageService.remove(EMAIL_KEY, emailId)
            .then(() => {
                gUsedEmailIds.delete(emailId)
                return emailId
            })
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
        body: '',
        subject: subject,
        sentAt: null,
        language: '',
        removedAt: null,
        to: '',
        folder: '',
        isStarred: false,
        isImportant: false,
        isSelected: false,
    }
}

function moveToTrash(email) {
    email.folder = 'trash'
    email.removedAt = Date.now()
    return save(email)

}

function getDefaultFilter(searchParams) {
    if (!searchParams) {
        return { txt: '' }
    }
    // handle params object
    if (typeof searchParams.get === 'function') {
        return {
            txt: searchParams.get('txt') || ''
        }
    }
    return {
        txt: searchParams.txt || ''
    }
}

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
            _createEmail({ subject: 'System maintenance scheduled', to: 'admin@platform.com', from: loggedinUser.email }),
            _createEmail({ subject: 'Friend request from Jane Smith', from: 'connect@network.com' }),
            _createEmail({ subject: 'Your payment was successful', to: 'payments@gateway.io', from: loggedinUser.email }),
            _createEmail({ subject: 'New job opportunities matching your profile', from: 'jobs@careers.com' }),
            _createEmail({ subject: 'Weekly digest: 5 new items', to: 'digest@app.io', from: loggedinUser.email }),
            _createEmail({ subject: 'Feedback requested: How did we do?', from: 'feedback@service.com' })
        ]
        saveToStorage(EMAIL_KEY, emails)
    }
}

function sendEmail(email) {
    email.isRead = false
    email.sentAt = Date.now()
    email.from = loggedinUser.email
    email.folder = 'sent'
    return save(email)
}

function saveDraft(emailData) {
    const { to, subject, body } = emailData
    // Only save if there's content in at least one field
    if (!to && !subject && !body) {
        return Promise.resolve(null)
    }
    return query({ folder: 'draft' })
        .then(existingDrafts => {
            const existingDraft = existingDrafts.find(draft => 
                draft.to === (to || null) && 
                draft.subject === (subject || '(no subject)') && 
                draft.body === (body || null)
            )
            if (existingDraft) {    //if draft already exists, return null
                return Promise.resolve(null)
            }
            const draftEmail = emailService.getEmptyEmail(subject || '(no subject)', loggedinUser.email, true)
            draftEmail.to = to || null
            draftEmail.body = body || null
            draftEmail.folder = 'draft'
            draftEmail.sentAt = Date.now()
            return save(draftEmail)
        })
}

function countUnreadEmails() {
    return storageService.query(EMAIL_KEY)
        .then(emails => {
            return emails.filter(email => !email.isRead).length
        })
}

function _createEmail({ subject, from, sentDate = null, language = '', to = loggedinUser.email }) {
    const email = getEmptyEmail(subject, from, randomTrueFalse())
    email.to = to
    email.id = _generateUniqueEmailId()
    gUsedEmailIds.add(email.id)
    email.body = makeLorem(getRandomIntInclusive(20, 150))
    email.language = language ? language : 'en'
    email.subject = makeLorem(getRandomIntInclusive(2, 15))
    email.sentAt = sentDate ? sentDate : Date.now() - getRandomIntInclusive(0, 10000000000)
    return setFolderEmail(email)
}

function setFolderEmail(email) {
    if (email.removedAt) {
        email.folder = 'trash'
    }
    else if (!email.createdAt) {
        email.folder = 'draft'
    }
    if (email.from === loggedinUser.email) {
        email.folder = 'sent'
    }
    else {
        email.folder = 'inbox'
    }
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

function readEmail(emailId) {
    return get(emailId).then(email => {
        email.isRead = true
        return save(email)
    })
}


function getFolderCount(folder) {
    return query({ folder }).then(emails => emails.length)
}

function getEmailCounts() {
    return query().then(emails => {
        return {
            inbox: emails.filter(email => email.folder === 'inbox').length,
            sent: emails.filter(email => email.folder === 'sent').length,
            trash: emails.filter(email => email.folder === 'trash').length,
            draft: emails.filter(email => email.folder === 'draft').length,
            starred: emails.filter(email => email.isStarred === true).length,
            important: emails.filter(email => email.isImportant === true).length,
            archive: emails.filter(email => email.folder === 'archive').length,
        }
    })
}

function getDateString(date) {
    if (isToday(date)) return getTimeString(date)
    const currentYear = new Date().getFullYear()
    const emailYear = date.getFullYear()
    
    if (emailYear === currentYear) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const month = monthNames[date.getMonth()]
        const day = date.getDate()
        return `${month} ${day}`
    } else {
        // Different year: show full date
        return date.toLocaleDateString()
    }
}
