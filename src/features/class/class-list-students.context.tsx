import { createContext, useReducer, useContext } from "react";
import { UserItem } from "src/types/user";
export interface StudentItem extends UserItem {

}
//define the state's form
export interface ListStudentState {
    items: StudentItem[] | null
}
//define initial state 
let initialState: ListStudentState = {
    items: null
}
//define which actions can be perform in the reducer
type Add = { type: 'add'; payload: StudentItem };
type Set = { type: 'set'; payload: StudentItem[] };
type Remove = { type: 'remove'; payload: number };
type Update = { type: 'update', payload: StudentItem };
type Unset = { type: 'unset' };
type StudentItemActions = Add | Update | Set | Unset | Remove;


//create context for state's form
export const StudentsContext = createContext<ListStudentState | undefined | null>(null);
//create context for dispatch
export const StudentsDispatchContext = createContext<React.Dispatch<StudentItemActions> | undefined | null>(null);

//create reducer to update state
export function classItemReducer(classes: ListStudentState, action: StudentItemActions): ListStudentState {
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
export function StudentsProvider({ children }: React.PropsWithChildren) {
    const [students, dispatch] = useReducer(classItemReducer, initialState);
    return <StudentsContext.Provider value={students}>
        <StudentsDispatchContext.Provider value={dispatch}>
            {children}
        </StudentsDispatchContext.Provider>
    </StudentsContext.Provider>
}

//Create a custom hook to access the state
export function useStudents() {
    return useContext(StudentsContext);
}

//Create a custom hook to access the dispatcher
export function useStudentsDispatch() {
    return useContext(StudentsDispatchContext);
}