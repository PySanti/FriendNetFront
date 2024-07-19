import {BASE_FALLEN_SERVER_ERROR_MSG, BASE_FALLEN_SERVER_LOG} from "../utils/constants"
import {toast} from "sonner"
/**
 * Funcion creada para estandarizar mensajes de error 
 * 
 * Retornara true en caso de que se logre manejar el error, false en caso contrario
 */
export function handleStandardApiErrors(error){
    try {
        if (error.message === BASE_FALLEN_SERVER_ERROR_MSG  || error.response.status == 403){
            if (error.message === BASE_FALLEN_SERVER_ERROR_MSG){
                toast.error(BASE_FALLEN_SERVER_LOG)
            } else {
                if (error.response.data.error === "banned_ip_fucK_u"){
                    toast.error(`IP suspendida permanentemente por consumo sospechoso`)
                } else if (error.response.data.error === "suspicious_ip"){
                    toast.error(`Error por IP sospechosa, inténtalo mas tarde`)
                } else {
                    const suspended_date = (new Date(error.response.data.until)).toLocaleString()
                    toast.error(`IP suspendida hasta ${suspended_date} por consumo sospechoso`)
                }
            }
            return true;
        } else {
            return false;
        }
    } catch{
        toast.error("Error inesperado")
        return true;
    }

}