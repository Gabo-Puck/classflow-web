import { createContext, useReducer, useContext } from "react";
export interface ClassItem {
    id: number;
    name: string;
}
//define the state's form
export interface ClassListState {
    items: ClassItem[]
}
//define initial state 
let initialState: ClassListState = {
    items: []
}
//define which actions can be perform in the reducer
type Add = { type: 'add'; payload: ClassItem };
type Set = { type: 'set'; payload: ClassItem[] };
type Delete = { type: 'delete', payload: number };
type ClassItemActions = Add | Delete | Set;

//create context for state's form
export const ClassesContext = createContext<ClassListState | undefined | null>(null);
//create context for dispatch
export const ClassesDispatchContext = createContext<React.Dispatch<ClassItemActions> | undefined | null>(null);

//create reducer to update state
export function classItemReducer(classes: ClassListState, action: ClassItemActions): ClassListState {
    switch (action.type) {
        case 'set': {
            return {
                ...classes,
                items: action.payload
            }
        }
        case 'add': {
            return {
                ...classes,
                items: [...classes.items, { ...action.payload }]
            };
        }
        case 'delete': {
            return {
                ...classes,
                items: classes.items.filter((t) => t.id === action.payload)
            };
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
    return <ClassesContext.Provider value={classes}>
        <ClassesDispatchContext.Provider value={dispatch}>
            {children}
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