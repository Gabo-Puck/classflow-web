import { Card, ScrollArea, Stack, Table, Text } from "@mantine/core";
import { ClassflowGetService, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import React, { useEffect, useState } from "react";
import { ROLES, useAuth } from "@features/auth/auth-context";
import { AssignmentItem, useAssignments, useAssignmentsDispatch, useQuery } from "./assingments-list.context";
import AvatarClassflow from "@features/ui/avatar.component";
import { Link } from "react-router-dom";
import Loading from "@features/ui/Loading";
import { AssignmentOrderEnum } from "./panel-order-select.component";


export interface ActionsElementProps extends React.PropsWithChildren {
    notice: AssignmentItem;
    index: number
}

export interface ListNoticesProps {
    Element?: React.ComponentType<ActionsElementProps>
}

export default function ListAssignments({ Element }: ListNoticesProps) {
    const notices = useAssignments();
    const dispatch = useAssignmentsDispatch();
    const [loading, setLoading] = useState(true);
    const filter = useQuery();
    if (!notices || !dispatch)
        throw new Error("ListAssignments should be defined as children of AssignmentProvider")

    if (!filter)
        throw new Error("ListAssignments should be defined as children of QueryProvider")

    const onError = () => {
        alert("algo a salido mal");
    }

    const onSuccess = ({ data, status }: ResponseClassflow<AssignmentItem[]>) => {
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
    const getClasses = async () => {
        let query = `order=${filter.order.order}`;
        if (filter.order.order == AssignmentOrderEnum.CLASIFICATION) {
            query += `&category=${filter.order.category}`;
        }
        let url = `/assignment?${query}`;
        let get = new ClassflowGetService<any, AssignmentItem[], string>(url, {});
        get.onSend = onSend;
        get.onError = onError;
        get.onSuccess = onSuccess;
        get.onFinally = onFinally;
        await classflowAPI.exec(get);
    }

    useEffect(() => {
        if (notices.items === null) {
            getClasses();
        }
    }, [notices.items])
    if (loading || notices.items === null) {
        return <Loading visible={loading} />

    }

    const list = notices.items.map((element, index) => (
        <Card style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
        }} component={Link} to={`ver/${element.id}`}>
            <Text>
                {element.title}
            </Text>
            {Element && <Element notice={element} index={index} />}
        </Card>
    ));
    return <Stack style={{ flex: 1 }}>
        {list}
    </Stack>


}
