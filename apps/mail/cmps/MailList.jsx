import { EmailPreview } from './MailPreview.jsx'

export function EmailList({ emails, onRemoveEmail }) {

    return (
        <ul className="email-list container">
            {emails.map(email => (
                <EmailPreview
                    key={email.id}
                    email={email}
                    onRemoveEmail={onRemoveEmail}
                />
            ))}
        </ul>
    )

}