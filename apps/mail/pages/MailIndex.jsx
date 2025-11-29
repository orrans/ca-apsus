import { emailService } from '../services/mail.service.js'
import { EmailList } from '../cmps/MailList.jsx'
import { ComposeEmail } from '../cmps/MailCompose.jsx'
import { showSuccessMsg, showErrorMsg, eventBusService } from '../../../services/event-bus.service.js'
import { MailFilter } from '../cmps/MailFilter.jsx'
import { MailFolderList } from '../cmps/MailFolderList.jsx'
import { MailCheckbox } from '../cmps/MailCheckbox.jsx'

const { useState, useEffect, useRef } = React
const { useNavigate, useSearchParams, useParams, useLocation, Outlet } = ReactRouterDOM

export function MailIndex() {
    const [emails, setEmails] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const params = useParams()

    // get folder from params
    const folderFromUrl = params.folder || params.emailId
    const currentFolder = folderFromUrl || 'inbox'
    const validFolders = ['inbox', 'sent', 'trash', 'draft', 'starred', 'important', 'archive']
    const basePath = window.location.hostname === 'orrans.github.io' ? '/ca-apsus' : ''

    // check if we're on the compose route by checking the pathname
    const isComposeOpen = location.pathname.endsWith('/compose')

    // extract initial values from search params when on compose route
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

    // redirect /mail to /mail/inbox if no folder in url (but not if we're on compose route)
    useEffect(() => {
        if (!isComposeOpen && !params.folder && !params.emailId) {
            navigate('/mail/inbox', { replace: true })
        }
    }, [params.folder, params.emailId, navigate, isComposeOpen])

    useEffect(() => {
        emailService.countUnreadEmails().then(count => setUnreadCount(count))
        loadEmails()
    }, [filterBy])

    // sync filterBy when urlL params change
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
    }, [folderFromUrl])

    // reload emails when navigating back from email details
    const prevEmailIdRef = useRef(params.emailId)
    useEffect(() => {
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

    function onSelectAllEmails(selectAll) {
        setEmails(emails => emails.map(email => ({ ...email, isSelected: selectAll })))
    }

    function onSetFilter(newFilterBy) {
        setFilterBy(filterBy => ({ ...filterBy, ...newFilterBy }))
        // update searchParams when filter is submitted
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
                // navigate with current folder
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
        // update UI immediately
        setEmails(emails => emails.map(email =>
            email.id === emailId ? { ...email, isStarred: !email.isStarred } : email
        ))
        emailService.get(emailId)
            .then(email => {
                email.isStarred = !email.isStarred
                return emailService.save(email)
            })
    }

    function onImportantEmail(emailId) {
        setEmails(emails => emails.map(email =>
            email.id === emailId ? { ...email, isImportant: !email.isImportant } : email
        ))
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
        // just show a message
        showSuccessMsg('Email snoozed')
    }

    function onBulkAction(emailIds, action) {
        emailService.bulkAction(emailIds, action)
            .then(() => {
                if (action === 'delete' || action === 'archive') {
                    setEmails(emails => emails.filter(email =>
                        !emailIds.includes(email.id)))
                } else if (action === 'toggleRead') {
                    setEmails(emails => {
                        const selectedEmails = emails.filter(email => emailIds.includes(email.id))
                        const allRead = selectedEmails.every(email => email.isRead)
                        const targetReadState = allRead ? false : true
                        return emails.map(email =>
                            emailIds.includes(email.id) ? { ...email, isRead: targetReadState } : email
                        )
                    })
                }
                onUpdateUnreadCount()

                const actionMessages = {
                    archive: 'archived',
                    delete: 'deleted',
                    toggleRead: 'status updated'
                }
                showSuccessMsg(`${emailIds.length} email(s) ${actionMessages[action]}`)
            })
            .catch(err => {
                console.log('err:', err)
                const errorMessages = {
                    archive: 'Failed to archive emails',
                    delete: 'Failed to delete emails',
                    toggleRead: 'Failed to update email status'
                }
                showErrorMsg(errorMessages[action] || 'Failed to perform action')
            })
    }

    function handleCloseCompose() {
        navigate(`/mail/${currentFolder}`) // navigate back to current folder
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
                        <React.Fragment>
                            <MailCheckbox
                                emails={emails}
                                onBulkAction={onBulkAction}
                                onSelectAllEmails={onSelectAllEmails}
                            />
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
                        </React.Fragment>
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
                            onEmailAdded={(savedEmail) => {
                                onUpdateUnreadCount()
                                navigate(`/mail/${currentFolder}`)
                                loadEmails()
                            }}
                            onDraftSave={(draftData) => {
                                emailService.saveDraft(draftData)
                                    .then(savedDraft => {
                                        if (savedDraft) {
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




