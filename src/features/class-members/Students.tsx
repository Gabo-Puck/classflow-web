import { useTabsClassBoard, useTabsClassboardDispatch } from "@features/class-board/class-navigation-tabs.context";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Students() {
    const dispatch = useTabsClassboardDispatch();
    if (!dispatch)
        throw new Error("NavigationTabs should be defined as children of TabsProvider")
    const navigate = useNavigate();
    useEffect(() => {
        dispatch({
            type: "integrantes",
            payload: "integrantes"
        })
    }, [])
    return <>estudiantes</>
}