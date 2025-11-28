const { useState, useEffect, useRef } = React

export function NoteLabels({ labels, limit = 2 }) {
    return (
        <div className="note-labels">
            {labels.slice(0, limit).map((label) => (
                <div key={label.id} className="note-label">
                    {label.name}
                </div>
            ))}
            {labels.length > limit && (
                <div className="note-label label-limit">+{labels.length - limit}</div>
            )}
        </div>
    )
}
