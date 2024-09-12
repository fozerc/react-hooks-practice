import {useEffect, useRef, useState} from 'react'
import './App.css'

const content = [
    {
        tab: "Раздел 1",
        content: "Контент для раздела 1"
    },
    {
        tab: "Раздел 2",
        content: "Контент для раздела 2"
    },
]

const useInput = (initialValue, validator) => {
    const [value, setValue] = useState(initialValue)
    const onChange = (event) => {
        const {target: {value}} = event
        let willUpdate = true
        if (typeof validator === 'function') {
            willUpdate = validator(value)
        }
        if (willUpdate) {
            setValue(value)
        }
    }
    return {value, onChange}
};

const useTabs = (initialTab, allTabs) => {
    if (!allTabs || !Array.isArray(allTabs)) {
        return;
    }
    const [currentIndex, setCurrentIndex] = useState(initialTab)
    return {
        currentItem: allTabs[currentIndex],
        changeItem: setCurrentIndex
    };
};

const useTitle = (initialTitle) => {
    const [title, setTitle] = useState(initialTitle)
    const updateTitle = () => {
        const htmlTitle = document.querySelector("title")
        htmlTitle.innerText = title
    }
    useEffect(updateTitle, [title])
    return setTitle
}

const useClick = (onClick) => {
    if (typeof onClick !== 'function') {
        return;
    }
    const element = useRef()
    useEffect(() => {
        if (element.current) {
            element.current.addEventListener('click', onClick)
        }
        return () => {
            if (element.current) {
                element.current.removeEventListener('click', onClick)
            }
        }
    }, [])
    return element;
}

function App() {
    const titleUpdater = useTitle('Загрузка...')
    setInterval(() => titleUpdater('Загружено'), 5000)
    const {currentItem, changeItem} = useTabs(0, content)
    const maxLength = (value) => value.length < 10
    const checkAt = (value) => !value.includes("@", 1)
    const name = useInput('Mr.', maxLength)
    const email = useInput('email', checkAt)
    const sayHello = () => console.log("Hello!")
    const button = useClick(sayHello)
    return (
        <>
            <div>Practice</div>
            <div className={'tabs_menu'}>
                {content.map((section, index) => (
                    <button key={index} onClick={() => changeItem(index)}>{section.tab}</button>
                ))}
                <div>{currentItem.content}</div>
            </div>
            <input placeholder="Name" {...name}/>
            <input placeholder="Name" {...email}/>
            <div className={"input_container"}>
                <button ref={button}>Click!</button>
            </div>
        </>
    )
}

export default App
