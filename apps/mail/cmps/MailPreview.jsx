import { getDayName, isToday, getTimeString } from '../../../services/util.service.js'
const { Link } = ReactRouterDOM
export function EmailPreview({ email, onRemoveEmail, onReadEmail, onArchiveEmail, onToggleReadStatus, onSnoozeEmail, onSelectEmail, onStarEmail, onImportantEmail }) {
    const sentAt = new Date(email.sentAt)
    const isTodayFlag = isToday(sentAt)
    const timeString = getTimeString(sentAt)
    const starIcon = email.isStarred ? 'star_filled' : 'star_border'
    const importantIcon = email.isImportant ? 'important-filled' : 'important'
    return (
        <li className={`email-list-item ${email.isRead ? 'read' : ''}`}>
            <Link to={`/mail/${email.id}`}>
                <div className="preview-left-buttons">
                    <button title="Select" onClick={(e) => { e.stopPropagation(); e.preventDefault(); onSelectEmail(email.id) }}>
                        <img src={`../../../assets/img/mail-imgs/select.svg`} alt="Select" />
                    </button>
                    <button title="star" onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        onStarEmail(email.id)
                    }}>
                        <img src={`../../../assets/img/mail-imgs/${starIcon}.svg`} alt="Star" />
                    </button>
                    <button title="important" onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        onImportantEmail(email.id)
                    }}>
                        <img src={`../../../assets/img/mail-imgs/${importantIcon}.svg`} alt="Important" />
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
                    {isTodayFlag ? timeString : sentAt.toLocaleDateString()}
                </div>
            </Link>
            <div className="preview-actions">
                <button title="Archive" onClick={(e) => { e.stopPropagation(); onArchiveEmail(email.id) }}>
                    <img src="../../../assets/img/mail-imgs/archive.svg" alt="Archive" />
                </button>
                <button title="Delete" onClick={(e) => { e.stopPropagation(); onRemoveEmail(email.id) }}>
                    <img src="../../../assets/img/mail-imgs/delete.svg" alt="Delete" />
                </button>
                <button title={email.isRead ? "Mark as unread" : "Mark as read"} onClick={(e) => { e.stopPropagation(); onToggleReadStatus(email.id) }}>
                    <img src="../../../assets/img/mail-imgs/mark_email_unread.svg" alt={email.isRead ? "Mark as unread" : "Mark as read"} />
                </button>
                <button title="Snooze" onClick={(e) => { e.stopPropagation(); onSnoozeEmail(email.id) }}>
                    <img src="../../../assets/img/mail-imgs/snooze.svg" alt="Snooze" />
                </button>
            </div>
        </li>
    )
}