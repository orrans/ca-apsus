import { EmailPreview } from './MailPreview.jsx'

export function EmailList({ emails, onRemoveEmail, onReadEmail }) {
    return (
        <ul className="email-list-container">
            {emails.map(email => (
                <EmailPreview
                    key={email.id}
                    email={email}
                    onRemoveEmail={onRemoveEmail}
                    onReadEmail={onReadEmail}
                />
            ))}
        </ul>
    )
}