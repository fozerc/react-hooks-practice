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

const useConfirm = (message = '', onConfirm, onCancel) => {
    if (!onConfirm || typeof onConfirm !== 'function') {
        return
    }
    if (onCancel && typeof onCancel !== 'function') {
        return
    }
    const confirmAction = () => {
        if (confirm(message)) {
            onConfirm()
        } else {
            onCancel()
        }
    }
    return confirmAction
}

const usePreventLeave = () => {
    const listener = (event) => {
        event.preventDefault()
        event.returnValue = ""
    }
    const disablePrevent = () => window.removeEventListener('beforeunload', listener)
    const enablePrevent = () => window.addEventListener('beforeunload', listener)
    return {enablePrevent, disablePrevent}
}

const useBeforLeave = (onBefore) => {
    if (typeof onBefore !== "function") {
        return
    }
    const handler = (event) => {
        const {clientY} = event
        if (clientY <= 0) {
            onBefore()
        }
    };
    useEffect(() => {
        document.addEventListener('mouseleave', handler)
        return () => document.removeEventListener('mouseleave', handler)
    }, [])
}

const useFadeIn = (duration = 1, delay = 0) => {
    const element = useRef()
    useEffect(() => {
        if (element.current) {
            const {current} = element;
            current.style.transition = `opacity ${duration}s ease-in-out ${delay}s`;
            current.style.opacity = 1;
        }
    });
    return {ref: element, style: {opacity: 0}};
};

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
    const abort = () => console.log("отменяем удаление")
    const confirmDelete = () => console.log('удаляем всё на свете...')
    const deleteAll = useConfirm('вы точно хотите всё удалить?', confirmDelete, abort)
    const {enablePrevent, disablePrevent} = usePreventLeave()
    const pleaseStop = () => console.log('пожалуйста остановитесь...')
    useBeforLeave(pleaseStop)
    const fadeInH1 = useFadeIn(3, 2)
    const fadeInP = useFadeIn(10, 5)
    return (
        <>
            <div className={'greetings_container'}>
                <h1 {...fadeInH1}>Hello!!!</h1>
                <p {...fadeInP}>this is p</p>
            </div>
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
            <div className={"button_container"}>
                <h1>Here you can delete all</h1>
                <button onClick={deleteAll}>нажми чтобы всё удалить</button>
            </div>
            <div className={"leave_container"}>
                <button onClick={enablePrevent}>включить защиту</button>
                <button onClick={disablePrevent}>отключить защиту</button>
            </div>
        </>
    )
}

export default App
