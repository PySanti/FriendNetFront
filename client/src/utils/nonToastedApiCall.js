import {toast} from "sonner"
import {executeApi} from "./executeApi"

// funcion creada como wrapper para llamadas a apis en las que se quiera renderizar un toast.loading
// despues de x cantidad de tiempo (timer)

const toastIdsList = []
export async function  nonToastedApiCall(apiCalling, navigateFunc, loadingMsg, timer){
    let resolved = false;
    setTimeout(() => {
        if (!resolved){
            toastIdsList.push(toast.loading(loadingMsg))
        }
    }, timer);
    const response = await executeApi(apiCalling, navigateFunc)
    resolved = true
    toastIdsList.forEach(element => {
        toast.dismiss(element)
    });
    return response
}