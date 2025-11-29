import '../../../assets/css/apps/mail/cmps/MailCheckbox.css'

export function MailCheckbox({ emails, onBulkAction, onSelectAllEmails }) {
    const basePath = window.location.hostname === 'orrans.github.io' ? '/ca-apsus' : ''
    
    // Get all checked emails
    const checkedEmails = emails.filter(email => email.isSelected) || []
    const hasCheckedEmails = checkedEmails.length > 0
    const checkedEmailIds = checkedEmails.map(email => email.id)
    
    // Determine checkbox state
    const totalEmails = emails.length
    const allSelected = totalEmails > 0 && checkedEmails.length === totalEmails
    const someSelected = checkedEmails.length > 0 && checkedEmails.length < totalEmails
    
    // Handle select all checkbox
    function handleSelectAll(e) {
        onSelectAllEmails(!allSelected)
    }
    
    // Bulk action handlers
    function handleBulkArchive() {
        onBulkAction(checkedEmailIds, 'archive')
    }
    
    function handleBulkDelete() {
        onBulkAction(checkedEmailIds, 'delete')
    }
    
    function handleBulkToggleRead() {
        onBulkAction(checkedEmailIds, 'toggleRead')
    }
    
    // Determine if all checked emails are read
    const allCheckedRead = checkedEmails.length > 0 && checkedEmails.every(email => email.isRead)
    const readStatusTitle = allCheckedRead ? "Mark all as unread" : "Mark all as read"
    
    // Show component if there are emails (even if none are selected)
    if (totalEmails === 0) return null
    
    return (
        <div className="mail-checkbox-bulk-actions">
            <input 
                type="checkbox" 
                title={allSelected ? "Deselect all" : "Select all"}
                checked={allSelected}
                ref={checkbox => {
                    if (checkbox) checkbox.indeterminate = someSelected
                }}
                onChange={handleSelectAll}
            />
            <button title="Archive" onClick={handleBulkArchive}>
                <img src={`${basePath}/assets/img/mail-imgs/archive.svg`} alt="Archive" />
            </button>
            <button title="Delete" onClick={handleBulkDelete}>
                <img src={`${basePath}/assets/img/mail-imgs/delete.svg`} alt="Delete" />
            </button>
            <button title={readStatusTitle} onClick={handleBulkToggleRead}>
                <img src={`${basePath}/assets/img/mail-imgs/mark_email_unread.svg`} alt={readStatusTitle} />
            </button>
        </div>
    )
}
