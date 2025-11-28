const { createPortal } = ReactDOM

export function ColorPopup({ open, position, children }) {
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
