import { bookService } from "../services/book.service.js"
import { showErrorMsg, showSuccessMsg } from "../../../services/event-bus.service.js"


const { useState, useEffect } = React

const { Link, useNavigate, useParams } = ReactRouterDOM
export function BookEdit() {


    const [bookToEdit, setBookToEdit] = useState(bookService.getEmptyBook())
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { bookId } = useParams()

    useEffect(() => {
        if (bookId) loadBook()
    }, [bookId])

    function loadBook() {
        setIsLoading(true)
        bookService.get(bookId)
            .then(book => setBookToEdit(book))
            .catch(err => console.log('err:', err))
            .finally(() => setIsLoading(false))
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value
        
        
        if (field === 'listPrice.amount') { //handle price amount
            setBookToEdit(prevBook => ({
                ...prevBook,
                listPrice: {
                    ...prevBook.listPrice,
                    amount: +value || 0
                }
            }))
            return
        }
        
        if (field === 'listPrice.isOnSale') { //handle on sale
            setBookToEdit(prevBook => ({
                ...prevBook,
                listPrice: {
                    ...prevBook.listPrice,
                    isOnSale: target.checked
                }
            }))
            return
        }
        
        if (field === 'authors' || field === 'categories') { //handle authors and categories
            value = value ? value.split(',').map(item => item.trim()).filter(item => item) : []
        }
        
        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break
        }
        setBookToEdit(prevBook => ({ ...prevBook, [field]: value }))
    }

    function onSaveBook(ev) {
        ev.preventDefault()
        bookService.save(bookToEdit)
            .then(savedBook => {
                console.log('savedBook:', savedBook)
                navigate('/book')
                showSuccessMsg('Book saved!')
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Problem saving book')
            })
    }


    const { title, listPrice, description, thumbnail, authors, publishedDate, pageCount, categories, language } = bookToEdit
    const loadingClass = isLoading ? 'loading' : ''
    return (
        <section className={`book-edit ${loadingClass}`}>
            <h1>{bookId ? 'Edit' : 'Add'} Book</h1>
            <form onSubmit={onSaveBook}>
                <label htmlFor="title">Title</label>
                <input onChange={handleChange} value={title || ''} type="text" name="title" id="title" />

                <label htmlFor="listPrice.amount">List Price Amount</label>
                <input onChange={handleChange} value={(listPrice && listPrice.amount) || ''} type="number" name="listPrice.amount" id="listPrice.amount" />
                
                <label htmlFor="listPrice.isOnSale">On Sale</label>
                <input onChange={handleChange} checked={(listPrice && listPrice.isOnSale) || false} type="checkbox" name="listPrice.isOnSale" id="listPrice.isOnSale" />

                <label htmlFor="description">Description</label>
                <input onChange={handleChange} value={description || ''} type="text" name="description" id="description" />

                <label htmlFor="thumbnail">Thumbnail</label>
                <input onChange={handleChange} value={thumbnail || ''} type="text" name="thumbnail" id="thumbnail" />

                <label htmlFor="authors">Authors (comma-separated)</label>
                <input onChange={handleChange} value={Array.isArray(authors) ? authors.join(', ') : authors || ''} type="text" name="authors" id="authors" />

                <label htmlFor="publishedDate">Published Date</label>
                <input onChange={handleChange} value={publishedDate || ''} type="text" name="publishedDate" id="publishedDate" />

                <label htmlFor="pageCount">Page Count</label>
                <input onChange={handleChange} value={pageCount || ''} type="number" name="pageCount" id="pageCount" />

                <label htmlFor="categories">Categories (comma-separated)</label>
                <input onChange={handleChange} value={Array.isArray(categories) ? categories.join(', ') : categories || ''} type="text" name="categories" id="categories" />

                <label htmlFor="language">Language</label>
                <input onChange={handleChange} value={language || ''} type="text" name="language" id="language" />

                <section>
                    <button>Save</button>
                    <button type="button"><Link to="/book">Cancel</Link></button>
                </section>
            </form>
        </section>
    )
}