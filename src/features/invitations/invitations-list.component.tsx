import { InvitationsItem, useInvitationsDispatch, useInvitations, useQuery } from "./invitations-list.context"
import { ClassflowGetService, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import { ScrollArea, Stack, Table, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { ROLES, useAuth } from "@features/auth/auth-context";
import { getDescriptionStatus } from "src/types/EnrollmentTypes";


export interface ActionsElementProps extends React.PropsWithChildren {
    invitation: InvitationsItem;
    index: number
}

export interface ListInvitationProps {
    Element?: React.ComponentType<ActionsElementProps>
}

export default function InvitationList({ Element }: ListInvitationProps) {
    const invitations = useInvitations();
    const filter = useQuery();
    const userData = useAuth();
    const dispatch = useInvitationsDispatch();
    const [loading, setLoading] = useState(true);
    const onError = () => {
        alert("algo a salido mal");
    }
    if (!invitations || !dispatch)
        throw new Error("ClassList should be defined as children of ClassProvider")
    const onSuccess = ({ data, status }: ResponseClassflow<InvitationsItem[]>) => {
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
        let url = "";
        if (userData?.role === ROLES.STUDENT)
            url = "/enrollments/student";
        else
            url = "/classes/professor"
        let get = new ClassflowGetService<null, InvitationsItem[], string>(url, {});
        get.onSend = onSend;
        get.onError = onError;
        get.onSuccess = onSuccess;
        get.onFinally = onFinally;
        await classflowAPI.exec(get);
    }

    useEffect(() => {
        console.log({ classes: invitations });
        if (invitations.items === null) {
            getClasses();
        }
    }, [invitations.items])
    if (loading || invitations.items === null) {
        return <Text>Loading...</Text>
    }
    const rows = invitations.items.map((element, index) => (
        <Table.Tr key={element.id}>
            <Table.Td>
                <Stack gap="xs">
                    <Text fz="sm">
                        {element.class.name.trim()}
                    </Text>
                    <Text fz="xs">
                        {element.class.description}
                    </Text>

                </Stack>
            </Table.Td>
            <Table.Td>
                    <Text fz="sm">
                        {getDescriptionStatus(element.status)}
                    </Text>
                </Table.Td>
            {Element && <Table.Td>
                <Element index={index} invitation={element} />
            </Table.Td>

            }

        </Table.Tr>
    ));
    const ths = (
        <Table.Tr>

            <Table.Th>Nombre</Table.Th>
            <Table.Th>Status</Table.Th>
            {Element && <Table.Th>Controles</Table.Th>}
        </Table.Tr>
    );

    return <>
        <ScrollArea style={{
            flex: 1
        }}>
            <Table captionSide="top">
                <Table.Thead>{ths}</Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </ScrollArea>
    </>
    return <>

    </>
}