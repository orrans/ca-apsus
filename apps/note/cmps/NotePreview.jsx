export function NotePreview({ note }) {
    return (
        <article className="note-preview" style={note.style}>
            <h2>Type: {note.type}</h2>
            <pre>{JSON.stringify(note.info, null, 2)}</pre>
        </article>
    )
}
