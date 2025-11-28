import { bookService } from "../../services/book.service.js"
import { showErrorMsg, showSuccessMsg } from "../../../../services/event-bus.service.js"


const { useState } = React

const { useParams } = ReactRouterDOM

// Rating Components
function RateBySelect({ val, selected }) {
    return (
        <select value={val || ''} onChange={(e) => selected(+e.target.value)}>
            <option value="">Select Rating</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
        </select>
    )
}

function RateByTextbox({ val, selected }) {
    function handleChange({ target }) {
        const value = target.value
        if (value === '' || (+value >= 1 && +value <= 5)) {
            selected(value === '' ? '' : +value)
        }
        else{
            showErrorMsg('Rating must be between 1 and 5')
            return
        }
    }
    
    return (
        <input
            type="number"
            value={val || ''}
            onChange={handleChange}
            min="1"
            max="5"
            step="1"
            placeholder="Enter 1-5"
        />
    )
}

function RateByStars({ val, selected }) {
    const [hoveredStar, setHoveredStar] = useState(0)
    const currentRating = hoveredStar || val || 0
    
    function handleStarClick(starValue) {
        selected(starValue)
    }
    
    return (
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map(star => (  // handles stars- hover and click
                <span
                    key={star}
                    className={`star ${star <= currentRating ? 'filled' : ''}`}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHoveredStar(star)}   //hover event
                    onMouseLeave={() => setHoveredStar(0)}
                    style={{ cursor: 'pointer', fontSize: '1.5em' }}
                >
                    ★
                </span>
            ))} 
        </div>
    )
}

function DynamicRatingCmp(props) {
    const dynamicCmpMap = {
        select: <RateBySelect {...props} />,
        textbox: <RateByTextbox {...props} />,
        stars: <RateByStars {...props} />
    }
    
    return dynamicCmpMap[props.cmpType] || null
}

export function AddReview({ onReviewAdded, onCancel }) {
    const [fullname, setFullname] = useState('')
    const [rating, setRating] = useState('')
    const [readAt, setReadAt] = useState('')
    const [review, setReview] = useState('')
    const [ratingType, setRatingType] = useState('select') // 'select', 'textbox', or 'stars'
    const { bookId } = useParams()
    const [isLoading, setIsLoading] = useState(false)

    function onAddReview(ev) {
        ev.preventDefault()
        
        if (!rating || +rating < 1 || +rating > 5) {
            showErrorMsg('Please select a valid rating between 1 and 5')
            return
        }
        
        setIsLoading(true)

        const reviewObj = {
            fullname: fullname.trim(),
            rating: +rating,
            readAt,
            review: review.trim()
        }

        bookService.addReview(bookId, reviewObj)
            .then(savedBook => {
                setIsLoading(false)
                setFullname('')
                setRating('')
                setReadAt('')
                setReview('')
                showSuccessMsg('Review added successfully')
                if (onReviewAdded) onReviewAdded() // Reload book data
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Failed to add review')
            })
            .finally(() => setIsLoading(false))
    }
    function handleChange({ target }) {
        const field = target.name
        let value = target.value
        if (field === 'fullname') {
            value = value ? value.trim() : ''
            setFullname(value)
            return
        }
        if (field === 'ratingType') {
            setRatingType(value)
            return
        }
        if (field === 'readAt') {
            value = value ? new Date(value).toISOString().split('T')[0] : ''
            setReadAt(value)
            return
        }
        if (field === 'review') {
            setReview(value)
            return
        }
    }
    const loadingClass = isLoading ? 'loading' : ''
    return (
        <section className={`add-review ${loadingClass}`}>
            <h2>Add Review</h2>
            <form onSubmit={onAddReview}>
                <label htmlFor="fullname">Full Name</label>
                <input onChange={handleChange} value={fullname || ''} type="text" name="fullname" id="fullname" />
                <label style={{ gridColumn: '1 / 3' }}>Rating Method:</label>
                <div className="rating-type-selector" style={{ gridColumn: '1 / 3' }}>
                    <label>
                        <input
                            type="radio"
                            name="ratingType"
                            value="select"
                            checked={ratingType === 'select'}
                            onChange={handleChange}
                        />
                        Select
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="ratingType"
                            value="textbox"
                            checked={ratingType === 'textbox'}
                            onChange={handleChange}
                        />
                        Textbox
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="ratingType"
                            value="stars"
                            checked={ratingType === 'stars'}
                            onChange={handleChange}
                        />
                        Stars
                    </label>
                </div>
                
                <label htmlFor="rating">Rating (1-5)</label>
                <div style={{ gridColumn: '2' }}>
                    <DynamicRatingCmp
                        cmpType={ratingType}
                        val={rating}
                        selected={(value) => setRating(value)}
                    />
                </div>
                <label htmlFor="readAt">Read At</label>
                <input onChange={handleChange} value={readAt || ''} type="date" name="readAt" id="readAt" />
                <label htmlFor="review">Review</label>
                <textarea onChange={handleChange} value={review || ''} name="review" id="review" />
                <button type="submit">Add Review</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </form>
        </section>
    )
}