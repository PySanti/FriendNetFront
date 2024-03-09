import {toast} from "sonner"
import {executeApi} from "./executeApi"
import {CALLING_DB} from "../utils/constants"

// funcion creada como wrapper para llamadas a apis en las que se quiera renderizar un toast.loading
// despues de x cantidad de tiempo (timer)
export async function  nonToastedApiCall(apiCalling, navigateFunc, loadingMsg, timer, apiId){
    if (!CALLING_DB[apiId]){
        CALLING_DB[apiId] = true

        let resolved = false;
        let toastId = false;
        setTimeout(() => {
            if (!resolved){
                toastId = toast.loading(loadingMsg)
            }
        }, timer);
        const response = await executeApi(apiCalling, navigateFunc)
        resolved = true
        if (toastId)
            toast.dismiss(toastId)

        CALLING_DB[apiId] = false

        return response
    }
    return undefined
}