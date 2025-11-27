import { eventBusService } from '../../../services/event-bus.service.js'

const { useState, useEffect, useRef } = React

export function NoteSearchForm({}) {
    const [search, setSearch] = useState('')

    function updateSearch(value) {
        setSearch(value)
        eventBusService.emit('noteSearch', value)
    }

    return (
        <div className="note-search-container">
            <input
                className="note-search-bar"
                type="text"
                value={search}
                onInput={(event) => updateSearch(event.target.value)}
            />
            <button>&times;</button>
        </div>
    )
}
