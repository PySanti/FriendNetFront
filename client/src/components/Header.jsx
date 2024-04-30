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
    const logo1URL = "/header-logo/header-logo-inv.png"
    const logo2URL = "/header-logo/header-logo.png"

    return (
        <>
            <header className="header-container">
                <div className="header-title-container">
                    <h1 className="header-content">
                        <img className="header-logo" src={!darkModeActivated ? logo2URL : logo1URL}/>
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



