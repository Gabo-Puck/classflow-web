import { useTabsClassboardDispatch } from "@features/class-board/class-navigation-tabs.context";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

export default function ClassMembersTab() {
    const dispatch = useTabsClassboardDispatch();
    if (!dispatch)
        throw new Error("NavigationTabs should be defined as children of TabsProvider")

    useEffect(() => {
        dispatch({
            payload: "integrantes",
            type: "integrantes"
        })
    }, [])
    return <Outlet />
}