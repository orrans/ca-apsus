const { createPortal } = ReactDOM
const { useEffect } = React

export function ColorPopup({ open, position, children }) {
    useEffect(() => {
        document.body.style.overflowY = open ? 'hidden' : 'visible'
    }, [open])

    if (!open) return null

    return createPortal(
        <div
            className="color-popup"
            style={{
                position: 'absolute',
                top: position.top + window.scrollY,
                left: position.left + window.scrollX,
                zIndex: 100,
            }}>
            {children}
        </div>,
        document.body
    )
}
