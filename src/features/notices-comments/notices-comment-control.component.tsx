import { Button, Group, ScrollArea, Stack, Table, Text } from "@mantine/core";
import { ClassflowGetService, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import React, { useEffect, useState } from "react";
import { ROLES, useAuth } from "@features/auth/auth-context";
import { NoticeCommentItem, NoticesCommentProvider, useCommentNotices, useCommentNoticesDispatch } from "./notices-comment-comments-list.context";
import AvatarClassflow from "@features/ui/avatar.component";
import ListNoticesComment, { ActionsElementProps } from "./notices-list.component";
import { Link } from "react-router-dom";
import NoticeCommentForm from "./notices-comment-create-form.component";
//TODO: Fix element.id.trim is not a function in autocomplete invitations :p

export default function NoticesCommentsControl() {
    return <>
        <NoticesCommentProvider>
            <Stack>
                <NoticeCommentForm />
                <ListNoticesComment />
            </Stack>
        </NoticesCommentProvider>
    </>

}
