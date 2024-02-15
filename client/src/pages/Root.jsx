import {Header} from "../components/Header.jsx"
import { userIsAuthenticated } from "../utils/userIsAuthenticated.js"
import { UserLogged } from "./UserLogged.jsx"
import { useNavigate } from "react-router-dom"
import "../styles/Root.css"
import { Button } from "../components/Button.jsx"
import {useEffect} from "react"
import {generateDocumentTitle} from "../utils/generateDocumentTitle"

/**
 * Pagina de inicio
 */
export function Root() {
    const navigate = useNavigate()
    useEffect(()=>{
        document.title = generateDocumentTitle("Inicio")
    }, [])
    if (userIsAuthenticated()){
        return <UserLogged/>
    }else{
        return (
            <div className="centered-container">
                <div className="root-container">
                    <Header msg="¡ Chatea con quien quieras !"/>
                    <section className="redirect-container">
                        <div className="signin-container">
                            <h4 className="signin-container__title">
                                ¿Tienes cuenta? 
                            </h4>
                            <Button buttonText="Inicia Sesión" onClickFunction={()=>{navigate('/login/')}}/>
                        </div>
                        <div className="signup-container">
                            <h4 className="signup-container__title">
                                ¿Aun no tienes cuenta?
                            </h4>
                            <Button buttonText="Regístrate" onClickFunction={()=>{navigate('/signup/')}} />
                        </div>
                    </section>
                </div>
            </div>
        )
    }
}
