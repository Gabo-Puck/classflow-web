import { Card, ScrollArea, Stack, Table, Text } from "@mantine/core";
import { ClassflowGetService, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import React, { useEffect, useState } from "react";
import { ROLES, useAuth } from "@features/auth/auth-context";
import { MemberItem, useClassMember, useClassMemberDispatch } from "./class-members-list.context";
import AvatarClassflow from "@features/ui/avatar.component";
import { Link } from "react-router-dom";
import Loading from "@features/ui/Loading";


export interface ActionsElementProps extends React.PropsWithChildren {
    member: MemberItem;
    index: number
}

export interface ListNoticesProps {
    Element?: React.ComponentType<ActionsElementProps>
}

export default function ListClassMembers({ Element }: ListNoticesProps) {
    const member = useClassMember();
    const dispatch = useClassMemberDispatch();
    const [loading, setLoading] = useState(true);
    if (!member || !dispatch)
        throw new Error("ListClassMembers should be defined as children of NoticesProvider")

    const onError = () => {
        alert("algo a salido mal");
    }

    const onSuccess = ({ data, status }: ResponseClassflow<MemberItem[]>) => {
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
        let url = "/classes/members";
        let get = new ClassflowGetService<null, MemberItem[], string>(url, {});
        get.onSend = onSend;
        get.onError = onError;
        get.onSuccess = onSuccess;
        get.onFinally = onFinally;
        await classflowAPI.exec(get);
    }

    useEffect(() => {
        if (member.items === null) {
            getMembers();
        }
    }, [member.items])
    if (loading || member.items === null) {
        return <Loading visible={loading} />

    }

    const list = member.items.map((element, index) => (
        <Card style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between"
        }} component={Link} to={`ver/${element.id}`}>
            <Text>
                {element.name}
            </Text>
            {Element && <Element member={element} index={index} />}
        </Card>
    ));
    return <Stack>
        {list}
    </Stack>


}
