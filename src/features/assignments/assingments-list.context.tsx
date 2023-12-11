import { createContext, useReducer, useContext, useState, useEffect, Dispatch } from "react";
import { AssignmentOrderEnum } from "./panel-order-select.component";
export interface AssignmentItem {
    id?: number
    title: string
    content: string
}
//define the state's form
export interface ListAssignmentState {
    items: AssignmentItem[] | null
}

type AssignmentOrderByCompleted = { order: AssignmentOrderEnum.COMPLETED };
type AssignmentOrderByPending = { order: AssignmentOrderEnum.PENDING };
type AssignmentOrderByNewest = { order: AssignmentOrderEnum.NEWEST };
type AssignmentOrderByOldest = { order: AssignmentOrderEnum.OLDEST };
type AssignmentOrderByClasification = { order: AssignmentOrderEnum.CLASIFICATION, category: number };
export type AssignmentOrder = AssignmentOrderByCompleted | AssignmentOrderByPending | AssignmentOrderByNewest | AssignmentOrderByOldest | AssignmentOrderByClasification

interface Query {
    order: AssignmentOrder;
    setOrder: Dispatch<React.SetStateAction<AssignmentOrder>>

    query: string;
    setQuery: Dispatch<React.SetStateAction<string>>
}
//define initial state 
let initialState: ListAssignmentState = {
    items: null
}
//define which actions can be perform in the reducer
type Add = { type: 'add'; payload: AssignmentItem };
type Set = { type: 'set'; payload: AssignmentItem[] };
type Remove = { type: 'remove'; payload: number };
type Update = { type: 'update', payload: AssignmentItem };
type Unset = { type: 'unset' };
type AssignmentItemActions = Add | Update | Set | Unset | Remove;


//create context for state's form
export const AssignmentsContext = createContext<ListAssignmentState | undefined | null>(null);
//create context for dispatch
export const AssignmentsDispatchContext = createContext<React.Dispatch<AssignmentItemActions> | undefined | null>(null);
export const QueryContext = createContext<Query | null>(null);

//create reducer to update state
export function assignmentItemReducer(classes: ListAssignmentState, action: AssignmentItemActions): ListAssignmentState {
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
export function AssignmentsProvider({ children }: React.PropsWithChildren) {
    const [students, dispatch] = useReducer(assignmentItemReducer, initialState);
    const [order, setOrder] = useState<AssignmentOrder>({
        order: AssignmentOrderEnum.NEWEST
    })
    const [query, setQuery] = useState("")
    useEffect(() => {
        dispatch({
            type: "unset"
        })
    }, [order, query])
    return <AssignmentsContext.Provider value={students}>
        <AssignmentsDispatchContext.Provider value={dispatch}>
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
        </AssignmentsDispatchContext.Provider>
    </AssignmentsContext.Provider>
}

//Create a custom hook to access the state
export function useAssignments() {
    return useContext(AssignmentsContext);
}

//Create a custom hook to access the dispatcher
export function useAssignmentsDispatch() {
    return useContext(AssignmentsDispatchContext);
}

export function useQuery() {
    return useContext(QueryContext);
}