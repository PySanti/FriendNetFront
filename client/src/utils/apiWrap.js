import {toastedApiCall} from "./toastedApiCall"
import {nonToastedApiCall} from "./nonToastedApiCall"
import {CALLING_DB} from "../utils/constants"


/* 
    Funcion creada para estandarizar llamadas a api's, juntando tanto el uso de toast como
    el uso de CALLING_DB para bloqueo de llamadas a api's que ya estan siendo llamadas

    Los parametros
            'apiCalling'
            navigateFunc
            loadingMsg

        Son obligatorios
    
    En caso de que no se especifique timer (undefined), la llamada a la api sera
    toasted, por tanto, el loading msg se mostrara mientras se ejecuta la api

    En caso de que timer si se especifique (un tiempo en ms), el loading msg se mostrara
    timer milisegundos despues de la llamada
*/
export async function apiWrap(apiCalling, navigateFunc, loadingMsg, timer, apiId){
    console.log(CALLING_DB)
    const execute = async ()=>{
        if (timer){
            return nonToastedApiCall(apiCalling, navigateFunc, loadingMsg, timer)
        } else {
            return toastedApiCall(apiCalling, navigateFunc, loadingMsg)
        }
    }
    if (apiId && !CALLING_DB[apiId]){
        CALLING_DB[apiId] = true
        const response = await execute()
        CALLING_DB[apiId] = false
        return response
    } else if (!apiId){
        return await execute()
    }
}