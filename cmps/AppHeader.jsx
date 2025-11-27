import { NoteSearchForm } from '../apps/note/cmps/NoteSearchForm.jsx'

const { Link, NavLink, Routes, Route } = ReactRouterDOM

export function AppHeader() {
    return (
        <header className="app-header">
            <Link to="/">
                <h3>LOGO!</h3>
            </Link>
            <div>
                <Routes>
                    <Route path="/note" element={<NoteSearchForm />} />
                </Routes>
            </div>
            <nav>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/about">About</NavLink>
                <NavLink to="/mail">Mail</NavLink>
                <NavLink to="/note">Note</NavLink>
            </nav>
        </header>
    )
}
