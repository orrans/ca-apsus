import { emailService } from '../services/mail.service.js'
import { showSuccessMsg, showErrorMsg } from '../../../services/event-bus.service.js'

export function useEmailActions(setEmails, onUpdateUnreadCount, navigate, currentFolder) {
    
    function onRemoveEmail(emailId) {
        emailService.remove(emailId)
            .then(() => {
                setEmails(emails => (
                    emails.filter(email => email.id !== emailId)))
                onUpdateUnreadCount()
                showSuccessMsg(`Email removed successfully(${emailId})`)
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg(`Failed to remove email(${emailId})`)
            })
    }

    function onReadEmail(emailId) {
        emailService.readEmail(emailId)
            .then(() => {
                // Update unread count before navigation
                onUpdateUnreadCount()
                // navigate with current folder
                navigate(`/mail/${currentFolder}/${emailId}`)
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg(`Failed to read email(${emailId})`)
            })
    }

    function onArchiveEmail(emailId) {
        emailService.get(emailId)
            .then(email => {
                email.folder = 'archive'
                return emailService.save(email)
            })
            .then(() => {
                setEmails(emails => emails.filter(email => email.id !== emailId))
                onUpdateUnreadCount()
                showSuccessMsg('Email archived')
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Failed to archive email')
            })
    }

    function onStarEmail(emailId) {
        // update UI immediately
        setEmails(emails => emails.map(email =>
            email.id === emailId ? { ...email, isStarred: !email.isStarred } : email
        ))
        emailService.get(emailId)
            .then(email => {
                email.isStarred = !email.isStarred
                return emailService.save(email)
            })
    }

    function onImportantEmail(emailId) {
        setEmails(emails => emails.map(email =>
            email.id === emailId ? { ...email, isImportant: !email.isImportant } : email
        ))
        emailService.get(emailId)
            .then(email => {
                email.isImportant = !email.isImportant
                return emailService.save(email)
            })
    }

    function onToggleReadStatus(emailId) {
        emailService.get(emailId)
            .then(email => {
                email.isRead = !email.isRead
                return emailService.save(email)
            })
            .then(() => {
                setEmails(emails => emails.map(email =>
                    email.id === emailId ? { ...email, isRead: !email.isRead } : email
                ))
                onUpdateUnreadCount()
                showSuccessMsg('Email status updated')
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Failed to update email status')
            })
    }

    function onSnoozeEmail(emailId) {
        // just show a message
        showSuccessMsg('Email snoozed')
    }

    function onBulkAction(emailIds, action) {
        emailService.bulkAction(emailIds, action)
            .then(() => {
                if (action === 'delete' || action === 'archive') {
                    setEmails(emails => emails.filter(email =>
                        !emailIds.includes(email.id)))
                } else if (action === 'toggleRead') {
                    setEmails(emails => {
                        const selectedEmails = emails.filter(email => emailIds.includes(email.id))
                        const allRead = selectedEmails.every(email => email.isRead)
                        const targetReadState = allRead ? false : true
                        return emails.map(email =>
                            emailIds.includes(email.id) ? { ...email, isRead: targetReadState } : email
                        )
                    })
                }
                onUpdateUnreadCount()

                const actionMessages = {
                    archive: 'archived',
                    delete: 'deleted',
                    toggleRead: 'status updated'
                }
                showSuccessMsg(`${emailIds.length} email(s) ${actionMessages[action]}`)
            })
            .catch(err => {
                console.log('err:', err)
                const errorMessages = {
                    archive: 'Failed to archive emails',
                    delete: 'Failed to delete emails',
                    toggleRead: 'Failed to update email status'
                }
                showErrorMsg(errorMessages[action] || 'Failed to perform action')
            })
    }

    return {
        onRemoveEmail,
        onReadEmail,
        onArchiveEmail,
        onStarEmail,
        onImportantEmail,
        onToggleReadStatus,
        onSnoozeEmail,
        onBulkAction
    }
}

