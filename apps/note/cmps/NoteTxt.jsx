export function NoteTxt({ info }) {
    return (
        <div className="note-txt">
            {info.title && <h2>{info.title}</h2>}
            <p>{info.txt}</p>
        </div>
    )
}
