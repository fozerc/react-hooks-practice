import {useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
    const [item, setItem] = useState(1)
    const decreaseItem = () => setItem(item - 1)
    const increaseItem = () => setItem(item + 1)

    return (
        <>
            <div>Practice</div>
            <p>{item}</p>

            <button onClick={increaseItem}>Увеличить</button>
            <button onClick={decreaseItem}>Уменьшить</button>
        </>
    )
}

export default App
