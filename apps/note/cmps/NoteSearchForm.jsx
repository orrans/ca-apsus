import { eventBusService } from '../../../services/event-bus.service.js'

const { useState, useEffect, useRef } = React

export function NoteSearchForm({}) {
    const [search, setSearch] = useState('')
    const [filterType, setFilterType] = useState(null)
    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        const removeSubscriber = eventBusService.on('setNoteFilterType', (type) =>
            setFilterType(type)
        )
        return removeSubscriber
    }, [])

    function updateSearch(value) {
        setSearch(value)
        eventBusService.emit('noteSearch', value)
    }

    function onSearchActiveChange(value) {
        setIsActive(value)
        console.log('insidesearchactive', value)
        eventBusService.emit('noteSearchActive', value)
        if (!value) {
            updateSearch('')
            eventBusService.emit('setNoteFilterType', null)
            setFilterType(null)
        }
    }

    return (
        <div className="note-search-container">
            <button className="note-btn round">
                <span className="material-symbols-outlined">search</span>
            </button>
            <input
                className="note-search-bar"
                type="text"
                placeholder="Search"
                value={search}
                onInput={(event) => updateSearch(event.target.value)}
                onFocus={() => onSearchActiveChange(true)}
            />
            <div>
                <button
                    className={`note-search-close-btn note-btn round ${
                        isActive || search || filterType ? 'visible' : ''
                    }`}
                    onClick={() => {
                        onSearchActiveChange(false)
                    }}>
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
        </div>
    )
}
