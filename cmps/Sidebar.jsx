const { Link, NavLink, Routes, Route } = ReactRouterDOM

export function Sidebar({ open, onClose }) {
    return (
        <nav className={`sidebar ${open ? 'open' : ''}`}>
            <NavLink to="/" onClick={onClose}>
                <span className="material-symbols-outlined">home</span>
                <span>Home</span>
            </NavLink>
            <NavLink to="/about" onClick={onClose}>
                <span className="material-symbols-outlined">info</span>
                <span>About</span>
            </NavLink>
            <NavLink to="/mail" onClick={onClose}>
                <span className="material-symbols-outlined">mail</span>
                <span>Email</span>
            </NavLink>
            <NavLink to="/note" onClick={onClose}>
                <span className="material-symbols-outlined">description</span>
                <span>Notes</span>
            </NavLink>
            <NavLink to="/book" onClick={onClose}>
                <span className="material-symbols-outlined">book_2</span>
                <span>Books</span>
            </NavLink>
        </nav>
    )
}
