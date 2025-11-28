import { LongText } from "./LongText.jsx"

export function BookPreview({ book }) {
    const basePath = window.location.hostname === 'orrans.github.io' ? '/ca-apsus' : ''
    return (
        <article className="book-preview">
            <h2>Title: {book.title}</h2>
            <h4>Book Description: <LongText txt={book.description} length={100} /></h4>
            <h4>Price: {book.listPrice.amount} {book.listPrice.currencyCode}</h4>
            <img src={book.thumbnail} alt="book Image" onError={(e) => e.target.src = `${basePath}/assets/css/apps/book/img/default-book-cover.jpg`} />
        </article>
    )
}