export function NoteTxt({ info }) {
    return (
        <div className="note-txt">
            <h2>{info.title}</h2>
            <p>{info.txt}</p>
        </div>
    )
}
