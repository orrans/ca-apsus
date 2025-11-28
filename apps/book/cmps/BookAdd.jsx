import { bookService } from "../services/book.service.js"
import { debounce, getData } from "../../../services/util.service.js"
import { showErrorMsg, showSuccessMsg } from "../../../services/event-bus.service.js"

const { useState, useEffect, useRef } = React

export function BookAdd({ onBookAdded }) {  {/* onBookAdded is load books function when called from bookIndex*/}
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    // Debounced search function
    const debouncedSearch = useRef(
        debounce((term) => {
            if (!term.trim()) { {/* if search term is empty, serach results are empty */}
                setSearchResults([])
                return
            }

            setIsLoading(true)
            const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(term)}&maxResults=5`

            getData(url, (data) => {
                if (data.items && data.items.length > 0) {
                    setSearchResults(data.items)
                } else {
                    setSearchResults([])
                }
                setIsLoading(false)
            })
        }, 500)
    ).current

    useEffect(() => {
        debouncedSearch(searchTerm)
    }, [searchTerm, debouncedSearch])

    function handleSearchChange({ target }) {
        setSearchTerm(target.value)
    }

    function onAddBook(googleBook) {
        bookService.addGoogleBook(googleBook)
            .then(savedBook => {
                showSuccessMsg('Book added successfully!')
                setSearchTerm('')
                setSearchResults([])
                if (onBookAdded) onBookAdded()
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Failed to add book')
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    return (
        <section className="book-add">
            <h2>Add Book from Google Books</h2>
            <input
                type="text"
                placeholder="Search for books..."
                value={searchTerm}
                onChange={handleSearchChange}
            />

            {isLoading && <div>Searching...</div>}

            {searchResults.length > 0 && (
                <ul className="google-books-results">
                    {searchResults.map((item) => (
                        <li key={item.id}>
                            <span>{(item.volumeInfo && item.volumeInfo.title) || 'No title'}</span>
                            <button onClick={() => onAddBook(item)}>+</button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}

