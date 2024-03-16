import { SMALL_DEVICE_WIDTH} from "./utils/constants"
import create from "zustand"


export const useUsersList = create((set)=>({
    usersList : [],
    setUsersList : (newUsersList)=>(set(()=>({usersList : newUsersList}))),
    reset : ()=>(set(()=>({usersList : []})))
}))


export const useUsersIdList = create((set)=>({
    usersIdList : [], 
    setUsersIdList : (usersIdList) => set(() => ({usersIdList : usersIdList})),
    reset : ()=>(set(()=>({usersIdList : []})))
}))


export const useUsersListPage = create((set)=>({
    usersListPage : 1,
    setUsersListPage : (newUsersListPage)=>(set(()=>({usersListPage : newUsersListPage}))),
    reset : ()=>(set(()=>({usersListPage : 1})))
}))




export const useNotifications = create((set)=>({
    notifications : {},
    setNotifications : (newNotifications)=>(set(()=>({notifications : newNotifications}))),
    reset : ()=>(set(()=>({notifications : {}})))
}))



export const useNoMoreUsers = create((set)=>({
    noMoreUsers : false,
    setNoMoreUsers : (newNoMoreUsers)=>(set(()=>({noMoreUsers : newNoMoreUsers}))),
    reset : ()=>(set(()=>({noMoreUsers : false})))
}))



export const useMessagesHistorial = create((set)=>({
    messagesHistorial : [],
    setMessagesHistorial : (newMessages)=>(set(()=>({messagesHistorial : newMessages}))),
    reset : ()=>(set(()=>({messagesHistorial : []})))
}))


export const useLastClickedUser = create((set)=>({
    lastClickedUser : null,
    setLastClickedUser : (newLastClicked)=>(set(()=>({lastClickedUser : newLastClicked}))),
    reset : ()=>(set(()=>({lastClickedUser : null})))
}))

export const useClickedUser = create((set)=>({
    clickedUser : null, 
    setClickedUser : (user) => set(() => ({clickedUser : user})),
    reset : ()=>(set(()=>({clickedUser : null})))
}))

export const useFirstUsersListCall = create((set)=>({
    firstUsersListCall : false,
    setFirstUsersListCall : (new_val)=>(set(()=>({firstUsersListCall : new_val}))),
    reset : ()=>(set(()=>({firstUsersListCall: false})))
}))

export const useDarkMode = create((set)=>({
    darkModeActivated : false,
    setDarkModeActivated : (new_val)=>(set(()=>({darkModeActivated : new_val}))),
}))


export const useUserKeyword = create((set)=>({
    userKeyword : undefined,
    setUserKeyword : (new_val)=>(set(()=>({userKeyword : new_val}))),
    reset : ()=>(set(()=>({userKeyword: undefined})))
}))



export const useTypingDB = create((set)=>({
    typingDB : {},
    setTypingDB : (new_val)=>(set(()=>({typingDB : new_val}))),
    reset : ()=>(set(()=>({typingDB: {}})))
}))


export const useExecutingInSmallDevice  = create((set)=>({
    executingInSmallDevice : window.innerWidth <= SMALL_DEVICE_WIDTH,
    setExecutingInSmallDevice: (new_val)=>(set(()=>({executingInSmallDevice : new_val}))),
}))

export const useDefaultDarkModeActivated  = create((set)=>({
    defaultDarkModeActivated : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
    setDefaultDarkModeActivated: (new_val)=>(set(()=>({defaultDarkModeActivated : new_val}))),
    reset : ()=>(set(()=>({defaultDarkModeActivated: false})))
}))

export const useMsgReceivedInChat = create((set)=>({
    msgReceivedInChat : false,
    setMsgReceivedInChat: (new_val)=>(set(()=>({msgReceivedInChat : new_val}))),
}))

export const useGottaScrollChat = create((set)=>({
    gottaScrollChat : false,
    setGottaScrollChat: (new_val)=>(set(()=>({gottaScrollChat : new_val}))),
}))


export const useEnterChatLoaderActivated = create((set)=>({
    enterChatLoaderActivated : false,
    setEnterChatLoaderActivated: (new_val)=>(set(()=>({enterChatLoaderActivated : new_val}))),
}))

export const useWebsocketMounted = create((set)=>({
    websocketMounted : false,
    setWebsocketMounted: (new_val)=>(set(()=>({websocketMounted : new_val}))),
}))







