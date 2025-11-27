const { useState, useEffect, useRef } = React
const colors = [
    '#faafa8',
    '#f39f76',
    '#fff8b8',
    '#e2f6d3',
    '#b4ddd3',
    '#d4e4ed',
    '#aeccdc',
    '#d3bfdb',
    '#f6e2dd',
    '#e9e3d4',
    '#efeff1',
]

export function NoteColorPicker({ value, onChange }) {
    const [isOpen, setIsOpen] = useState(false)

    const containerRef = useRef(null)
    const buttonRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            const container = containerRef.current
            const button = buttonRef.current
            const clickedElement = event.target

            if (button && button.contains(clickedElement)) return
            if (container && container.contains(clickedElement)) return

            setIsOpen(false)
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="color-picker-container" ref={containerRef}>
            <button
                className="note-btn round"
                onClick={() => setIsOpen((prev) => !prev)}
                ref={buttonRef}>
                <span className="material-symbols-outlined round-btn">palette</span>
            </button>

            {isOpen && (
                <div className="color-popup">
                    <div className="color-list">
                        <button
                            className={`note-btn round ${
                                value === null || value === '#ffffff' ? `selected` : ''
                            }`}
                            onClick={() => onChange('#ffffff')}>
                            <span className="material-symbols-outlined">format_color_reset</span>
                            <div className="selected-mark">
                                <span className="material-symbols-outlined">check</span>
                            </div>
                        </button>
                        {colors.map((color) => (
                            <div key={color}>
                                <button
                                    className={`note-btn round ${
                                        value === color ? `selected` : ''
                                    }`}
                                    onClick={() => onChange(color)}
                                    style={{ backgroundColor: color, color: color }}>
                                    <div className="selected-mark">
                                        <span className="material-symbols-outlined">check</span>
                                    </div>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
