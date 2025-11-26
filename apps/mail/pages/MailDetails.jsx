import { emailService } from "../../../services/email.service.js"
const { useParams, useNavigate, Link } = ReactRouterDOM

const { useState, useEffect } = React

export function MailDetails() {

    const [email, setEmail] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const { emailId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadEmail()
    }, [emailId])

    function loadEmail() {
        setIsLoading(true)
        emailService.get(emailId)
            .then(email => setEmail(email))
            .catch(err => console.log('err:', err))
            .finally(() => setIsLoading(false))
    }


    function onBack() {
        navigate('/mail')
    }

    if (isLoading) return <div className="loader">Loading...</div>


    const { from, to, subject, body, sentAt } = email
    return (
        <section className="mail-details-container">
            <h1>From: {from}</h1>
            <h1>To: {to}</h1>
            <h1>Subject: {subject}</h1>
            <p>{body}</p>
            <p>Sent at: {new Date(sentAt).toLocaleString()}</p>
            <section>
                <button ><Link to={`/mail/${email.prevEmailId}`}>Prev Email</Link></button>
                <button ><Link to={`/mail/${email.nextEmailId}`}>Next Email</Link></button>
            </section>
            <button onClick={onBack}>Back</button>
        </section>
    )
}