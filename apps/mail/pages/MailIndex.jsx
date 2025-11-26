import { emailService } from '../../../services/email.service.js'
import { EmailList } from '../cmps/MailList.jsx'
import { showSuccessMsg, showErrorMsg } from '../../../services/event-bus.service.js'

const { useState, useEffect } = React
const { useNavigate, useSearchParams } = ReactRouterDOM

export function MailIndex() {
    const [emails, setEmails] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        loadEmails()
    }, [])

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


    if (isLoading || !emails) return <div>Loading...</div>

    return (
        <section className="mail-index">
            <EmailList emails={emails} onRemoveEmail={onRemoveEmail} />
        </section>
    )
}




