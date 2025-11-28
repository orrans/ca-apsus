const { Link } = ReactRouterDOM

import { BookPreview } from "./BookPreview.jsx";

export function BookList({ books, onRemoveBook }) {
    const basePath = window.location.hostname === 'orrans.github.io' ? '/ca-apsus' : ''

    return (
        <ul className="book-list container">
            {books.map(book => (
                <li className="book-list-item" key={book.id} >
                    <BookPreview book={book} />
                    <section>
                        <button title="Delete" onClick={() => onRemoveBook(book.id)}>
                            <img src={`${basePath}/assets/css/apps/book/img/trash-icon.svg`} alt="Delete" />
                        </button>   
                        <button><Link to={`/book/${book.id}`}>Details</Link></button>
                        <button title="Edit"><Link to={`/book/edit/${book.id}`}><img src={`${basePath}/assets/css/apps/book/img/edit-icon.svg`} alt="Edit" /></Link></button>
                    </section>
                </li>
            ))}
        </ul>
    )

}