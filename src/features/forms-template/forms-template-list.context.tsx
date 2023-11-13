import { createContext, useReducer, useContext, useState, useEffect, Dispatch } from "react";
import { FormTemplate } from "./forms-template-form.context";

export type FormTemplateListItem = Pick<FormTemplate, 'id' | 'name' | "createdAt" | "updatedAt">;
//define the state's form
export interface TermTemplateListState {
    items: FormTemplateListItem[] | null
}
//define initial state 
let initialState: TermTemplateListState = {
    items: null
}
//define which actions can be perform in the reducer
type Add = { type: 'add'; payload: FormTemplateListItem };
type Set = { type: 'set'; payload: FormTemplateListItem[] };
type Delete = { type: 'delete', payload: number };
type Unset = { type: 'unset' };
type TermTemplateActions = Add | Delete | Set | Unset;
interface Query {
    order: number;
    setOrder: Dispatch<React.SetStateAction<number>>

    query: string;
    setQuery: Dispatch<React.SetStateAction<string>>
}


//create context for state's form
export const TermTemplatesContext = createContext<TermTemplateListState | undefined | null>(null);
//create context for dispatch
export const TermTemplatesDispatchContext = createContext<React.Dispatch<TermTemplateActions> | undefined | null>(null);
export const QueryContext = createContext<Query | null>(null);

//create reducer to update state
export function classItemReducer(termTemplates: TermTemplateListState, action: TermTemplateActions): TermTemplateListState {
    switch (action.type) {
        case 'set': {
            return {
                ...termTemplates,
                items: action.payload
            }
        }
        case 'delete': {
            if (!termTemplates.items) {
                return { ...termTemplates }
            }
            return {
                ...termTemplates,
                items: termTemplates.items.filter((t) => t.id !== action.payload)
            };
        }
        case 'unset': {
            return {
                ...termTemplates,
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
export function TermTemplatesProvider({ children }: React.PropsWithChildren) {
    const [classes, dispatch] = useReducer(classItemReducer, initialState);
    const [order, setOrder] = useState(1)
    const [query, setQuery] = useState("")
    useEffect(() => {
        console.log({ order, query });
    }, [order, query])
    return <TermTemplatesContext.Provider value={classes}>
        <TermTemplatesDispatchContext.Provider value={dispatch}>
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
        </TermTemplatesDispatchContext.Provider>
    </TermTemplatesContext.Provider>
}

//Create a custom hook to access the state
export function useTemplates() {
    return useContext(TermTemplatesContext);
}

//Create a custom hook to access the dispatcher
export function useClassDispatch() {
    return useContext(TermTemplatesDispatchContext);
}

export function useQuery() {
    return useContext(QueryContext);
}