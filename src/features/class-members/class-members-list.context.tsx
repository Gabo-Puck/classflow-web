import { createContext, useReducer, useContext } from "react";
import { UserItem } from "src/types/user";
export interface MemberItem extends UserItem {
}
//define the state's form
export interface ListMemberState {
    items: MemberItem[] | null
}
//define initial state 
let initialState: ListMemberState = {
    items: null
}
//define which actions can be perform in the reducer
type Add = { type: 'add'; payload: MemberItem };
type Set = { type: 'set'; payload: MemberItem[] };
type Remove = { type: 'remove'; payload: number };
type Update = { type: 'update', payload: MemberItem };
type Unset = { type: 'unset' };
type MemberItemActions = Add | Update | Set | Unset | Remove;


//create context for state's form
export const MembersContext = createContext<ListMemberState | undefined | null>(null);
//create context for dispatch
export const MembersDispatchContext = createContext<React.Dispatch<MemberItemActions> | undefined | null>(null);

//create reducer to update state
export function classMemberReducer(classes: ListMemberState, action: MemberItemActions): ListMemberState {
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
    const [students, dispatch] = useReducer(classMemberReducer, initialState);
    return <MembersContext.Provider value={students}>
        <MembersDispatchContext.Provider value={dispatch}>
            {children}
        </MembersDispatchContext.Provider>
    </MembersContext.Provider>
}

//Create a custom hook to access the state
export function useClassMember() {
    return useContext(MembersContext);
}

//Create a custom hook to access the dispatcher
export function useClassMemberDispatch() {
    return useContext(MembersDispatchContext);
}