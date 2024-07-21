import axios from 'axios'
import { BACKEND_URL } from '../utils/constants'
import { getBasicConfig } from './baseConfig.api'

/**
 * Llama a la api para crear usuario en servidor
 * @param {Object} data datos del usuario a registrar  
 */
export async function createUsuarioAPI(data){
    let config = await getBasicConfig()
    config.headers['Content-Type'] = 'multipart/form-data'
    return await axios.post(BACKEND_URL+"api/create/",data, config)
}