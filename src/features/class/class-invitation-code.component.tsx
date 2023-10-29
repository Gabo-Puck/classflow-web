import { ClassItem } from '@features/panel/panel-list.context';
import { Card, Avatar, Text, Progress, Badge, Group, ActionIcon, Button, Tooltip, Stack } from '@mantine/core';
import { useClassDetail, useClassDetailsDispatch } from './class-detail.context';
import { useState } from 'react';
import { ClassflowGetService, ClassflowPostService, ErrorClassflow, ResponseClassflow, classflowAPI } from '@services/classflow/classflow';
import { notifications } from '@mantine/notifications';
import { IconRefresh, IconRefreshAlert, IconRefreshDot, IconRefreshOff } from '@tabler/icons-react';

export default function ClassInvitationCode() {
    const classDetail = useClassDetail();
    const dispatch = useClassDetailsDispatch();
    const [loading, setLoading] = useState(false);
    if (!dispatch)
        throw new Error("Classheader should be defined inside a ClassContextProvider");
    if (!classDetail)
        throw new Error("Classheader should be defined inside a ClassContext");

    const handleCoppy = () => {
        const elementTemp = document.createElement('textarea');
        elementTemp.value = classDetail.code as string;
        document.body.appendChild(elementTemp);
        elementTemp.select();
        document.execCommand('copy');
        document.body.removeChild(elementTemp);
    }
    const handleRegenCode = async () => {
        const onError = (error: ErrorClassflow<string>) => {
            console.log({ error });
            notifications.show({
                message: "No se ha podido generar el código",
                color: "red"
            })
        }
        const onFinally = () => {
            setLoading(false);
        }
        const onSuccess = (data: ResponseClassflow<ClassItem>) => {
            notifications.show({
                message: "Se ha generado correctamente el código",
                color: "green"
            })
            dispatch({
                type: "NewCode",
                payload: data.data.data.code
            })
        }

        const onSend = () => {
            setLoading(true);
        }
        //get the class token
        let url = `/classes/regenerateCode`;
        let get = new ClassflowGetService<ClassItem, ClassItem, string>(url, {});
        get.onError = onError;
        get.onSuccess = onSuccess;
        get.onFinally = onFinally;
        get.onSend = onSend;
        await classflowAPI.exec(get);
    }
    return (
        <Card withBorder padding="lg" radius="md" component={Stack} w="250px">
            <Text fz="lg" fw={500} mt="md">
                Codigo de invitación
            </Text>
            <Group align="center">
                <Text fz="sm" c="dimmed" m={0}>
                    {classDetail.code}
                </Text>
                <Tooltip title='Nuevo código' label="Nuevo código">
                    <ActionIcon variant='subtle' loading={loading} onClick={handleRegenCode}>
                        <IconRefresh />
                    </ActionIcon>
                </Tooltip>
            </Group>
            <Button disabled={loading} onClick={handleCoppy}>Copiar código</Button>
        </Card>
    );
}
