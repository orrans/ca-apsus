import { labelService } from '../services/label.service.js'
import { LabelPopup } from './LabelPopup.jsx'
const { useState, useEffect, useRef } = React

export function NoteLabelPicker({ value = [], onChange }) {
    const [isOpen, setIsOpen] = useState(false)
    const [popupPos, setPopupPos] = useState({ top: 0, left: 0 })
    const [labels, setLabels] = useState([])
    const [search, setSearch] = useState('')

    const containerRef = useRef(null)
    const buttonRef = useRef(null)

    useEffect(() => {
        loadLabels()
    }, [])

    useEffect(() => {
        function handleClickOutside(event) {
            if (!isOpen) return
            if (buttonRef.current && buttonRef.current.contains(event.target)) {
                return
            }
            if (event.target.closest('.label-popup')) {
                return
            }
            setIsOpen(false)
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    function loadLabels() {
        labelService.query().then((labels) => setLabels(labels))
    }

    function createLabel(value) {
        labelService.save({ name: value }).then((label) => {
            changeLabelChecked(label, true)
            loadLabels()
        })
    }

    function isLabelChecked(label) {
        return value.some((currLabel) => currLabel.id === label.id)
    }

    function changeLabelChecked(label, checked) {
        let newLabels = [...value]
        if (checked) {
            newLabels.push(label)
        } else {
            newLabels = newLabels.filter((currLabel) => currLabel.id != label.id)
        }
        onChange(newLabels)
    }

    function openPopup(event) {
        event.stopPropagation()
        const rect = event.currentTarget.getBoundingClientRect()
        setPopupPos({
            top: rect.bottom + 8,
            left: rect.left,
        })
        setIsOpen((prev) => !prev)
    }

    function onSearchLabel(search) {
        labelService.query(search).then((labels) => setLabels(labels))
        setSearch(search)
    }

    return (
        <div className="label-picker-container" ref={containerRef}>
            <button className="note-btn round" ref={buttonRef} onClick={openPopup}>
                <span className="material-symbols-outlined round-btn">label</span>
            </button>

            <LabelPopup open={isOpen} position={popupPos}>
                <div className="label-list" onClick={(event) => event.stopPropagation()}>
                    <span className="label-title-header">Label note</span>
                    <div className="label-input-container">
                        <input
                            type="text"
                            placeholder="Enter label name"
                            onInput={(event) => onSearchLabel(event.target.value)}
                        />
                        <span className="material-symbols-outlined">search</span>
                    </div>
                    <ul>
                        {labels.map((label) => (
                            <li className="label-row" key={label.id}>
                                <input
                                    onClick={(event) => event.stopPropagation()}
                                    type="checkbox"
                                    onChange={(event) =>
                                        changeLabelChecked(label, event.target.checked)
                                    }
                                    checked={isLabelChecked(label)}
                                />
                                <span>{label.name}</span>
                            </li>
                        ))}
                    </ul>
                    {search &&
                        !labels.some(
                            (label) => label.name.toLowerCase() === search.toLowerCase()
                        ) && (
                            <div className="create-new-label" onClick={() => createLabel(search)}>
                                <span class="material-symbols-outlined">add</span>{' '}
                                <span className="create-new-label-txt">
                                    Create '<b>{search}</b>'
                                </span>
                            </div>
                        )}
                </div>
            </LabelPopup>
        </div>
    )
}
