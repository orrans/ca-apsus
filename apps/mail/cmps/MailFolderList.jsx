import { emailService } from '../services/mail.service.js'
import { eventBusService } from '../../../services/event-bus.service.js'

const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouterDOM

const validFolders = ['inbox', 'sent', 'trash', 'draft', 'starred', 'important', 'archive']

export function MailFolderList() {
    const params = useParams()
    const navigate = useNavigate()
    const [emailCounts, setEmailCounts] = useState(null)

    function loadEmailCounts() {
        emailService.getEmailCounts().then(counts => setEmailCounts(counts))
            .catch(err => console.log('err:', err))
    }
    useEffect(() => {
        loadEmailCounts()
        
    }, [])
    useEffect(() => {
        loadEmailCounts()
    }, [params.folder, params.emailId, emailCounts])

        //get current folder from URL params (if none, use inbox)
    const folderFromUrl = params.folder || params.emailId  
    const currentFolder = validFolders.includes(folderFromUrl) ? folderFromUrl : 'inbox'
    const basePath = window.location.hostname === 'orrans.github.io' ? '/ca-apsus' : ''

    const folders = [
        {
            id: 'inbox',
            name: 'Inbox',
            icon: <img src={`${basePath}/assets/img/mail-imgs/inbox.svg`} alt="inbox" />,
            count: emailCounts && emailCounts.inbox || 0
        },
        {
            id: 'sent',
            name: 'Sent',
            icon: <img src={`${basePath}/assets/img/mail-imgs/send.svg`} alt="sent" />,
            count: emailCounts && emailCounts.sent || 0
        },
        {
            id: 'trash',
            name: 'Trash',
            icon: <img src={`${basePath}/assets/img/mail-imgs/delete.svg`} alt="trash" />,
            count: emailCounts && emailCounts.trash || 0
        },
        {
            id: 'draft',
            name: 'Drafts',
            icon: <img src={`${basePath}/assets/img/mail-imgs/draft.svg`} alt="draft" />,
            count: emailCounts && emailCounts.draft || 0
        },
        {
            id: 'starred',
            name: 'Starred',
            icon: <img src={`${basePath}/assets/img/mail-imgs/star.svg`} alt="starred" />,
            count: emailCounts && emailCounts.starred || 0
        },
        {
            id: 'important',
            name: 'Important',
            icon: <img src={`${basePath}/assets/img/mail-imgs/important-black.svg`} alt="important" />,
            count: emailCounts && emailCounts.important || 0
        },
        {
            id: 'archive',
            name: 'Archive',
            icon: <img src={`${basePath}/assets/img/mail-imgs/archive.svg`} alt="archive" />,
            count: emailCounts && emailCounts.archive || 0
        }
    ]

    function handleFolderClick(folderId) {
        navigate(`/mail/${folderId}`)
    }

    return (
        <nav className="mail-folder-list">
            <ul className="folder-items">
                {folders.map(folder => {
                    const isActive = currentFolder === folder.id    //for styling of active folder
                    return (
                        <li key={folder.id}>
                            <button
                                onClick={() => handleFolderClick(folder.id)}
                                className={`folder-btn ${isActive ? 'active' : ''}`}
                            >
                                <span className="folder-icon">{folder.icon}</span>
                                <span className="folder-name">{folder.name}</span>
                                {folder.count > 0 && (
                                    <span className="folder-count">{folder.count}</span>
                                )}
                            </button>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}