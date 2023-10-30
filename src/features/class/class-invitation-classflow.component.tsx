import { ActionIcon, Box, Button, Center, ElementProps, Modal, ModalContent, ScrollArea, Stack, Text, Tooltip } from "@mantine/core";
import { ClassflowPostService, ErrorClassflow, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { ROLES, useRole } from "@features/auth/auth-context";
import { StudentItem, StudentsProvider, useStudents, useStudentsDispatch } from "./class-list-students.context";
import ListStudents, { ListStudentsProps, ActionsElementProps } from "./class-list-students.component";
import { AutcompleteUsersInvite } from "@features/ui/autocomplete-users.component";
import { IconCircleMinus } from "@tabler/icons-react"

interface EnrollInfo {
    idUsers: number[];
}

interface EnrollClassProps {
    close(): void
}

function InvitationActions({ index }: ActionsElementProps) {
    const dispatch = useStudentsDispatch();
    if (!dispatch)
        throw new Error("InvitationActions should be defined as children of StudentProvider")

    const handleRemove = () => {
        dispatch({
            type: "remove",
            payload: index
        })
    }
    return <Center>
        <ActionIcon variant="light" color="red" onClick={handleRemove}>
            <IconCircleMinus />
        </ActionIcon>
    </Center>
}

export function EnrollClassClassflow({
    close = () => { }
}: EnrollClassProps) {
    const [loading, setLoading] = useState(false);
    const students = useStudents();
    const dispatch = useStudentsDispatch();
    if (!students)
        throw new Error("students should be defined as children of StudentsProvider");
    if (!dispatch)
        throw new Error("dispatch should be defined as children of StudentsProvider")
    const onError = (data: ErrorClassflow<string>) => {
        notifications.show({
            message: data.response?.data.message,
            color: "orange"
        })
    }
    const onSuccess = (data: ResponseClassflow<StudentItem>) => {
        notifications.show({
            message: data.data.message,
            color: "green"
        })
        close();
    }
    const onSend = () => {
        setLoading(true);
    }
    const onFinally = () => {
        setLoading(false);
        dispatch({
            type: "unset"
        })
    }
    const handleSubmit = async () => {
        if (!students.items)
            return;
        let post = new ClassflowPostService<EnrollInfo, StudentItem, string>("/enrollments/create", {

        }, {
            idUsers: students.items.map(({ id }) => id)
        });
        post.onSend = onSend;
        post.onError = onError;
        post.onSuccess = onSuccess;
        post.onFinally = onFinally;
        await classflowAPI.exec(post);
    }

    const handleSelect = (user: StudentItem) => {
        dispatch({
            type: "add",
            payload: user
        })
    }
    useEffect(() => {
        dispatch({
            payload: [],
            type: "set"
        })
    }, [])
    return <>
        <Stack w="100%" h="100%">
            <AutcompleteUsersInvite onSelect={handleSelect} selectedList={students.items} />
            <ListStudents Element={InvitationActions} />
            <Box style={{
                alignSelf: "end",
                justifySelf: "end"
            }}>
                <Tooltip label="Selecciona algún usuario" disabled={!(students.items?.length === 0)}>
                    <Button disabled={students.items?.length === 0} onClick={handleSubmit} loading={loading}>Enviar</Button>

                </Tooltip>
            </Box>
        </Stack>
    </>

}

export function EnrollClassEmailWrapper({ close = () => { } }: EnrollClassProps) {
    return <StudentsProvider>
        <EnrollClassClassflow close={close} />
    </StudentsProvider>
}

export function ButtonModalEnrollEmail() {
    const [opened, { open, close }] = useDisclosure(false);
    const role = useRole();
    return <>
        {/* render only for professor */}
        {role === ROLES.PROFESSOR && <>
            <Button w="100%" onClick={open}>Invitar</Button>
            <Modal
                styles={{
                    content: {
                        width: "50vw"
                    }
                }}

                size="auto"
                id="enroll-modal"
                opened={opened}
                onClose={close}

                title="Enviar invitaciones para la clase">
                <Modal.Body h="70vh" w="100%" style={{ display: "flex" }}>
                    <EnrollClassEmailWrapper close={close} />
                </Modal.Body>

            </Modal>
        </>
        }
    </>
}