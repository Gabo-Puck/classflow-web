import { Text } from '@mantine/core';

import { ClassflowGetService, ClassflowPostService, ErrorClassflow, ResponseClassflow, classflowAPI } from '@services/classflow/classflow';

import { type Dispatch, createContext, useContext, useReducer, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export enum UserActionKind {
    LOGIN = "LOGIN",
    UPDATED = "UPDATED",
    LOGOUT = "LOGOUT"
}

export enum ROLES {
    PROFESSOR = "PROFESSOR",
    STUDENT = "STUDENT"
}

interface User {
    name: string
    profilePic: string
    role: ROLES | ""
}


interface UserAction {
    type: UserActionKind;
    payload: User
}


const AuthContext = createContext<User | null>(null);
const UserDispatchContext = createContext<Dispatch<UserAction> | null>(null);

export function AuthProvider({ children }: any) {
    let navigate = useNavigate();
    let location = useLocation();
    const [tasks, dispatch] = useReducer(
        userReducer,
        initialUser
    );


    const [loading, setLoading] = useState(true);
    const onError = (data: ErrorClassflow<string>) => {
        let { pathname, search } = location;
        let redirect = "";
        if (pathname !== "/login") {
            redirect = `?redirect=${pathname}${search}`;
        }
        navigate(`/login${redirect}`)
    }
    const onSuccess = (data: ResponseClassflow<User>) => {
        setLoading(false)
        console.log("TOKEN", data);
        let { data: { data: userData } } = data;
        dispatch({
            type: UserActionKind.LOGIN,
            payload: userData

        })
    }
    const onSend = () => { }
    const onFinally = () => {
        setLoading(false)
    }
    const handleSubmit = async () => {
        let get = new ClassflowGetService<string, User, string>("/authorization/validate", {});
        get.onSend = onSend;
        get.onError = onError;
        get.onSuccess = onSuccess;
        get.onFinally = onFinally;
        await classflowAPI.exec(get);
    }
    useEffect(() => {
        handleSubmit()
    }, [])

    if (loading) {
        return <Text>Loadingx...</Text>
    }
    return (
        <AuthContext.Provider value={tasks}>
            <UserDispatchContext.Provider value={dispatch}>
                <Outlet />
            </UserDispatchContext.Provider>
        </AuthContext.Provider>
    );
}



export function useAuth() {
    return useContext(AuthContext);
}

export function useAuthDispatch() {
    return useContext(UserDispatchContext);
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
        case UserActionKind.LOGOUT: {
            return { ...initialUser };
        }
        default: {
            throw Error('Unknown action: ' + type);
        }
    }
}

const initialUser: User = {
    name: "",
    profilePic: "",
    role: ""
}