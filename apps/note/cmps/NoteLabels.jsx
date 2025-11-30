const { useState, useEffect, useRef } = React

export function NoteLabels({ labels = [], limit = 2 }) {
    const safe = (labels || []).filter((label) => label)

    if (!safe.length) return <div className="note-labels" />

    return (
        <div className="note-labels">
            {safe.slice(0, limit).map((label) => (
                <div key={label.id} className="note-label">
                    {label.name}
                </div>
            ))}
            {safe.length > limit && (
                <div className="note-label label-limit">+{safe.length - limit}</div>
            )}
        </div>
    )
}
