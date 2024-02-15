import { useNavigate } from "react-router-dom"
import { Header } from "../components/Header"
import { Button } from "../components/Button"

import {useEffect} from "react"
import {generateDocumentTitle} from "../utils/generateDocumentTitle"


import {PropTypes} from "prop-types"

/**
 * Page a renderizar cuando el usuario trate de acceder a una pagina a la que debe
 * estar logeado sin estarlo
 * @param {String} msg mensaje de error para mostrar al usuario
 */
export function UserNotLogged({msg}){
    const navigate = useNavigate()
    useEffect(()=>{
        document.title = generateDocumentTitle("")
    }, [])
    return (
        <div className="centered-container">
            <div className="usernot-logged-container">
                <Header msg={msg ? msg : "Aun no has iniciado sesión"}/>
                <Button buttonText="Iniciar sesión" onClickFunction={()=> {navigate('/')}}/>
            </div>
        </div>
    )
}

UserNotLogged.propTypes = {
    msg : PropTypes.string
}
UserNotLogged.defaultProps = {
    msg : undefined
}