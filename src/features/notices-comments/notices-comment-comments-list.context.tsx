import { createContext, useReducer, useContext } from "react";
import { UserItem } from "src/types/user";
export interface NoticeCommentItem {
    id?: number
    content: string
}
//define the state's form
export interface ListNoticeState {
    items: NoticeCommentItem[] | null
}
//define initial state 
let initialState: ListNoticeState = {
    items: null
}
//define which actions can be perform in the reducer
type Add = { type: 'add'; payload: NoticeCommentItem };
type Set = { type: 'set'; payload: NoticeCommentItem[] };
type Remove = { type: 'remove'; payload: number };
type Update = { type: 'update', payload: NoticeCommentItem };
type Unset = { type: 'unset' };
type NoticeItemActions = Add | Update | Set | Unset | Remove;


//create context for state's form
export const NoticesCommentsContext = createContext<ListNoticeState | undefined | null>(null);
//create context for dispatch
export const NoticesCommentDispatchContext = createContext<React.Dispatch<NoticeItemActions> | undefined | null>(null);

//create reducer to update state
export function noticeCommentItemReducer(classes: ListNoticeState, action: NoticeItemActions): ListNoticeState {
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
export function NoticesCommentProvider({ children }: React.PropsWithChildren) {
    const [students, dispatch] = useReducer(noticeCommentItemReducer, initialState);
    return <NoticesCommentsContext.Provider value={students}>
        <NoticesCommentDispatchContext.Provider value={dispatch}>
            {children}
        </NoticesCommentDispatchContext.Provider>
    </NoticesCommentsContext.Provider>
}

//Create a custom hook to access the state
export function useCommentNotices() {
    return useContext(NoticesCommentsContext);
}

//Create a custom hook to access the dispatcher
export function useCommentNoticesDispatch() {
    return useContext(NoticesCommentDispatchContext);
}