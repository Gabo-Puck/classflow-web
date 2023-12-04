import { createContext, useReducer, useContext } from "react";
import { GroupItem } from "src/types/group";

//define the state's form
export interface ListGroupState {
    items: GroupItem[] | null
}
//define initial state 
let initialState: ListGroupState = {
    items: null
}
//define which actions can be perform in the reducer
type Add = { type: 'add'; payload: GroupItem };
type Set = { type: 'set'; payload: GroupItem[] };
type Remove = { type: 'remove'; payload: number };
type Update = { type: 'update', payload: GroupItem };
type Unset = { type: 'unset' };
type GroupItemActions = Add | Update | Set | Unset | Remove;


//create context for state's form
export const GroupsContext = createContext<ListGroupState | undefined | null>(null);
//create context for dispatch
export const GroupsDispatchContext = createContext<React.Dispatch<GroupItemActions> | undefined | null>(null);

//create reducer to update state
export function groupsReducer(state: ListGroupState, action: GroupItemActions): ListGroupState {
    switch (action.type) {
        case 'set': {
            return {
                ...state,
                items: action.payload
            }
        }
        case 'remove': {
            if (!state.items) {
                return { ...state }
            }
            return {
                ...state,
                items: state.items.filter((value, index) => index !== action.payload)
            };
        }
        case 'add': {
            if (!state.items) {
                return { ...state }
            }
            return {
                ...state,
                items: [...state.items, action.payload]
            };
        }
        case 'update': {
            if (!state.items) {
                return { ...state }
            }
            let { payload } = action;
            return {
                ...state,
                items: state.items.map((item) => item.id === payload.id ? ({ ...item, ...payload }) : item)
            };
        }
        case 'unset': {
            return {
                ...state,
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
export function GroupsProvider({ children }: React.PropsWithChildren) {
    const [groups, dispatch] = useReducer(groupsReducer, initialState);
    return <GroupsContext.Provider value={groups}>
        <GroupsDispatchContext.Provider value={dispatch}>
            {children}
        </GroupsDispatchContext.Provider>
    </GroupsContext.Provider>
}

//Create a custom hook to access the state
export function useGroups() {
    return useContext(GroupsContext);
}

//Create a custom hook to access the dispatcher
export function useGroupsDispatch() {
    return useContext(GroupsDispatchContext);
}