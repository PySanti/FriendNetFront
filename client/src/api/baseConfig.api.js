import axios from 'axios'
import {toast} from "sonner"

let clientIp = undefined


export async function getBasicConfig(){
    if (clientIp == undefined){
        try{
            clientIp  = (await axios.get('https://api64.ipify.org?format=json')).data.ip
        } catch {
            toast.error("Error buscando IP publica del usuario, inténtalo de nuevo mas tarde")
        }
    }
    return {
        headers: {
            'Content-Type': 'application/json',
            'public': clientIp,
        }
    }
}