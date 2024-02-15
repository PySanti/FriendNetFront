export function ChatWSGroupDeleteMsg(){
    return JSON.stringify({
        'type' : 'group_delete',
    })
}