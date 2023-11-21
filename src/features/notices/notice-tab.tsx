import { useTabsClassboardDispatch } from "@features/class-board/class-navigation-tabs.context";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

export default function NoticeTab() {
    const dispatch = useTabsClassboardDispatch();
    const location = useLocation();
    if (!dispatch)
        throw new Error("NavigationTabs should be defined as children of TabsProvider")

    useEffect(() => {
        dispatch({
            payload: "anuncios",
            path: location.pathname,
            type: "anuncios"
        })
    }, [])
    return <Outlet />
}