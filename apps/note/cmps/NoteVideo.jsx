export function NoteVideo({ info }) {
    const url = info.url.replace('watch?v=', 'embed/')

    return (
        <div className="note-txt">
            {info.title && <h2>{info.title}</h2>}
            <p>
                {
                    <iframe
                        width="100%"
                        height="315"
                        src={url}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen></iframe>
                }
            </p>
        </div>
    )
}
