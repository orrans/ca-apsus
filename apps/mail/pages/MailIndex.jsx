import { emailService } from '../../../services/email.service.js'
import { EmailList } from '../cmps/MailList.jsx'
import { ComposeEmail } from '../cmps/ComposeEmail.jsx'
import { showSuccessMsg, showErrorMsg } from '../../../services/event-bus.service.js'
import { MailDetails } from './MailDetails.jsx'

const { useState, useEffect } = React
const { useNavigate, useSearchParams, useParams } = ReactRouterDOM

export function MailIndex() {
    const [emails, setEmails] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isComposeOpen, setIsComposeOpen] = useState(false)
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const [unreadCount, setUnreadCount] = useState(0)
    const { emailId } = useParams()

    useEffect(() => {
        loadEmails()
    }, [])

    useEffect(() => {
        if (!emails) return
        const count = emails.filter(email => !email.isRead).length
        setUnreadCount(count)
    }, [emails])

    useEffect(() => {   //set read if an email is opened
        if (!emailId) return
        emailService.readEmail(emailId).then(() => {
            setEmails(prevEmails =>
                prevEmails.map(prevEmail =>
                    prevEmail.id === emailId ? { ...prevEmail, isRead: true } : prevEmail
                )
            )
        })
        .catch(err => {
            console.log('err:', err)
            showErrorMsg(`Failed to read email(${emailId})`)
        })
    }, [emailId, emails])

    function loadEmails() {
        setIsLoading(true)
        emailService.query()
            .then(emails => setEmails(emails))
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Failed to load emails')
            })
            .finally(() => setIsLoading(false))
    }

    function onRemoveEmail(emailId) {
        emailService.remove(emailId)
            .then(() => {
                setEmails(emails => (
                    emails.filter(email => email.id !== emailId)))
                showSuccessMsg(`Email removed successfully(${emailId})`)
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg(`Failed to remove email(${emailId})`)
            })
    }

    function onBack() {
        navigate('/mail')
    }

    function onReadEmail(emailId) {
        emailService.readEmail(emailId)
            .then(() => {
                setEmails(emails =>
                    emails.map(email =>
                        email.id === emailId ? { ...email, isRead: true } : email
                    )
                )
                navigate(`/mail/${emailId}`)
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg(`Failed to read email(${emailId})`)
            })
    }

    if (isLoading || !emails) return <div>Loading...</div>

    return (
        <section className="mail-index">
            <button
                className="toggle-compose-btn"
                type="button"
                onClick={() => setIsComposeOpen(prev => !prev)}
            >
                {isComposeOpen ? 'Close compose' : 'Compose'}
            </button>

            {isComposeOpen && (
                <ComposeEmail
                    onEmailAdded={(savedEmail) =>
                        setEmails(emails => [savedEmail, ...emails])
                    }
                />
            )}

            <div className="unread-count">{`${unreadCount} unread emails`}</div>

            {!emailId && (
                <EmailList
                    emails={emails}
                    onRemoveEmail={onRemoveEmail}
                    onReadEmail={onReadEmail}
                />
            )}
            {emailId && (
                <MailDetails />
            )}
        </section>
    )
}




