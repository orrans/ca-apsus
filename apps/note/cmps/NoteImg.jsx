export function NoteImg({ info }) {
    return (
        <div className="note-img">
            <img src={info.url} alt={info.title} style={{ maxWidth: '100%' }} />
            {info.title && <h2>{info.title}</h2>}
            <p>{info.txt}</p>
        </div>
    )
}
