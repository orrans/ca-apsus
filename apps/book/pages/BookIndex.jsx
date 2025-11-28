import { BookFilter } from "../cmps/BookFilter.jsx"
import { BookList } from "../cmps/BookList.jsx"
import { bookService } from "../services/book.service.js"
import { showErrorMsg, showSuccessMsg } from "../../../services/event-bus.service.js"
import { BookAdd } from "../cmps/BookAdd.jsx"

const { useState, useEffect } = React
const { Link, useSearchParams, Outlet, useParams } = ReactRouterDOM

export function BookIndex() {

    const [books, setBooks] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const [filterBy, setFilterBy] = useState(bookService.getDefaultFilter(searchParams))
    const params = useParams()
    const selectedBookId = params.bookId

    useEffect(() => {
        loadBooks()
        setSearchParams(filterBy)
    }, [filterBy])

    function loadBooks() {
        bookService.query(filterBy) // { txt: '...', minSpeed:150 }
            .then(setBooks)
            .catch(err => {
                console.log('err:', err)
            })
    }

    function onRemoveBook(bookId) {
        bookService.remove(bookId)
            .then(() => {
                setBooks(books => (
                    books.filter(book => book.id !== bookId)))
                    showSuccessMsg(`Book removed successfully(${bookId})`)
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg(`Failed to remove book(${bookId})`)
            })
    }


    function onSetFilter(newFilterBy) { //{ txt: '...' }
        setFilterBy(filterBy => ({ ...filterBy, ...newFilterBy }))
    }


    if (!books) return <div>Loading...</div>
    return (
        <section className="book-index">
            {!selectedBookId && (
                <React.Fragment>
                    <BookFilter
                        defaultFilter={filterBy}
                        onSetFilter={onSetFilter}
                    />
                    <BookAdd onBookAdded={loadBooks} />
                    <button>
                        <Link to="/book/edit">Add Book (Manually)</Link>
                    </button>
                    <BookList
                        books={books}
                        onRemoveBook={onRemoveBook}
                    />
                </React.Fragment>
            )}
            <Outlet />
        </section>
    )

}