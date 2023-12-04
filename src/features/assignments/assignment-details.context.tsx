import { AssigmentCreate } from "@features/create-assignment/assignment-create-form.context";
import { FileItem } from "@features/ui/file-item";
import { createContext, useReducer, useContext, useState, useEffect, Dispatch } from "react";
//define the state's form
export interface AssignmentDetailState {
    assignment: AssigmentCreate | null
}
//define initial state 
let initialState: AssignmentDetailState = {
    assignment: null
}
//define which actions can be perform in the reducer
type Add = { type: 'add-file'; payload: FileItem };
type Set = { type: 'set'; payload: AssigmentCreate };
type Delete = { type: 'delete-file', payload: number };
type Unset = { type: 'unset' };
type AssignmentDetailActions = Add | Set | Unset | Delete;

//create context for state's form
export const AssignmentDetailContext = createContext<AssignmentDetailState | undefined | null>(null);
//create context for dispatch
export const AssignmentDetailContextDispatch = createContext<React.Dispatch<AssignmentDetailActions> | undefined | null>(null);

//create reducer to update state
export function AssignmentDetailsReducer(classes: AssignmentDetailState, action: AssignmentDetailActions): AssignmentDetailState {
    switch (action.type) {
        case 'set': {
            return {
                ...classes,
                assignment: {
                    ...action.payload
                }
            }
        }
        case 'unset': {
            return {
                ...classes,
                assignment: null
            }
        }
        // case 'delete-file': {
        //     if (!classes.assignment) {
        //         return { ...classes }
        //     }
        //     let { payload } = action;
        //     return {
        //         ...classes,
        //         assignment: classes.assignment.filter((t) => t.id !== payload)
        //     };
        // }
        default: {
            console.error("Unknown action: ", action);
            throw Error(`Unknown action`);
        }
    }
}

//Create a provider to access both, state and dispatch actions
export function AssignmentDetailProvider({ children }: React.PropsWithChildren) {
    const [classes, dispatch] = useReducer(AssignmentDetailsReducer, initialState);
    return <AssignmentDetailContext.Provider value={classes}>
        <AssignmentDetailContextDispatch.Provider value={dispatch}>
            {children}
        </AssignmentDetailContextDispatch.Provider>
    </AssignmentDetailContext.Provider>
}

//Create a custom hook to access the state
export function useAssignmentDetail() {
    return useContext(AssignmentDetailContext);
}

//Create a custom hook to access the dispatcher
export function useAssignmentDetailDispatch() {
    return useContext(AssignmentDetailContextDispatch);
}
