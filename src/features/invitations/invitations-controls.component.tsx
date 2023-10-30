
import InvitationList, { ActionsElementProps } from "./invitations-list.component";
import SelectOrder from "./invitations-order-select.component";
import { ActionIcon, Box, Group, Stack, Title, Tooltip } from "@mantine/core";
import { useRole } from "@features/auth/auth-context";
import { InvitationProvider, InvitationsItem, useInvitationsDispatch } from "./invitations-list.context";
import { IconCircleCheck, IconBan } from '@tabler/icons-react';
import { ClassflowDeleteService, ClassflowGetService, ClassflowPostService, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import React, { useEffect, useState } from "react";
import { EnrollmentStatus } from "src/types/EnrollmentTypes";
interface ButtonActionsProps {
    disabled: boolean
    setDisabled: React.Dispatch<boolean>
    invitation: InvitationsItem
}
function AcceptInvitationButton({ disabled, setDisabled, invitation }: ButtonActionsProps) {
    const dispatch = useInvitationsDispatch();
    const [loading, setLoading] = useState(false);
    if (!dispatch)
        throw new Error("ActionsInvitationButton should be defiend as children of InvitationProvider")
    const handleClick = async () => {
        const onError = () => {

        }
        const onSuccess = ({ }: ResponseClassflow<InvitationsItem[]>) => {
            dispatch({
                type: "update",
                payload: {
                    ...invitation,
                    status: EnrollmentStatus.ENROLLED
                }
            });
        }
        const onSend = () => {
            setLoading(true);
        }
        const onFinally = () => {
            setLoading(false);
        }
        let url = "";

        url = "/enrollments/enroll";

        let post = new ClassflowPostService<{ classId: number }, InvitationsItem[], string>(url, {}, {
            classId: invitation.classId
        });
        post.onSend = onSend;
        post.onError = onError;
        post.onSuccess = onSuccess;
        post.onFinally = onFinally;
        await classflowAPI.exec(post);
    }
    useEffect(() => {
        setDisabled(loading);
    }, [loading])
    return <Tooltip label="Aceptar" >
        <ActionIcon
            variant="subtle"
            c="green"
            onClick={handleClick}
            loading={loading}
            disabled={disabled}>
            <IconCircleCheck />
        </ActionIcon>
    </Tooltip>
}
function RejectInvitationButton({ disabled, setDisabled, invitation }: ButtonActionsProps) {
    const dispatch = useInvitationsDispatch();
    const [loading, setLoading] = useState(false);
    if (!dispatch)
        throw new Error("ActionsInvitationButton should be defiend as children of InvitationProvider")
    const handleClick = async () => {
        const onError = () => {

        }
        const onSuccess = ({ }: ResponseClassflow<InvitationsItem[]>) => {
            dispatch({
                type: "delete",
                payload: invitation.id
            });
        }
        const onSend = () => {
            setLoading(true);
        }
        const onFinally = () => {
            setLoading(false);
        }
        let url = "";

        url = `/enrollments/reject/${invitation.classId}`;

        let del = new ClassflowDeleteService<null, InvitationsItem[], string>(url, {});
        del.onSend = onSend;
        del.onError = onError;
        del.onSuccess = onSuccess;
        del.onFinally = onFinally;
        await classflowAPI.exec(del);
    }
    useEffect(() => {
        setDisabled(loading);
    }, [loading])
    return <Tooltip label="Rechazar">
        <ActionIcon variant="subtle" c="red" loading={loading} disabled={disabled} onClick={handleClick}>
            <IconBan />
        </ActionIcon>
    </Tooltip>
}

function ActionsInvitation({ invitation }: ActionsElementProps) {
    const [loading, setLoading] = useState(false);
    if (invitation.status !== EnrollmentStatus.PENDING)
        return <></>;
    return <Group>
        <AcceptInvitationButton disabled={loading} setDisabled={setLoading} invitation={invitation} />
        <RejectInvitationButton disabled={loading} setDisabled={setLoading} invitation={invitation} />
    </Group>
}


export default function InvitationsControls() {
    const role = useRole();
    return (
        <InvitationProvider>
            <Stack pt="sm">
                <Group justify="space-between">
                    <Title>Tus invitaciones</Title>
                    <div style={{
                        alignSelf: "end",
                    }}>

                    </div>
                </Group>
                <SelectOrder />
                <InvitationList Element={ActionsInvitation} />
            </Stack>
        </InvitationProvider>
    )
}