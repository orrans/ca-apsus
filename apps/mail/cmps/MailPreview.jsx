import { emailService } from '../services/mail.service.js'
const { Link, useNavigate } = ReactRouterDOM
export function EmailPreview({ email, onRemoveEmail, onReadEmail, onArchiveEmail, onToggleReadStatus, onSnoozeEmail, onSelectEmail, onStarEmail, onImportantEmail, currentFolder }) {
    const navigate = useNavigate()
    const sentAt = new Date(email.sentAt)
    const starIcon = email.isStarred ? 'star_filled' : 'star_border'
    const importantIcon = email.isImportant ? 'important-filled' : 'important'

    function handleEmailClick(e) {
        // Don't navigate if clicking on checkbox or buttons
        if (e.target.type === 'checkbox' || e.target.closest('.preview-left-buttons')) {
            e.preventDefault()
            return
        }
        if (currentFolder === 'draft') {
            e.preventDefault()
            const newSearchParams = new URLSearchParams()
            if (email.to) newSearchParams.set('to', email.to)
            if (email.subject) newSearchParams.set('subject', email.subject)
            if (email.body) newSearchParams.set('body', email.body)
            navigate(`/mail/${currentFolder}/compose?${newSearchParams.toString()}`)
        }
    }

    return (
        <li className={`email-list-item ${email.isRead ? 'read' : ''} ${email.isSelected ? 'checked' : ''}`}>
            <Link to={`/mail/${email.id}`} onClick={handleEmailClick}>
                <div className="preview-left-buttons">
                    <input 
                        type="checkbox" 
                        title="Select"
                        checked={email.isSelected || false}
                        onChange={(e) => {
                            e.stopPropagation();
                            if (onSelectEmail) onSelectEmail(email.id);
                        }}
                        onClick={(e) => {   //because of link
                            e.stopPropagation();
                        }}
                    />
                    <button title="star" onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        onStarEmail(email.id)
                    }}>
                        <img src={`/ca-apsus/assets/img/mail-imgs/${starIcon}.svg`} alt="Star" />
                    </button>
                    <button title="important" onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        onImportantEmail(email.id)
                    }}>
                        <img src={`/ca-apsus/assets/img/mail-imgs/${importantIcon}.svg`} alt="Important" />
                    </button>
                </div>
                {/* Part 1: From */}
                <div className="preview-from">
                    {email.from}
                </div>
                {/* Part 2: Subject */}
                <div className="preview-subject">
                    {email.subject || '(no subject)'}
                </div>
                {/* Part 3: Body Preview */}
                {email.body && (
                    <div className="preview-body">
                        -{email.body}
                    </div>
                )}
                {/* Part 4: Date */}
                <div className="preview-date">
                    {emailService.getDateString(sentAt)}
                </div>
            </Link>
            <div className="preview-actions">
                <button title="Archive" onClick={(e) => { e.stopPropagation(); onArchiveEmail(email.id) }}>
                    <img src="/ca-apsus/assets/img/mail-imgs/archive.svg" alt="Archive" />
                </button>
                <button title="Delete" onClick={(e) => { e.stopPropagation(); onRemoveEmail(email.id) }}>
                    <img src="/ca-apsus/assets/img/mail-imgs/delete.svg" alt="Delete" />
                </button>
                <button title={email.isRead ? "Mark as unread" : "Mark as read"} onClick={(e) => { e.stopPropagation(); onToggleReadStatus(email.id) }}>
                    <img src="/ca-apsus/assets/img/mail-imgs/mark_email_unread.svg" alt={email.isRead ? "Mark as unread" : "Mark as read"} />
                </button>
                <button title="Snooze" onClick={(e) => { e.stopPropagation(); onSnoozeEmail(email.id) }}>
                    <img src="/ca-apsus/assets/img/mail-imgs/snooze.svg" alt="Snooze" />
                </button>
            </div>
        </li>
    )
}