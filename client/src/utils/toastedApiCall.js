import {toast} from "sonner"
import {executeApi} from "./executeApi"
import {CALLING_DB} from "../utils/constants"

/**
 * Wrapper del executeApi para implementacion de toast.loading
 */
export async function toastedApiCall(apiCallingFunction, navigateFunc, loadingMsg, apiId){
    if (!CALLING_DB[apiId]){
        CALLING_DB[apiId] = true

        const toastId = toast.loading(loadingMsg)
        const response = await executeApi(apiCallingFunction, navigateFunc)
        toast.dismiss(toastId)

        CALLING_DB[apiId] = false
        return response
    }
    return undefined

}