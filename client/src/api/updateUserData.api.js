import { getBasicConfig } from './baseConfig.api'
import axios from 'axios'
import { BACKEND_URL } from '../utils/constants'

/**
 *  LLama a api de actualizacion de datos
 * @param {Object} data nuevos datos del usuario  
 * @param {String} accessToken 
 */
export async function updateUserDataAPI(data, accessToken){
    let config = await getBasicConfig()
    config.headers['Content-Type'] = 'multipart/form-data'
    config.headers['Authorization'] = `Bearer ${accessToken}`
    return await axios.put(BACKEND_URL + `api/update_user_data/`,data, config)
}
