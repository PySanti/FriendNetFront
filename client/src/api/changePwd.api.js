import axios from "axios";
import { BACKEND_URL } from '../utils/constants'
import { getBasicConfig } from "./baseConfig.api";


/**
 * Llama a la api para cambiar old_password por new_password 
 * @param {String} oldPwd  
 * @param {String} newPwd  
 * @param {Number} accessToken
 */
export async function changeUserPwdAPI( oldPwd, newPwd, accessToken){
    const data = {
        'old_password' : oldPwd,
        'new_password' : newPwd
    }
    let config = await getBasicConfig()
    config.headers['Authorization'] = `Bearer ${accessToken}`
    return await axios.post(BACKEND_URL + 'api/change_user_pwd/', data, config)
}
