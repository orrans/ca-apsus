import { emailService } from '../services/mail.service.js'
import { showSuccessMsg, showErrorMsg } from '../../../services/event-bus.service.js'
import { eventBusService } from '../../../services/event-bus.service.js'
import '../../../../assets/css/apps/mail/cmps/MailCompose.css'
const { useState , useEffect} = React

export function ComposeEmail({ onEmailAdded, onClose, onDraftSave, initialValues = {} }) {
    const [newEmail, setNewEmail] = useState({ 
        to: initialValues.to || '', 
        subject: initialValues.subject || '', 
        body: initialValues.body || '' 
    })
    const emailRef = React.useRef(newEmail)
    const wasSentRef = React.useRef(false)

    // Sync state when initialValues change
    useEffect(() => {
        if (initialValues.to || initialValues.subject || initialValues.body) {
            setNewEmail(prev => ({
                to: initialValues.to || prev.to,
                subject: initialValues.subject || prev.subject,
                body: initialValues.body || prev.body
            }))
        }
    }, [initialValues.to, initialValues.subject, initialValues.body])

    // Keep ref in sync with state
    useEffect(() => {
        emailRef.current = newEmail
    }, [newEmail])

    // Save draft when component unmounts (modal closes) if there's content and email wasn't sent
    useEffect(() => {
        return () => {
            if (!wasSentRef.current) {
                const { to, subject, body } = emailRef.current
                if ((to || subject || body) && onDraftSave) {
                    onDraftSave(emailRef.current)
                    showSuccessMsg('Draft saved')
                }
            }
        }
    }, [onDraftSave])

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

        wasSentRef.current = true
        emailService.sendEmail(emailToSave)
            .then(savedEmail => {
                setNewEmail({ to: '', subject: '', body: '' })
                showSuccessMsg('Email sent')
                eventBusService.emit('email-counts-changed')
                if (onEmailAdded) onEmailAdded(savedEmail)
            })
            .catch(err => {
                console.log('err:', err)
                wasSentRef.current = false // Reset flag if sending failed
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
            <button type="submit">Send</button>
        </form>
    )
}


