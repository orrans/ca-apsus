const { useState, useEffect, useRef } = React

export function NoteFilterType({ onFilterChange }) {
    return (
        <div className="types-container">
            <h2>Types</h2>
            <div className="types-list">
                <div className="filter" onClick={() => onFilterChange('NoteTxt')}>
                    <div className="filter-icon-container">
                        <span className="material-symbols-outlined">abc</span>
                    </div>
                    <div className="filter-txt">Text</div>
                </div>
                <div className="filter" onClick={() => onFilterChange('NoteTodos')}>
                    <div className="filter-icon-container">
                        <span className="material-symbols-outlined">list</span>
                    </div>
                    <div className="filter-txt">Todo</div>
                </div>
                <div className="filter" onClick={() => onFilterChange('NoteImg')}>
                    <div className="filter-icon-container">
                        <span className="material-symbols-outlined material-symbols-filled">
                            image
                        </span>
                    </div>
                    <div className="filter-txt">Image</div>
                </div>
                <div className="filter" onClick={() => onFilterChange('NoteVideo')}>
                    <div className="filter-icon-container">
                        <span className="material-symbols-outlined">youtube_activity</span>
                    </div>
                    <div className="filter-txt">Video</div>
                </div>
            </div>
        </div>
    )
}
