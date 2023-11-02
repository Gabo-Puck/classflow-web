import { createContext, useReducer, useContext } from "react";
import { UserItem } from "src/types/user";
export interface NoticeItem {
    id?: number
    title: string
    content: string
}
//define the state's form
export interface ListNoticeState {
    items: NoticeItem[] | null
}
//define initial state 
let initialState: ListNoticeState = {
    items: null
}
//define which actions can be perform in the reducer
type Add = { type: 'add'; payload: NoticeItem };
type Set = { type: 'set'; payload: NoticeItem[] };
type Remove = { type: 'remove'; payload: number };
type Update = { type: 'update', payload: NoticeItem };
type Unset = { type: 'unset' };
type NoticeItemActions = Add | Update | Set | Unset | Remove;


//create context for state's form
export const NoticessContext = createContext<ListNoticeState | undefined | null>(null);
//create context for dispatch
export const NoticesDispatchContext = createContext<React.Dispatch<NoticeItemActions> | undefined | null>(null);

//create reducer to update state
export function classItemReducer(classes: ListNoticeState, action: NoticeItemActions): ListNoticeState {
    switch (action.type) {
        case 'set': {
            return {
                ...classes,
                items: action.payload
            }
        }
        case 'remove': {
            if (!classes.items) {
                return { ...classes }
            }
            return {
                ...classes,
                items: classes.items.filter((value, index) => index !== action.payload)
            };
        }
        case 'add': {
            if (!classes.items) {
                return { ...classes }
            }
            return {
                ...classes,
                items: [...classes.items, action.payload]
            };
        }
        case 'update': {
            if (!classes.items) {
                return { ...classes }
            }
            let { payload } = action;
            return {
                ...classes,
                items: classes.items.map((item) => item.id === payload.id ? ({ ...item, ...payload }) : item)
            };
        }
        case 'unset': {
            return {
                ...classes,
                items: null
            }
        }
        default: {
            console.error("Unknown action: ", action);
            throw Error(`Unknown action`);
        }
    }
}

//Create a provider to access both, state and dispatch actions
export function NoticesProvider({ children }: React.PropsWithChildren) {
    const [students, dispatch] = useReducer(classItemReducer, initialState);
    return <NoticessContext.Provider value={students}>
        <NoticesDispatchContext.Provider value={dispatch}>
            {children}
        </NoticesDispatchContext.Provider>
    </NoticessContext.Provider>
}

//Create a custom hook to access the state
export function useNotices() {
    return useContext(NoticessContext);
}

//Create a custom hook to access the dispatcher
export function useNoticesDispatch() {
    return useContext(NoticesDispatchContext);
}