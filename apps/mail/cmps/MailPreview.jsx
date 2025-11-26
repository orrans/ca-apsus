import { LongText } from '../../../cmps/LongText.jsx'
import { getDayName, isToday, getTimeString } from '../../../services/util.service.js'

export function EmailPreview({ email, onRemoveEmail, onReadEmail }) {
    const sentAt = new Date(email.sentAt)
    const isTodayFlag = isToday(sentAt)
    const timeString = getTimeString(sentAt)
    console.log('isTodayFlag:', isTodayFlag)
    console.log('sentAt:', sentAt)
    return (
        <li className={`email-list-item ${email.isRead ? 'read' : ''}`} onClick={() => onReadEmail(email.id)}>
            {/* Part 1: From */}
            <div className="preview-from">
                {email.from}
            </div>
            {/* Part 2: Subject */}
            <div className="preview-subject">
                <LongText txt={email.subject} length={20} />
            </div>
            {/* Part 3: Date */}
            <div className="preview-date">
                {isTodayFlag ? 'Today '+timeString : sentAt.toLocaleDateString()}
            </div>
            <button title="Delete" onClick={() => onRemoveEmail(email.id)}>
                <img src="../../../assets/img/trash-icon.svg" alt="Delete" />
            </button>
        </li>
    )
}