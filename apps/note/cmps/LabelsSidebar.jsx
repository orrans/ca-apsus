import { labelService } from '../services/label.service.js'

const { useState, useEffect } = React

export function LabelsSidebar({ onFilter, label: labelProp }) {
    const [labels, setLabels] = useState([])

    useEffect(() => {
        loadLabels()
    }, [])

    function loadLabels() {
        labelService.query().then((labels) => setLabels(labels))
    }

    return (
        <div className={`labels-sidebar ${open ? 'open' : ''}`}>
            <button
                onClick={() => onFilter(null)}
                className={`note-btn sidebar-label ${!labelProp ? 'selected' : ''}`}>
                <span className="material-symbols-outlined">lightbulb_2</span>
                <span className="label-name">Notes</span>
            </button>

            {labels.map((label) => (
                <button
                    key={label.id}
                    onClick={() => onFilter(label)}
                    className={`note-btn sidebar-label ${
                        label.id === labelProp ? 'selected' : ''
                    }`}>
                    <span className="material-symbols-outlined">label</span>
                    <span className="label-name">{label.name}</span>
                </button>
            ))}
        </div>
    )
}
