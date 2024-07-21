import axios from 'axios'

let clientIp = undefined


export async function getBasicConfig(){
    if (clientIp == undefined){
        clientIp  = (await axios.get('https://api64.ipify.org?format=json')).data.ip
    }
    return {
        headers: {
            'Content-Type': 'application/json',
            'public': clientIp,
        }
    }
}