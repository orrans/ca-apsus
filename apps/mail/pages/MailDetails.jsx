import { emailService } from "../services/mail.service.js"
const { useParams, useNavigate, Link, useOutletContext } = ReactRouterDOM

const { useState, useEffect } = React

const validFolders = ['inbox', 'sent', 'trash', 'draft','archive']

export function MailDetails() {

    const [email, setEmail] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const { emailId, folder } = useParams()
    const navigate = useNavigate()
    const currentFolder = validFolders.includes(folder) ? folder : 'inbox'
    const { onUpdateUnreadCount } = useOutletContext()
    const basePath = window.location.hostname === 'orrans.github.io' ? '/ca-apsus' : ''
    useEffect(() => {
        // If emailId is actually a folder name (and we don't have a folder param), redirect
        const isFolderName = emailId && validFolders.includes(emailId)
        if (isFolderName && !folder) {
            navigate(`/mail/${emailId}`, { replace: true }) //emailId is actually a folder name
            setIsLoading(false)
            return
        }
        // If there's no emailId, don't try to load
        if (!emailId || isFolderName) {
            setIsLoading(false)
            return
        }
        loadEmail()
    }, [emailId, folder, navigate])

    function SendToKeep() {
        navigate(`/note?title=${email.subject || ''}&body=${email.body || ''}`)
    }


    function loadEmail() {
        setIsLoading(true)
        emailService.get(emailId)
            .then(email => {
                setEmail(email)
                // Mark email as read if it's not already read
                if (!email.isRead) {
                    emailService.readEmail(emailId)
                        .then(() => {
                            if (onUpdateUnreadCount) {
                                onUpdateUnreadCount()
                            }
                        })
                        .catch(err => console.log('err:', err))
                    }
            })
            .catch(err => console.log('err:', err))
            .finally(() => setIsLoading(false))
    }

    function onBack() {
        navigate(`/mail/${currentFolder}`)
    }

    if (isLoading) return <div className="loader">Loading...</div>
    
    if (!email) return null

    const { from, to, subject, body, sentAt } = email
    return (
        <section className="mail-details-container">
            <h1>From: {from}</h1>
            <h1>To: {to}</h1>
            <h1>Subject: {subject}</h1>
            <p>{body}</p>
            <p>Sent at: {new Date(sentAt).toLocaleString()}</p>
            <section className="mail-details-navigation-container">
                <button className="mail-details-button"><Link to={`/mail/${currentFolder}/${email.prevEmailId}`}>
                <img src={`${basePath}/assets/img/mail-imgs/turn_left.svg`} alt="Previous Email" />Prev Email</Link>
                </button>
                <button  className="mail-details-button"><Link to={`/mail/${currentFolder}/${email.nextEmailId}`}>
                Next Email<img src={`${basePath}/assets/img/mail-imgs/turn_right.svg`} alt="Next Email" /></Link></button>
            </section>
            <section className="mail-details-actions-container">
                <button className="mail-details-button" onClick={onBack}>Back</button>
                <button className="mail-details-button" onClick={SendToKeep}>Send to Keep</button>
            </section>
        </section>
    )
}