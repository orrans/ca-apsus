const { Route, Routes } = ReactRouterDOM
const Router = ReactRouterDOM.HashRouter

import { AppHeader } from './cmps/AppHeader.jsx'
import { About } from './pages/About.jsx'
import { Home } from './pages/Home.jsx'
import { MailIndex } from './apps/mail/pages/MailIndex.jsx'
import { MailDetails } from './apps/mail/pages/MailDetails.jsx'
import { NoteIndex } from './apps/note/pages/NoteIndex.jsx'
import { BookIndex } from './apps/book/pages/BookIndex.jsx'
import { BookDetails } from './apps/book/pages/BookDetails.jsx'
import { BookEdit } from './apps/book/pages/BookEdit.jsx'

export function App() {
    return (
        <Router>
            <section className="app">
                <AppHeader />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/mail" element={<MailIndex />}>
                        <Route path=":folder/compose" element={null} />
                        <Route path=":folder/:emailId" element={<MailDetails />} />
                        <Route path=":emailId" element={<MailDetails />} />
                    </Route>
                    <Route path="/note" element={<NoteIndex />} />
                    <Route path="/book" element={<BookIndex />}>
                        <Route path=":bookId" element={<BookDetails />} />
                        <Route path="edit" element={<BookEdit />} />
                        <Route path="edit/:bookId" element={<BookEdit />} />
                    </Route>
                </Routes>
            </section>
        </Router>
    )
}
