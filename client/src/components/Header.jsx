import "../styles/Header.css"
import {PropTypes} from "prop-types"
import {getUserDataFromLocalStorage} from "../utils/getUserDataFromLocalStorage"
import {useDarkMode} from "../store"
/**
 * Cabecera estandar de la pagina
 * @param {String} msg mensaje a renderizar en conjunto con cabecera
 */
export function Header({msg}) {
    const userData = getUserDataFromLocalStorage()
    let darkModeActivated  = useDarkMode((state)=>(state.darkModeActivated))
    const logo1URL = "https://res.cloudinary.com/dshsg4isr/image/upload/h_436,q_auto:best,w_400/v1709227007/logo3V3_odc3mj.png"
    const logo2URL = "https://res.cloudinary.com/dshsg4isr/image/upload/h_436,q_auto:best,w_400/v1709227006/logo3V3Inverted_ap1vlz.png"

    return (
        <>
            <header className="header-container">
                <div className="header-title-container">
                    <h1 className="header-content">
                        {
                            navigator.onLine ?
                                <img 
                                    className="header-logo" 
                                    src={!darkModeActivated ? logo1URL : logo2URL}/>
                            :
                                'F'
                        }
                        riendNet{userData && `, ${userData.username}`}
                    </h1>
                </div>
                {msg && <h2 className="header-msg">{msg}</h2>}
            </header>
        </>
    )
}



Header.propTypes = {
    msg : PropTypes.string
}
Header.defaultProps = {
    msg : undefined
}



