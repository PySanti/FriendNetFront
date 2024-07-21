import axios from 'axios'
import { BACKEND_URL } from '../utils/constants'
import { getBasicConfig } from './baseConfig.api'

export async function checkSecurityCodeAPI(userEmail, code){
    const data =     {
        "user_email" : userEmail,
        "code" : code
    }
    return await axios.post(BACKEND_URL + `api/check_security_code/`,data, await getBasicConfig())
}
