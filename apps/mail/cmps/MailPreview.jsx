import { LongText } from '../../../cmps/LongText.jsx'

// need to set display flex
export function EmailPreview({ email, onRemoveEmail }) {
    return (
        <li className="email-list-item">
            {/* Part 1: From */}
            <div className="preview-from">
                {email.from}
            </div>
            {/* Part 2: Subject */}
            <div className="preview-subject">
                <LongText txt={email.subject} />
            </div>
            {/* Part 3: Date */}
            <div className="preview-date">
                {new Date(email.sentDate).toLocaleDateString()}
            </div>
            <button title="Delete" onClick={() => onRemoveEmail(email.id)}>
                <img src="../../../assets/img/trash-icon.svg" alt="Delete" />
            </button>
        </li>
    )
}