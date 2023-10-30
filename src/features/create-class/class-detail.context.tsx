import { ClassItem } from "@features/panel/panel-list.context";
import { Text } from "@mantine/core";
import { ClassflowGetService, ClassflowPostService, ErrorClassflow, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import { createContext, useReducer, useContext, useState, useEffect, Dispatch } from "react";
import { Outlet, useParams } from "react-router-dom";

//define the state's form

//create context for state's form
type ClassDetailState = Partial<ClassItem> | null;
export const ClassDetailContext = createContext<ClassDetailState | null>(null);
const initialState = null;
//Create a provider to access both, state and dispatch actions
export function ClassProvider({ children }: React.PropsWithChildren) {
    const [loading, setLoading] = useState(true);
    const [errorState, setErrorState] = useState<boolean>(true);
    const [classDetail, dispatch] = useReducer(classDetailsReducer, null);
    const { classId } = useParams();
    const handleGetClassToken = async () => {
        const onError = (error: ErrorClassflow<string>) => {
            setErrorState(true);
            console.log({ error });
        }
        const onFinally = () => {
            setLoading(false);
        }
        const onSuccess = (data: ResponseClassflow<null>) => {
            setErrorState(false);
        }
        //get the class token
        let url = `/authorization/class`;
        let post = new ClassflowPostService<{
            classId: number
        }, null, string>(url, {}, {
            classId: Number(classId)
        });
        post.onError = onError;
        post.onSuccess = onSuccess;
        post.onFinally = onFinally;
        await classflowAPI.exec(post);
    }
    const handleGetClassDetails = async () => {
        const onError = () => {
            setErrorState(true);
            setLoading(false);
        }
        const onSuccess = ({ data, status }: ResponseClassflow<ClassItem>) => {
            dispatch({
                payload: data.data,
                type: "Set"
            });
        }
        const onSend = () => {
            setLoading(true);
        }
        //get the class general data
        let url = `/classes/${classId}`;
        let get = new ClassflowGetService<null, ClassItem, string>(url, {});
        get.onSend = onSend;
        get.onError = onError;
        get.onSuccess = onSuccess;
        await classflowAPI.exec(get);
    }

    useEffect(() => {
        handleGetClassDetails();
    }, [])
    useEffect(() => {
        if (classDetail) {
            handleGetClassToken();
        }
    }, [classDetail])
    if (loading)
        return <Text>Loading...</Text>
    if (classDetail === null || errorState)
        return <Text>Algo ha salido mal</Text>

    return <ClassDetailContext.Provider value={classDetail}>
        <ClassDetailDispatch.Provider value={dispatch}>
            <Outlet />
        </ClassDetailDispatch.Provider>
    </ClassDetailContext.Provider>
}

//Create a custom hook to access the state
export function useClassDetail() {
    return useContext(ClassDetailContext);
}

//define which actions can be perform in the reducer
type NewCode = { type: 'NewCode'; payload: string };
type Set = { type: 'Set'; payload: ClassItem };
type ClassDetailsAction = NewCode | Set;

//create context for dispatch
export const ClassDetailDispatch = createContext<React.Dispatch<ClassDetailsAction> | undefined | null>(null);

//create reducer to update state
export function classDetailsReducer(classDetails: ClassDetailState, action: ClassDetailsAction): ClassDetailState {
    switch (action.type) {
        case 'NewCode': {
            return {
                ...classDetails,
                code: action.payload
            };
        }
        case 'Set': {
            return {
                ...action.payload
            };
        }
        default: {
            console.error("Unknown action: ", action);
            throw Error(`Unknown action`);
        }
    }
}



//Create a custom hook to access the dispatcher
export function useClassDetailsDispatch() {
    return useContext(ClassDetailDispatch);
}
