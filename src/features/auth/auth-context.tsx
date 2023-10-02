import { type Dispatch, createContext, useContext, useReducer } from 'react';

export enum UserActionKind {
    LOGIN = "LOGIN",
    UPDATED = "UPDATED"
}

interface User {
    id: number
    name: string
    lastname: string
    profileImage: string
}

interface UserAction {
    type: UserActionKind;
    payload: User
}
const AuthContext = createContext<User | null>(null);
const TasksDispatchContext = createContext<Dispatch<UserAction> | null>(null);

export function AuthProvider({ children }: any) {
    const [tasks, dispatch] = useReducer(
        userReducer,
        initialUser
    );
    return (
        <AuthContext.Provider value={tasks}>
            <TasksDispatchContext.Provider value={dispatch}>
                {children}
            </TasksDispatchContext.Provider>
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

export function useAuthDispatch() {
    return useContext(TasksDispatchContext);
}

function userReducer(user: User, action: UserAction) {
    const { type, payload } = action;
    switch (type) {
        case UserActionKind.LOGIN: {
            return {
                ...user,
                ...payload
            };
        }
        case UserActionKind.UPDATED: {
            return {
                ...user,
                ...payload
            }
        }
        default: {
            throw Error('Unknown action: ' + type);
        }
    }
}

const initialUser: User = {
    id: -1,
    lastname: "",
    name: "",
    profileImage: ""
}