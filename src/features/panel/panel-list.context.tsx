import { createContext, useReducer, useContext, useState, useEffect, Dispatch } from "react";
import { OrderType } from "./panel-order-select.component";
export interface ClassItem {
    id: number;
    name: string;
    description: string;
    code: string;
    professor: {
        name: string;
        lastname: string;
        profilePic: string
    }
    terms: {
        id: number,
        name: string
        termCategories: {
            id: string,
            name: string
        }[]
    }[]
    _count: {
        enrolledStudents: number
    } | undefined
}
//define the state's form
export interface ClassListState {
    items: ClassItem[] | null
}
//define initial state 
let initialState: ClassListState = {
    items: null
}
//define which actions can be perform in the reducer
type Add = { type: 'add'; payload: ClassItem };
type Set = { type: 'set'; payload: ClassItem[] };
type Delete = { type: 'delete', payload: number };
type Unset = { type: 'unset' };
type ClassItemActions = Add | Delete | Set | Unset;
interface Query {
    order: number;
    setOrder: Dispatch<React.SetStateAction<number>>

    query: string;
    setQuery: Dispatch<React.SetStateAction<string>>
}


//create context for state's form
export const ClassesContext = createContext<ClassListState | undefined | null>(null);
//create context for dispatch
export const ClassesDispatchContext = createContext<React.Dispatch<ClassItemActions> | undefined | null>(null);
export const QueryContext = createContext<Query | null>(null);

//create reducer to update state
export function classItemReducer(classes: ClassListState, action: ClassItemActions): ClassListState {
    switch (action.type) {
        case 'set': {
            return {
                ...classes,
                items: action.payload
            }
        }
        case 'delete': {
            if (!classes.items) {
                return { ...classes }
            }
            return {
                ...classes,
                items: classes.items.filter((t) => t.id === action.payload)
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
export function ClassesProvider({ children }: React.PropsWithChildren) {
    const [classes, dispatch] = useReducer(classItemReducer, initialState);
    const [order, setOrder] = useState(OrderType.NEWEST)
    const [query, setQuery] = useState("")
    useEffect(() => {
        dispatch({
            type: "unset"
        })
    }, [order, query])
    return <ClassesContext.Provider value={classes}>
        <ClassesDispatchContext.Provider value={dispatch}>
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
        </ClassesDispatchContext.Provider>
    </ClassesContext.Provider>
}

//Create a custom hook to access the state
export function useClasses() {
    return useContext(ClassesContext);
}

//Create a custom hook to access the dispatcher
export function useClassDispatch() {
    return useContext(ClassesDispatchContext);
}

export function useQuery() {
    return useContext(QueryContext);
}