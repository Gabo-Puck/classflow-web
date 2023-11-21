import { useTabsClassboardDispatch } from "@features/class-board/class-navigation-tabs.context";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

export default function ClassMembersTab() {
    const dispatch = useTabsClassboardDispatch();
    const location = useLocation();
    if (!dispatch)
        throw new Error("NavigationTabs should be defined as children of TabsProvider")

    useEffect(() => {
        dispatch({
            payload: "integrantes",
            path: location.pathname,
            type: "integrantes"
        })
    }, [])
    return <Outlet />
}