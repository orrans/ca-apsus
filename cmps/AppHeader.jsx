import { NoteSearchForm } from '../apps/note/cmps/NoteSearchForm.jsx'

const { Link, NavLink, Routes, Route } = ReactRouterDOM

export function AppHeader() {
    return (
        <header className="app-header">
            <Link to="/">
                <h1>
                    <span style={{ color: '#4285F4' }}>O</span>
                    <span >.</span>
                    <span style={{ color: '#DB4437' }}>R</span>
                    <span>.</span>
                    <span style={{ color: '#F4B400' }}>A</span>
                    <span style={{ color: '#0F9D58' }}>p</span>
                    <span style={{ color: '#4285F4' }}>p</span>
                </h1>
            </Link>
            <Routes>
                <Route path="/note" element={<NoteSearchForm />} />
            </Routes>
            <nav>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/about">About</NavLink>
                <NavLink to="/mail">Mail</NavLink>
                <NavLink to="/note">Note</NavLink>
                <NavLink to="/book">Books</NavLink>
            </nav>
        </header>
    )
}
