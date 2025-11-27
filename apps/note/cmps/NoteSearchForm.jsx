import { eventBusService } from '../../../services/event-bus.service.js'

const { useState, useEffect, useRef } = React

export function NoteSearchForm({}) {
    const [search, setSearch] = useState('')

    function updateSearch(value) {
        setSearch(value)
        eventBusService.emit('noteSearch', value)
    }

    function onSearchActiveChange(value) {
        eventBusService.emit('noteSearchActive', value)
        if (!value) {
            updateSearch('')
        }
    }

    return (
        <div className="note-search-container">
            <button className='round-btn'>
                <span className="material-symbols-outlined">search</span>
            </button>
            <input
                className="note-search-bar"
                type="text"
                placeholder='Search'
                value={search}
                onInput={(event) => updateSearch(event.target.value)}
                onFocus={() => onSearchActiveChange(true)}
            />
            <div>
                <button
                    className="note-search-close-btn round-btn"
                    onClick={() => onSearchActiveChange(false)}>
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
        </div>
    )
}
