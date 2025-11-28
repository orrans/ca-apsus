import { debounce } from "../../../services/util.service.js"
import { bookService } from "../services/book.service.js"

const { useState, useEffect, useRef } = React

export function BookFilter({ defaultFilter, onSetFilter }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...defaultFilter })
    const [availableCategories, setAvailableCategories] = useState([])

    const onSetFilterDebounce = useRef(debounce(onSetFilter, 400)).current

    useEffect(() => {
        bookService.getAllCategories()
            .then(categories => setAvailableCategories(categories))
            .catch(err => console.log('err:', err))
    }, [])

    useEffect(() => {
        onSetFilterDebounce(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        if (field === 'categories') {
            // For select, value is a single category string or empty string
            value = value ? [value] : []
        }

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break

            case 'checkbox':
                value = target.checked
                break
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))

    }


    const { txt, listPrice, onSale, categories } = filterByToEdit
    const selectedCategory = (categories && categories.length > 0) ? categories[0] : ''
    return (
        <section className="Book-filter container">
            <h2>Filter Our Books</h2>

            <form>
                <label htmlFor="txt">Title</label>
                <input onChange={handleChange} value={txt} name="txt" id="txt" type="text" />

                <label htmlFor="listPrice">Price (min):</label>
                <input onChange={handleChange} value={listPrice || ''} name="listPrice" id="listPrice" type="number" />

                <label htmlFor="onSale">On Sale:</label>
                <input onChange={handleChange} checked={onSale || false} name="onSale" id="onSale" type="checkbox" />

                <label htmlFor="categories">Categories:</label>
                <select onChange={handleChange} value={selectedCategory} name="categories" id="categories">
                    <option value="">All Categories</option>
                    {availableCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </form>
        </section>
    )
}