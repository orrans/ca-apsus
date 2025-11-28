import { EmailPreview } from './MailPreview.jsx'

export function EmailList({ emails, onRemoveEmail, onReadEmail, onArchiveEmail, onToggleReadStatus, onSnoozeEmail, onSelectEmail, onStarEmail, onImportantEmail, currentFolder }) {
    return (
        <ul className="email-list-container">
            {emails.map(email => (
                <EmailPreview
                    key={email.id}
                    email={email}
                    onRemoveEmail={onRemoveEmail}
                    onReadEmail={onReadEmail}
                    onArchiveEmail={onArchiveEmail}
                    onToggleReadStatus={onToggleReadStatus}
                    onSnoozeEmail={onSnoozeEmail}
                    onSelectEmail={onSelectEmail}
                    onStarEmail={onStarEmail}
                    onImportantEmail={onImportantEmail}
                    currentFolder={currentFolder}
                />
            ))}
        </ul>
    )
}