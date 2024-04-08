import {Header} from "../components/Header.jsx"
import {Button} from "../components/Button.jsx"
import {logoutUser} from "../utils/logoutUser"
export function ConnectionFailedPage(){
    const handleButtonClick = ()=>{
        logoutUser(undefined)
    }
    return (
        <div className="centered-container">
            <Header msg="Se ha iniciado sesión desde otro dispositivo"/>
            <Button buttonText="Pagina Principal" onClickFunction={handleButtonClick}/>
        </div>
    )
}