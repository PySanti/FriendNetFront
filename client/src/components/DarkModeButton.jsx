
import {toast} from "sonner"
import dark_mode from "../../lottie/dark_mode"
import Lottie from "lottie-react"
import {useRef} from "react"
import "../styles/DarkModeButton.css"
import {useDarkMode} from "../store"
import {useEffect} from "react"
import {getDarkModeFromLocalStorage} from "../utils/getDarkModeFromLocalStorage"
import {LOCAL_STORAGE_DARK_MODE_NAME} from "../utils/constants"
import {useDefaultDarkModeActivated} from "../store.jsx"

/**
 * Componente creado para el dark mode
 */
export function DarkModeButton(){
    let [darkModeActivated, setDarkModeActivated] = useDarkMode((state)=>([state.darkModeActivated, state.setDarkModeActivated]))
    let defaultDarkModeActivated = useDefaultDarkModeActivated((state)=>(state.defaultDarkModeActivated))
    const darkModeClassName = "dark"
    const darkModeAnimationRef = useRef()
    const updateDarkMode = (newDarkMode)=>{
        const body = document.getElementsByTagName("body")[0]
        setDarkModeActivated(newDarkMode);
        if (newDarkMode){
            body.classList.add(darkModeClassName)
        }else{
            body.classList.remove(darkModeClassName)
        }
        localStorage.setItem(LOCAL_STORAGE_DARK_MODE_NAME, newDarkMode)
    }
    const handleClick = ()=>{
        if (defaultDarkModeActivated){
            toast.error("Desactiva el modo obscuro de tu navegador para usar esta opción")
        } else {
            updateDarkMode(!darkModeActivated)
            const currentFrame = darkModeAnimationRef.current.animationItem.currentFrame
            darkModeAnimationRef.current.playSegments(!darkModeActivated ? [currentFrame,16] : [currentFrame,0], true)
        }
    }

    useEffect(()=>{
        const currentDarkMode = getDarkModeFromLocalStorage()
        updateDarkMode(currentDarkMode)
        if (currentDarkMode)
            darkModeAnimationRef.current.playSegments([0,16], true)
    }, [])
    useEffect(()=>{
        if (defaultDarkModeActivated){
            updateDarkMode("dark")
        }
    }, [defaultDarkModeActivated])
    return (
        <div className="dark-mode-button__container" onClick={handleClick}>
            <Lottie 
                loop={false}
                autoplay={false}
                animationData={dark_mode} 
                lottieRef={darkModeAnimationRef} 
                />
        </div>
    )
}