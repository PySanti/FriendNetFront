import axios from "axios";
import { BACKEND_URL } from '../utils/constants'
import { getBasicConfig } from "./baseConfig.api";


export async function recoveryPasswordAPI(email, newPassword, security_code){
    const data = {
        'email' : email,
        'new_password' : newPassword,
        'security_code' : security_code
    }
    return await axios.post(BACKEND_URL + 'api/recovery_password/', data, await getBasicConfig())
}