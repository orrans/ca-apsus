export function NoteImg({ info }) {
    return (
        <div className="note-img">
            <img src={info.url} alt={info.title} style={{ maxWidth: '100%' }} />
            <h4>{info.title}</h4>
        </div>
    )
}
