import { emailService } from "../services/mail.service.js"

const { useState, useEffect } = React

export function MailFilter({ defaultFilter, onSetFilter }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...defaultFilter })
    const [availableCategories, setAvailableCategories] = useState([])

    // Sync filterByToEdit when defaultFilter.txt changes externally (e.g., from URL or folder change)
    // Only sync if the defaultFilter.txt is different from current, to avoid interfering with user typing
    useEffect(() => {
        if (defaultFilter.txt !== filterByToEdit.txt) {
            setFilterByToEdit(prevFilter => ({ ...prevFilter, txt: defaultFilter.txt || '' }))
        }
    }, [defaultFilter.txt])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'text':
                value = target.value
                break
        }
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function handleSubmit(e) {
        e.preventDefault()
        onSetFilter(filterByToEdit)
    }

    const { txt = '' } = filterByToEdit
    return (

        <form onSubmit={handleSubmit} className="Mail-filter-container">
            <label htmlFor="txt" className="search-label"></label>
            <button type="submit" className="search-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
            </button>
            <input placeholder="Search mail" onChange={handleChange} value={txt} name="txt" id="txt" type="text" className="mail-filter-input" />


        </form>

    )

}