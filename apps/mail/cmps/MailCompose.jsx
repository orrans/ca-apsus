import { emailService } from '../services/mail.service.js'
import { showSuccessMsg, showErrorMsg } from '../../../services/event-bus.service.js'

const { useState } = React

export function ComposeEmail({ onEmailAdded }) {
    const [newEmail, setNewEmail] = useState({ to: '', subject: '', body: '' })

    function onComposeChange(ev) {
        const { name, value } = ev.target
        setNewEmail(prevEmail => ({ ...prevEmail, [name]: value }))
    }

    function onAddEmail(ev) {
        ev.preventDefault()
        const { to, subject, body } = newEmail
        if (!subject && !body && !to) return

        const emailToSave = emailService.getEmptyEmail(subject || '(no subject)', 'me@appsus.com', false)
        emailToSave.to = to
        emailToSave.body = body
        emailToSave.sentAt = Date.now()

        emailService.sendEmail(emailToSave)
            .then(savedEmail => {
                setNewEmail({ to: '', subject: '', body: '' })
                showSuccessMsg('Email sent')
                if (onEmailAdded) onEmailAdded(savedEmail)
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Failed to add email')
            })
    }

    return (
        <form className="compose-form" onSubmit={onAddEmail}>
            <input
                type="email"
                name="to"
                placeholder="To"
                value={newEmail.to}
                onChange={onComposeChange}
            />
            <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={newEmail.subject}
                onChange={onComposeChange}
            />
            <textarea
                name="body"
                placeholder="Body"
                value={newEmail.body}
                onChange={onComposeChange}
            />
            <button type="submit">Add Email</button>
        </form>
    )
}


