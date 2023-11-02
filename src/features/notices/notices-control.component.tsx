import { Button, Group, ScrollArea, Stack, Table, Text } from "@mantine/core";
import { ClassflowGetService, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import React, { useEffect, useState } from "react";
import { ROLES, useAuth } from "@features/auth/auth-context";
import { NoticeItem, NoticesProvider, useNotices, useNoticesDispatch } from "./notices-list.context";
import AvatarClassflow from "@features/ui/avatar.component";
import ListNotices, { ActionsElementProps } from "./notices-list.component";
import { Link } from "react-router-dom";


export default function NoticesControl() {
    return <>
        <NoticesProvider>
            <Stack>
                <Button component={Link} to="anuncios/crear" fullWidth>Crear anuncio</Button>
                <ListNotices />
            </Stack>
        </NoticesProvider>
    </>

}
