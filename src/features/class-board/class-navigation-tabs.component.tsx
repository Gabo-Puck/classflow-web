import { Tabs } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { TabsAction, useTabsClassBoard, useTabsClassboardDispatch } from "./class-navigation-tabs.context";
import { useEffect } from "react";

export default function NavigationTabs() {
    const tabs = useTabsClassBoard();
    const { classId } = useParams();
    const dispatch = useTabsClassboardDispatch();
    if (!dispatch || !tabs)
        throw new Error("NavigationTabs should be defined as children of TabsProvider")
    const navigate = useNavigate();
    const { activeTab, path } = tabs;
    useEffect(() => {
        if (activeTab && path)
            navigate(`${path}`)
    }, [activeTab])
    if (activeTab === null) {
        return <></>
    }
    return <Tabs value={activeTab} onChange={(value) => dispatch({
        type: value,
        payload: value,
        path: `/app/clase/${classId}/${value}`
    } as TabsAction)} keepMounted={false}>
        <Tabs.List justify="center">
            <Tabs.Tab value="anuncios">Anuncios</Tabs.Tab>
            <Tabs.Tab value="tareas">Tareas</Tabs.Tab>
            <Tabs.Tab value="integrantes">Integrantes</Tabs.Tab>
        </Tabs.List>
    </Tabs>
}