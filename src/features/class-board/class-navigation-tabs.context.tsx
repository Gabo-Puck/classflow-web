import { createContext, useReducer, useContext, useState } from "react";

//define the state's form

//create context for state's form
interface TabsState {
    activeTab: string | null
    path: string | null
}

type ClassTabState = TabsState;
const initialState: ClassTabState = {
    activeTab: null,
    path: null
}
export const TabsStateContext = createContext<ClassTabState>(initialState);
//Create a provider to access both, state and dispatch actions
export function TabsProvider({ children }: React.PropsWithChildren) {
    const [loading, setLoading] = useState(true);
    const [errorState, setErrorState] = useState<boolean>(true);
    const [activeTab, dispatch] = useReducer(classDetailsReducer, initialState);

    return <TabsStateContext.Provider value={activeTab}>
        <ClassDetailDispatch.Provider value={dispatch}>
            {children}
        </ClassDetailDispatch.Provider>
    </TabsStateContext.Provider>
}

//Create a custom hook to access the state
export function useTabsClassBoard() {
    return useContext(TabsStateContext);
}

//define which actions can be perform in the reducer
type Anuncios = { type: 'anuncios'; payload: "anuncios", path: string };
type Integrantes = { type: 'integrantes'; payload: "integrantes", path: string };
type Tareas = { type: 'tareas'; payload: "tareas", path: string };
export type TabsAction = Anuncios | Integrantes | Tareas;

//create context for dispatch
export const ClassDetailDispatch = createContext<React.Dispatch<TabsAction> | undefined | null>(null);

//create reducer to update state
export function classDetailsReducer(classDetails: ClassTabState | null, action: TabsAction): ClassTabState {
    switch (action.type) {
        case 'anuncios':
        case 'integrantes':
        case 'tareas':
            return {
                ...classDetails,
                activeTab: action.payload,
                path: action.path
            };
        default: {
            console.error("Unknown action: ", action);
            throw Error(`Unknown action`);
        }
    }
}



//Create a custom hook to access the dispatcher
export function useTabsClassboardDispatch() {
    return useContext(ClassDetailDispatch);
}
