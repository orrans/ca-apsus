import { bookService } from "../services/book.service.js"
import { showErrorMsg } from "../../../services/event-bus.service.js"
import { AddReview } from "../cmps/BookDetailsComps/AddReview.jsx"
import { LongText } from "../cmps/LongText.jsx"

const { useState, useEffect } = React
const { useParams, useNavigate, Link } = ReactRouterDOM


export function BookDetails() {

    const [book, setBook] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isAddReviewOpen, setIsAddReviewOpen] = useState(false)
    const { bookId } = useParams()
    const navigate = useNavigate()
    const basePath = window.location.hostname === 'orrans.github.io' ? '/ca-apsus' : ''

    useEffect(() => {
        loadBook()
    }, [bookId])

    function loadBook() {
        setIsLoading(true)
        bookService.get(bookId)
            .then(book => setBook(book))
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Failed to load book')
            })
            .finally(() => setIsLoading(false))
    }

    function onBack() {
        navigate('/book')
    }

    function toggleAddReview() {
        setIsAddReviewOpen(!isAddReviewOpen)
    }

    function checkTypeOfReading(pageCount) {
        if (pageCount < 100) return 'Light Reading'
        else if (pageCount <= 500) return 'Decent Reading'
        else return 'Long Reading'
    }

    function formatPublishedDate(publishedDate) {
        const currentYear = new Date().getFullYear()
        const publishedYear = new Date(publishedDate).getFullYear()
        const yearsDiff = currentYear - publishedYear
        if (yearsDiff > 10) return `${publishedYear} (Vintage)`
        else if (yearsDiff < 1) return `${publishedYear} (New)`
        else return publishedYear
    }
    
    function formatPriceClass(amount) {
        if (amount > 150) return 'price-high'
        else if (amount < 20) return 'price-low'
        else return ''
    }


    if (!book) return <div>Loading...</div>

    const {
        title,
        description,
        listPrice,
        thumbnail,
        authors,
        publishedDate,
        pageCount,
        categories,
        language
    } = book
    const loadingClass = isLoading ? 'loading' : ''
    return (
        <section className={`book-details container ${loadingClass}`}>

            <h1>Title: {title}</h1>
            <h2>Price: <span className={formatPriceClass(listPrice.amount)}>{listPrice.amount} {listPrice.currencyCode}</span></h2>

            <div className="thumb-sale">
                <img
                    src={thumbnail}
                    alt={title}
                    onError={(e) => e.target.src = `${basePath}/assets/css/apps/book/img/default-book-cover.jpg`}
                />
                {listPrice.isOnSale && <img className="sale-img" src={`${basePath}/assets/css/apps/book/img/on-sale.png`} alt='ON SALE!' />}
            </div>

            <div className="book-info">
                <h3>Description:</h3>
                <LongText txt={description} length={100} />

                <h3>Authors:</h3>
                <p>{authors.join(', ')}</p>

                <h3>Published Date:</h3>
                <p>{formatPublishedDate(publishedDate)}</p>

                <h3>Page Count:</h3>
                <p>Type of Reading: {checkTypeOfReading(pageCount)}</p>
                <p>{pageCount} pages</p>

                <h3>Categories:</h3>
                <p>{categories.join(', ')}</p>

                <h3>Language:</h3>
                <p>{language}</p>

                <h3>Reviews:</h3>
                <ul>
                    {book.reviews && book.reviews.length > 0 ? (
                        book.reviews.map((review, idx) => (
                            <li key={idx}>
                                <strong>{review.fullname}</strong> - Rating: {review.rating}/5 - {new Date(review.readAt).toLocaleDateString()}
                                {review.review && <p>{review.review}</p>}
                            </li>
                        ))
                    ) : (
                        <li>No reviews yet</li>
                    )}
                </ul>

            </div>
            
            {!isAddReviewOpen && (
                <button onClick={toggleAddReview}>
                    Add Review
                </button>
            )}

            {isAddReviewOpen && (
                <div className="modal-overlay" onClick={() => setIsAddReviewOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <AddReview 
                            onReviewAdded={() => {
                                loadBook()
                                setIsAddReviewOpen(false)
                            }}
                            onCancel={() => setIsAddReviewOpen(false)}
                        />
                    </div>
                </div>
            )}
            
            <section className="book-details-buttons">
                <button title="Previous Book"><Link to={`/book/${book.prevBookId}`}>←</Link></button>
                <button title="Next Book"><Link to={`/book/${book.nextBookId}`}>→</Link></button>
            </section>
            <button onClick={onBack}>Back</button>
        </section>
    )
}



 // Mark email as read when opened
        // if (emailId) {
        //     emailService.readEmail(emailId)
        //         .then(() => {
        //             if (setEmails) {
        //                 setEmails(prevEmails =>
        //                     prevEmails.map(prevEmail =>
        //                         prevEmail.id === emailId ? { ...prevEmail, isRead: true } : prevEmail
        //                     )
        //                 )
        //             }
        //         })
        //         .catch(err => {
        //             console.log('err:', err)
        //             showErrorMsg(`Failed to read email(${emailId})`)
        //         })
        // }
        // loadEmail()