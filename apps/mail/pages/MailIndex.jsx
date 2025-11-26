import { emailService } from '../services/mail.service.js'
import { EmailList } from '../cmps/MailList.jsx'
import { ComposeEmail } from '../cmps/MailCompose.jsx'
import { showSuccessMsg, showErrorMsg, eventBusService } from '../../../services/event-bus.service.js'

const { useState, useEffect } = React
const { useNavigate, useSearchParams, Outlet } = ReactRouterDOM

export function MailIndex() {
    const [emails, setEmails] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isComposeOpen, setIsComposeOpen] = useState(false)
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const [unreadCount, setUnreadCount] = useState(0)
    const [selectedMailId, setSelectedMailId] = useState(null)

    useEffect(() => {
        loadEmails()
    }, [])

    useEffect(() => {
        // Listen for email selection (on load and on back)
        const unsubscribeSelected = eventBusService.on('email-selected', (emailId) => {
            setSelectedMailId(emailId)
        })
        const unsubscribeDeselected = eventBusService.on('email-deselected', () => {
            setSelectedMailId(null)
        })
        return () => {
            unsubscribeSelected()
            unsubscribeDeselected()
        }
    }, [])

    useEffect(() => {
        if (!emails) return
        const count = emails.filter(email => !email.isRead).length
        setUnreadCount(count)
    }, [emails])

    // useEffect(() => {
    //     // Mark email as read when selected
    //     if (!selectedMailId || !emails) return
    //     emailService.readEmail(selectedMailId).then(() => {
    //         setEmails(prevEmails =>
    //             prevEmails.map(prevEmail =>
    //                 prevEmail.id === selectedMailId ? { ...prevEmail, isRead: true } : prevEmail
    //             )
    //         )
    //     })
    //         .catch(err => {
    //             console.log('err:', err)
    //             showErrorMsg(`Failed to read email(${selectedMailId})`)
    //         })
    // }, [selectedMailId, emails])



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
        setSelectedMailId(null)
        navigate('/mail')
    }

    function onReadEmail(emailId) {
        setSelectedMailId(emailId)
        emailService.readEmail(emailId)
            .then(() => {
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
            {!selectedMailId && (
                <EmailList
                    emails={emails}
                    onRemoveEmail={onRemoveEmail}
                    onReadEmail={onReadEmail}
                />
            )}
            <Outlet />
        </section>
    )
}




