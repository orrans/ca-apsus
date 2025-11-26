const { useState } = React

export function LongText({ txt, length = 100 }) {
    const [isExpanded, setIsExpanded] = useState(false)

    if (!txt) return <div>No description available.</div>

    if (txt.length <= length) return <p>{txt}</p>

    if (isExpanded) {
        return (
            <p>
                {txt} <button onClick={() => setIsExpanded(false)}>Read Less</button>
            </p>
        )
    }
    return (
        <p>
            {txt.substring(0, length)}... <button onClick={() => setIsExpanded(true)}>Read More</button>
        </p>
    )
}
