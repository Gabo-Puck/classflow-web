import { createContext, useReducer, useContext, useState, useEffect, Dispatch } from "react";
export interface InvitationsItem {
    id: number;
    classId: number;
    status: number;
    code: string;
    class: {
        name: string;
        description: string;
    }
}
//define the state's form
export interface InvitationsListState {
    items: InvitationsItem[] | null
}
//define initial state 
let initialState: InvitationsListState = {
    items: null
}
//define which actions can be perform in the reducer
type Add = { type: 'add'; payload: InvitationsItem };
type Set = { type: 'set'; payload: InvitationsItem[] };
type Update = { type: 'update', payload: InvitationsItem };
type Delete = { type: 'delete', payload: number };
type Unset = { type: 'unset' };
type InvitationsItemActions = Add | Update | Set | Unset | Delete;
interface Query {
    order: number;
    setOrder: Dispatch<React.SetStateAction<number>>

    query: string;
    setQuery: Dispatch<React.SetStateAction<string>>
}


//create context for state's form
export const InvitationListContext = createContext<InvitationsListState | undefined | null>(null);
//create context for dispatch
export const InvitationsContextDispatch = createContext<React.Dispatch<InvitationsItemActions> | undefined | null>(null);
export const QueryContext = createContext<Query | null>(null);

//create reducer to update state
export function InvitationsItemReducer(classes: InvitationsListState, action: InvitationsItemActions): InvitationsListState {
    switch (action.type) {
        case 'set': {
            return {
                ...classes,
                items: action.payload
            }
        }
        case 'update': {
            if (!classes.items) {
                return { ...classes }
            }
            let { payload } = action;
            return {
                ...classes,
                items: classes.items.map((t) => t.id === payload.id ? ({ ...t, ...payload }) : t)
            };
        }
        case 'unset': {
            return {
                ...classes,
                items: null
            }
        }
        case 'delete': {
            if (!classes.items) {
                return { ...classes }
            }
            let { payload } = action;
            return {
                ...classes,
                items: classes.items.filter((t) => t.id !== payload)
            };
        }
        default: {
            console.error("Unknown action: ", action);
            throw Error(`Unknown action`);
        }
    }
}

//Create a provider to access both, state and dispatch actions
export function InvitationProvider({ children }: React.PropsWithChildren) {
    const [classes, dispatch] = useReducer(InvitationsItemReducer, initialState);
    const [order, setOrder] = useState(1)
    const [query, setQuery] = useState("")
    useEffect(() => {
        console.log({ order, query });
    }, [order, query])
    return <InvitationListContext.Provider value={classes}>
        <InvitationsContextDispatch.Provider value={dispatch}>
            <QueryContext.Provider value={
                {
                    order,
                    query,
                    setOrder,
                    setQuery
                }
            }>
                {children}

            </QueryContext.Provider>
        </InvitationsContextDispatch.Provider>
    </InvitationListContext.Provider>
}

//Create a custom hook to access the state
export function useInvitations() {
    return useContext(InvitationListContext);
}

//Create a custom hook to access the dispatcher
export function useInvitationsDispatch() {
    return useContext(InvitationsContextDispatch);
}

export function useQuery() {
    return useContext(QueryContext);
}