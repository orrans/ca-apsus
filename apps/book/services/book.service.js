import { loadFromStorage, makeId, saveToStorage, getRandomIntInclusive ,randomTrueFalse} from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'

const BOOK_KEY = 'bookDB'
let gUsedBookIds = new Set()
_initUsedBookIds()
_createBooks()

export const bookService = {
    query,
    get,
    remove,
    save,
    getEmptyBook,
    getDefaultFilter,
    addReview,
    addGoogleBook,
    getAllCategories
}

function query(filterBy = {}) {
    return storageService.query(BOOK_KEY)
        .then(books => {
            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                books = books.filter(book => regExp.test(book.title))
            }
            if (filterBy.listPrice) {
                books = books.filter(book => book.listPrice.amount >= filterBy.listPrice)
            }
            if (filterBy.onSale) {
                books = books.filter(book => book.listPrice.isOnSale === true)
            }
            if (filterBy.categories && filterBy.categories.length > 0) {
                const filterCategoriesLower = filterBy.categories.map(cat => cat.toLowerCase())
                books = books.filter(book => 
                    book.categories && book.categories.some(category => 
                        filterCategoriesLower.includes(category.toLowerCase())
                    )
                )
            }
            return books
        })
}

function get(bookId) {
    return storageService.get(BOOK_KEY, bookId).then(book => _setNextPrevBookId(book))
}

function remove(bookId) {
    // return Promise.reject('Oh No!')
    return storageService.remove(BOOK_KEY, bookId)
        .then(() => {
            gUsedBookIds.delete(bookId)
            return bookId
        })
}

function save(book) {
    if (book.id) {
        return storageService.put(BOOK_KEY, book)
    } else {
        book.id = _generateUniqueBookId()
        return storageService.post(BOOK_KEY, book)
            .then(savedBook => {
                gUsedBookIds.add(savedBook.id)
                return savedBook
            })
    }
}

function getEmptyBook(title = '', listPriceAmount = 100,trueFalse=false) {
    return { 
        title, 
        listPrice: {
            amount: listPriceAmount,
            currencyCode: 'EUR',
            isOnSale: trueFalse
        }, 
        description: '', 
        thumbnail: '' ,
        authors: [],
        publishedDate: null,
        pageCount: null,
        categories: [],
        language: ''
    }
}

function getDefaultFilter() {
    return { txt: '', listPrice: '', onSale: false, categories: [] }
}

function getAllCategories() {
    return storageService.query(BOOK_KEY)
        .then(books => {
            const categoriesSet = new Set()
            books.forEach(book => {
                if (book.categories && book.categories.length > 0) {
                    book.categories.forEach(category => {
                        categoriesSet.add(category)
                    })
                }
            })
            return Array.from(categoriesSet).sort()
        })
}

function addReview(bookId, review) {
    return storageService.get(BOOK_KEY, bookId).then(book => {
        if (!book) return Promise.reject('Book not found')
        book.reviews = book.reviews || []
        book.reviews.push(review)
        return save(book)
    })
}

function _initUsedBookIds() {   //used to initialize the globalused book ids var
    const books = loadFromStorage(BOOK_KEY)
    if (books && books.length) {
        books.forEach(book => {
            if (book.id) {
                gUsedBookIds.add(book.id)
            }
        })
    }
}

function _generateUniqueBookId() {
    let newId = makeId()
    while (gUsedBookIds.has(newId)) {
        newId = makeId()
    }
    return newId
}

function _createBooks() {
    let books = loadFromStorage(BOOK_KEY)
    if (!books || !books.length) {
        books = [
            _createBook({ title: 'Harry Potter', listPriceAmount: 50, authors: ['j.k.rowling'], pageCount: 500, publishedDate: 2024, categories: ['Fantasy','Adventure'] }),
            _createBook({ title: 'LOTR', listPriceAmount: 200, authors: ['J.R.R. Tolkien'], pageCount: 700, publishedDate: 2024, categories: ['Fantasy','Adventure'] }),
            _createBook({ title: `the hitchhiker's guide to the galaxy`, listPriceAmount: 50, authors: ['Douglas Adams'], pageCount: 300, publishedDate: 2024, categories: ['Science Fiction','Comedy'] }),
            _createBook({ title: 'a man named ove', listPriceAmount: 160, authors: ['Fredrik Backman'], pageCount: 400, publishedDate: 2024, categories: ['Fiction','Drama'] }),
            _createBook({ title: 'the little prince', listPriceAmount: 10, authors: ['Antoine de Saint-Exupéry'], pageCount: 80, publishedDate: 2024, categories: ['Fable','Children'] }),
            _createBook({ title: 'to kill a mockingbird', listPriceAmount: 70, authors: ['Harper Lee'], pageCount: 350, publishedDate: 2024, categories: ['Fiction','Classic'] }),
            _createBook({ title: '1984', listPriceAmount: 90, authors: ['George Orwell'], pageCount: 450, publishedDate: 2024, categories: ['Dystopian','Science Fiction'] }),
            _createBook({ title: 'the great gatsby', listPriceAmount: 15, authors: ['F. Scott Fitzgerald'], pageCount: 200, publishedDate: 2024, categories: ['Fiction','Classic'] }),
        ]
        saveToStorage(BOOK_KEY, books)
    }
}

function _createBook({ title, listPriceAmount = 100, authors = ["Unknown"], pageCount = 256, publishedDate = 2024, categories = ["Unknown"] }) {
    const book = getEmptyBook(title, listPriceAmount, randomTrueFalse())
    book.id = _generateUniqueBookId()
    gUsedBookIds.add(book.id)
    let bookThumbnailId = getRandomIntInclusive(1, 40)
    book.description = "placerat nisi sodales suscipit tellus"
    book.thumbnail = `https://www.coding-academy.org/books-photos/${bookThumbnailId}.jpg`
    book.authors = authors
    book.publishedDate = publishedDate
    book.pageCount = pageCount
    book.categories = categories
    book.language = "en"
    return book
}

function _setNextPrevBookId(book) {
    return query().then((books) => {
        const bookIdx = books.findIndex((currBook) => currBook.id === book.id)
        const nextBook = books[bookIdx + 1] ? books[bookIdx + 1] : books[0]
        const prevBook = books[bookIdx - 1] ? books[bookIdx - 1] : books[books.length - 1]
        book.nextBookId = nextBook.id
        book.prevBookId = prevBook.id
        return book
    })
}

function addGoogleBook(item) {
    if (!item || !item.volumeInfo) {
        return Promise.reject('Invalid Google Books item')
    }
    const volumeInfo = item.volumeInfo
    const saleInfo = item.saleInfo || {}
    let publishedYear = null
    if (volumeInfo.publishedDate) {
        const yearMatch = volumeInfo.publishedDate.match(/\d{4}/)   //looks for 4 digits in date
        if (yearMatch) {
            publishedYear = +yearMatch[0]
        }
    }
    let priceAmount = 100
    if (saleInfo.listPrice && saleInfo.listPrice.amount) {
        priceAmount = saleInfo.listPrice.amount
    } else if (saleInfo.retailPrice && saleInfo.retailPrice.amount) {
        priceAmount = saleInfo.retailPrice.amount
    }
    
    const book = {
        title: volumeInfo.title || '',
        listPrice: {
            amount: priceAmount,
            currencyCode: (saleInfo.listPrice && saleInfo.listPrice.currencyCode) || 'EUR',
            isOnSale: randomTrueFalse()
        },
        description: volumeInfo.description || '',
        thumbnail: (volumeInfo.imageLinks && volumeInfo.imageLinks.thumbnail) || '',
        authors: volumeInfo.authors || [],
        publishedDate: publishedYear,
        pageCount: volumeInfo.pageCount || null,
        categories: volumeInfo.categories || [],
        language: volumeInfo.language || 'en'
    }
    
    // Save the book to database
    return save(book)
}