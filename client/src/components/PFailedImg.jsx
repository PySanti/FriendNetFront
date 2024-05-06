import {useState} from "react"
import { TbPhotoExclamation } from "react-icons/tb";
import "../styles/PFailedImg.css"
export function PFailedImg({attrs}){
    let [photoFailed, setPhotofailed] = useState(false)
    return (
        <>
            {
                photoFailed?
                <span className="failed-img-icon">
                    <TbPhotoExclamation />
                </span>
                :
                <img  {...attrs} onError={()=>setPhotofailed(true)}/>
            }
        </>
    )
}