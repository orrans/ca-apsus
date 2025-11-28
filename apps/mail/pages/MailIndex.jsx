import { emailService } from '../services/mail.service.js'
import { EmailList } from '../cmps/MailList.jsx'
import { ComposeEmail } from '../cmps/MailCompose.jsx'
import { showSuccessMsg, showErrorMsg, eventBusService } from '../../../services/event-bus.service.js'
import { MailFilter } from '../cmps/MailFilter.jsx'
import { MailFolderList } from '../cmps/MailFolderList.jsx'

const { useState, useEffect ,useRef} = React
const { useNavigate, useSearchParams, useParams, useLocation, Outlet } = ReactRouterDOM

export function MailIndex() {
    const [emails, setEmails] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)
    
    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const params = useParams()
    
    // Get folder from params - could be in folder param or emailId param (if it's a folder name)
    const folderFromUrl = params.folder || params.emailId
    const currentFolder = folderFromUrl || 'inbox'
    const validFolders = ['inbox', 'sent', 'trash', 'draft', 'starred', 'important', 'archive']
    const basePath = window.location.hostname === 'orrans.github.io' ? '/ca-apsus' : ''
    
    // Check if we're on the compose route by checking the pathname
    const isComposeOpen = location.pathname.endsWith('/compose')
    
    // Extract initial values from search params when on compose route
    const composeInitialValues = isComposeOpen ? {
        to: searchParams.get('to') || searchParams.get('from') || '',
        subject: searchParams.get('subject') || '',
        body: searchParams.get('body') || ''
    } : {}
    
    // checks if an email is selected - and not folder/compose
    const selectedMailId = params.emailId && !validFolders.includes(params.emailId) && params.emailId !== 'compose' ? params.emailId : null
    const [filterBy, setFilterBy] = useState(() => {
        const defaultFilter = emailService.getDefaultFilter(searchParams)
        return { ...defaultFilter, folder: currentFolder }
    })
    
    // Redirect /mail to /mail/inbox if no folder in URL (but not if we're on compose route)
    useEffect(() => {
        if (!isComposeOpen && !params.folder && !params.emailId) {
            navigate('/mail/inbox', { replace: true })
        }
    }, [params.folder, params.emailId, navigate, isComposeOpen])

    useEffect(() => {
        emailService.countUnreadEmails().then(count => setUnreadCount(count))
        loadEmails()
    }, [filterBy])

    // Sync filterBy when URL params change (folder or searchParams)
    useEffect(() => {
        const txtFromParams = searchParams.get('txt') || ''
        const newFolder = folderFromUrl || 'inbox'
        setFilterBy(prevFilter => {
            const hasChanged = prevFilter.txt !== txtFromParams || prevFilter.folder !== newFolder
            if (hasChanged) {
                return { txt: txtFromParams, folder: newFolder }
            }
            return prevFilter
        })
    }, [searchParams, folderFromUrl])

    // Reload emails when navigating back from email details (when emailId becomes null)
    const prevEmailIdRef = useRef(params.emailId)
    useEffect(() => {
        // Only reload if we navigated back (emailId went from a value to null/undefined)
        const hadEmailId = prevEmailIdRef.current && !validFolders.includes(prevEmailIdRef.current)
        const hasEmailId = params.emailId && !validFolders.includes(params.emailId)
        
        if (hadEmailId && !hasEmailId) {
            loadEmails()
        }
        prevEmailIdRef.current = params.emailId
    }, [params.emailId])

    useEffect(() => {   //update unread count when emails change
        if (!emails) return
        emailService.countUnreadEmails().then(count => setUnreadCount(count))   
    }, [emails])


    function onUpdateUnreadCount() {
        emailService.countUnreadEmails().then(count => setUnreadCount(count))
    }

    function loadEmails() {
        setIsLoading(true)
        emailService.query(filterBy)
            .then(emails => setEmails(emails))
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Failed to load emails')
            })
            .finally(() => setIsLoading(false))
    }

    function onSelectEmail(emailId) {
        setEmails(emails => emails.map(email => 
            email.id === emailId ? { ...email, isSelected: !email.isSelected } : email
        ))
    }

    function onSetFilter(newFilterBy) {
        setFilterBy(filterBy => ({ ...filterBy, ...newFilterBy }))
        // Update searchParams when filter is submitted
        const newSearchParams = new URLSearchParams()
        if (newFilterBy.txt) {
            newSearchParams.set('txt', newFilterBy.txt)
        }
        setSearchParams(newSearchParams)
    }

    function onRemoveEmail(emailId) {
        emailService.remove(emailId)
            .then(() => {
                setEmails(emails => (
                    emails.filter(email => email.id !== emailId)))
                onUpdateUnreadCount()
                showSuccessMsg(`Email removed successfully(${emailId})`)
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg(`Failed to remove email(${emailId})`)
            })
    }

    function onBack() {
        navigate(`/mail/${currentFolder}`)
    }

    function onReadEmail(emailId) {
        emailService.readEmail(emailId)
            .then(() => {
                emailService.countUnreadEmails().then(count => setUnreadCount(count))
                // Navigate with current folder to maintain context
                navigate(`/mail/${currentFolder}/${emailId}`)
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg(`Failed to read email(${emailId})`)
            })
    }

    function onArchiveEmail(emailId) {
        emailService.get(emailId)
            .then(email => {
                email.folder = 'archive'
                return emailService.save(email)
            })
            .then(() => {
                setEmails(emails => emails.filter(email => email.id !== emailId))
                onUpdateUnreadCount()
                showSuccessMsg('Email archived')
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Failed to archive email')
            })
    }

    function onStarEmail(emailId) {
        // Optimistically update UI immediately
        setEmails(emails => emails.map(email => 
            email.id === emailId ? { ...email, isStarred: !email.isStarred } : email
        ))
        // Then save to database
        emailService.get(emailId)
            .then(email => {
                email.isStarred = !email.isStarred
                return emailService.save(email)
            })
    }

    function onImportantEmail(emailId) {
        // Optimistically update UI immediately
        setEmails(emails => emails.map(email => 
            email.id === emailId ? { ...email, isImportant: !email.isImportant } : email
        ))
        // Then save to database
        emailService.get(emailId)
            .then(email => {
                email.isImportant = !email.isImportant
                return emailService.save(email)
            })
    }

    function onToggleReadStatus(emailId) {
        emailService.get(emailId)
            .then(email => {
                email.isRead = !email.isRead
                return emailService.save(email)
            })
            .then(() => {
                setEmails(emails => emails.map(email => 
                    email.id === emailId ? { ...email, isRead: !email.isRead } : email
                ))
                onUpdateUnreadCount()
                showSuccessMsg('Email status updated')
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Failed to update email status')
            })
    }

    function onSnoozeEmail(emailId) {
        // For now, just show a message. Can be enhanced later with actual snooze functionality
        showSuccessMsg('Email snoozed')
    }

    function handleCloseCompose() {
        navigate(`/mail/${currentFolder}`) // Navigate back to current folder
    }

    if (isLoading || !emails) return <div>Loading...</div>

    return (
        <section className="mail-index">
            <div className="mail-filter-container">
                <button
                    className="gmail-btn"
                    onClick={() => navigate('/mail')}
                    title="Gmail"
                >
                    <img className="gmail-icon" src={`${basePath}/assets/img/mail-imgs/gmail-icon.png`} alt="Gmail" />
                    Gmail
                </button>
                <MailFilter 
                    defaultFilter={filterBy} 
                    onSetFilter={onSetFilter} 
                />
            </div>
            
            <div className="mail-layout">
                <div className="mail-sidebar">
                    <button
                        title="Compose"
                        className="compose-btn"
                        type="button"
                        onClick={() => navigate(`/mail/${currentFolder}/compose`)}
                    >
                        <img src={`${basePath}/assets/img/mail-imgs/edit-pen.svg`} alt="compose" />
                        Compose
                    </button>
                    <MailFolderList />
                </div>
                
                <div className="mail-content">
                    {!selectedMailId && (
                        <EmailList
                            emails={emails}
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
                    )}
                    <Outlet context={{ onUpdateUnreadCount }} />
                </div>
            </div>

            {isComposeOpen && (
                <div className="modal-overlay" onClick={handleCloseCompose}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h4>New Message</h4>
                        <button 
                            className="modal-close-btn" 
                            onClick={handleCloseCompose}
                            aria-label="Close"
                        >
                            ×
                        </button>
                        <ComposeEmail
                            initialValues={composeInitialValues}
                            onEmailAdded={(savedEmail) =>{
                                onUpdateUnreadCount()
                                navigate(`/mail/${currentFolder}`)
                                loadEmails()
                            }}
                            onDraftSave={(draftData) => {
                                emailService.saveDraft(draftData)
                                    .then(savedDraft => {
                                        if (savedDraft) {
                                            // Only update emails list if we're currently viewing drafts folder
                                            if (currentFolder === 'draft') {
                                                setEmails(emails => [savedDraft, ...emails])
                                            }
                                            onUpdateUnreadCount()
                                        }
                                    })
                                    .catch(err => {
                                        console.log('err:', err)
                                    })
                            }}
                        />
                    </div>
                </div>
            )}
        </section>
    )
}




