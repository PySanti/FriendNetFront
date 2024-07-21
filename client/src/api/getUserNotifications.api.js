import axios from "axios";
import { BACKEND_URL } from '../utils/constants'
import { getBasicConfig } from "./baseConfig.api";


export async function getUserNotificationsAPI(accessToken){
    let config = await getBasicConfig()
    config.headers['Authorization'] = `Bearer ${accessToken}`
    return await axios.post(BACKEND_URL + 'api/get_user_notifications/',undefined, config)
}

