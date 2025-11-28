import { ColorPopup } from './ColorPopup.jsx'
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
    const [popupPos, setPopupPos] = useState({ top: 0, left: 0 })

    const containerRef = useRef(null)
    const buttonRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (!isOpen) return
            if (buttonRef.current && buttonRef.current.contains(event.target)) {
                return
            }
            setIsOpen(false)
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    function openPopup(event) {
        const rect = event.currentTarget.getBoundingClientRect()
        setPopupPos({
            top: rect.bottom + 8,
            left: rect.left,
        })
        setIsOpen((prev) => !prev)
    }

    return (
        <div className="color-picker-container" ref={containerRef}>
            <button className="note-btn round" ref={buttonRef} onClick={openPopup}>
                <span className="material-symbols-outlined round-btn">palette</span>
            </button>

            <ColorPopup open={isOpen} position={popupPos}>
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
                        <button
                            key={color}
                            className={`note-btn round ${value === color ? `selected` : ''}`}
                            onClick={() => onChange(color)}
                            style={{ backgroundColor: color, color: color }}>
                            <div className="selected-mark">
                                <span className="material-symbols-outlined">check</span>
                            </div>
                        </button>
                    ))}
                </div>
            </ColorPopup>
        </div>
    )
}
