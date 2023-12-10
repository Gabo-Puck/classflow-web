import { Card, ScrollArea, Stack, Table, Text } from "@mantine/core";
import { ClassflowGetService, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import React, { useEffect, useState } from "react";
import { ROLES, useAuth } from "@features/auth/auth-context";
import { NoticeCommentItem, useCommentNotices, useCommentNoticesDispatch } from "./notices-comment-comments-list.context";
import AvatarClassflow from "@features/ui/avatar.component";
import { Link, useParams } from "react-router-dom";
import Loading from "@features/ui/Loading";


export interface ActionsElementProps extends React.PropsWithChildren {
    notice: NoticeCommentItem;
    index: number
}

export interface ListNoticesProps {
    Element?: React.ComponentType<ActionsElementProps>
}

export default function ListNoticesComment({ Element }: ListNoticesProps) {
    const notices = useCommentNotices();
    const dispatch = useCommentNoticesDispatch();
    const { noticeId } = useParams();
    const [loading, setLoading] = useState(true);
    if (!notices || !dispatch)
        throw new Error("ListNoticesComment should be defined as children of NoticesProvider")

    const onError = () => {
        alert("algo a salido mal");
    }

    const onSuccess = ({ data, status }: ResponseClassflow<NoticeCommentItem[]>) => {
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
        let url = `/notices-comments/notice/${noticeId}`;
        let get = new ClassflowGetService<null, NoticeCommentItem[], string>(url, {});
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
            justifyContent: "space-between"
        }}>
            <Text>
                {element.content}
            </Text>
            {Element && <Element notice={element} index={index} />}
        </Card>
    ));
    return <Stack h="100%">
        {list}
    </Stack>


}
