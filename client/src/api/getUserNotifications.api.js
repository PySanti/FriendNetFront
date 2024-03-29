import axios from "axios";
import { BACKEND_URL } from '../utils/constants'
import { config } from "./baseConfig.api";


export async function getUserNotificationsAPI(accessToken){
    config.headers = {
        'Authorization' : `Bearer ${accessToken}`
    }
    return await axios.post(BACKEND_URL + 'api/get_user_notifications/',undefined, config)
}

