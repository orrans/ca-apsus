export function LongText({ txt, length = 100 }) {
    if (!txt) return <div>No description available.</div>

    return (
        <p>
            {txt.length <= length ? txt : txt.substring(0, length) + '...'}
        </p>
    )
}
