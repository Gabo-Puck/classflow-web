import { Card, ScrollArea, Stack, Table, Text } from "@mantine/core";
import { ClassflowGetService, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import React, { useEffect, useState } from "react";
import { ROLES, useAuth } from "@features/auth/auth-context";
import { useGroups, useGroupsDispatch } from "./groups-list.context";
import AvatarClassflow from "@features/ui/avatar.component";
import { Link, useParams } from "react-router-dom";
import Loading from "@features/ui/Loading";
import { GroupItem } from "src/types/group";


export interface ActionsElementProps extends React.PropsWithChildren {
    group: GroupItem;
    index: number
}

export interface ListNoticesProps {
    Element?: React.ComponentType<ActionsElementProps>
}

export default function ListGroups({ Element }: ListNoticesProps) {
    const groupState = useGroups();
    const dispatch = useGroupsDispatch();
    const [loading, setLoading] = useState(true);
    const { classId } = useParams();
    if (!groupState || !dispatch)
        throw new Error("ListGroups should be defined as children of NoticesProvider")

    const onError = () => {
        alert("algo a salido mal");
    }

    const onSuccess = ({ data, status }: ResponseClassflow<GroupItem[]>) => {
        dispatch({
            type: "set",
            payload: data.data
        });
    }
    const onSend = () => {
        setLoading(true);
    }
    const onFinally = () => {
        setLoading(false);
    }
    const getMembers = async () => {
        let url = `/groups/class/${classId}`;
        let get = new ClassflowGetService<null, GroupItem[], string>(url, {});
        get.onSend = onSend;
        get.onError = onError;
        get.onSuccess = onSuccess;
        get.onFinally = onFinally;
        await classflowAPI.exec(get);
    }

    useEffect(() => {
        if (groupState.items === null) {
            getMembers();
        }
    }, [groupState.items])
    if (loading || groupState.items === null) {
        return <Loading visible={loading} />

    }

    const list = groupState.items.map((element, index) => (
        <Card style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between"
        }} component={Link} to={`ver/${element.id}`}>
            <Text>
                {element.name}
            </Text>
            {Element && <Element group={element} index={index} />}
        </Card>
    ));
    return <Stack>
        {list}
    </Stack>


}
