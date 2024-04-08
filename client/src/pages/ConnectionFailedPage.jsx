import {Header} from "../components/Header.jsx"
import {Button} from "../components/Button.jsx"
import {logoutUser} from "../utils/logoutUser"
import {useConnectionFailed} from "../store"
export function ConnectionFailedPage(){
    let setConnectionFailed = useConnectionFailed((state)=>(state.setConnectionFailed))
    const handleButtonClick = ()=>{
        logoutUser(undefined)
        setConnectionFailed(false)
    }
    return (
        <div className="centered-container">
            <Header msg="Se ha iniciado sesión desde otro dispositivo"/>
            <Button buttonText="Pagina Principal" onClickFunction={handleButtonClick}/>
        </div>
    )
}