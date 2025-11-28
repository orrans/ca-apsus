import { NoteSearchForm } from '../apps/note/cmps/NoteSearchForm.jsx'

const { Link, NavLink, Routes, Route } = ReactRouterDOM

export function AppHeader() {
    return (
        <header>
            <div className="app-header">
                <Link className="logo" to="/">
                    <img src="/assets/img/logo.png" />
                </Link>
                <Routes>
                    <Route path="/note" element={<NoteSearchForm />} />
                    <Route path="*" element={<div></div>} />
                </Routes>
                <div className="header-space"></div>

                <div>
                    <nav>
                        <NavLink data-title="Home" to="/">
                            <button className="note-btn round">
                                <span className="material-symbols-outlined">home</span>
                            </button>
                        </NavLink>
                        <NavLink data-title="About" to="/about">
                            <button className="note-btn round">
                                <span className="material-symbols-outlined">info</span>
                            </button>
                        </NavLink>
                        <NavLink data-title="Mail" to="/mail">
                            <button className="note-btn round">
                                <span className="material-symbols-outlined">mail</span>
                            </button>
                        </NavLink>
                        <NavLink data-title="Note" to="/note">
                            <button className="note-btn round">
                                <span className="material-symbols-outlined">description</span>
                            </button>
                        </NavLink>
                        <NavLink data-title="Books" to="/book">
                            <button className="note-btn round">
                                <span className="material-symbols-outlined">book_2</span>
                            </button>
                        </NavLink>
                    </nav>
                </div>
            </div>
        </header>
    )
}
