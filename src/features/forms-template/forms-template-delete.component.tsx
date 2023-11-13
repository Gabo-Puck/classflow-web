import { notifications } from "@mantine/notifications"
import { ClassflowDeleteService, ErrorClassflow, ResponseClassflow, classflowAPI } from "@services/classflow/classflow"
import { FormTemplate } from "./forms-template-form.context"
import { modals } from "@mantine/modals"
import { useState } from "react"
import { Box, Button, Flex, Modal, Text } from "@mantine/core"
import { useClassDispatch } from "./forms-template-list.context"

interface DeleteProps {
    id: number
    close: VoidFunction
    opened: boolean
    onClose: VoidFunction
}
export default function DeleteTemplate({ id, close, opened, onClose }: DeleteProps) {

    const [loading, setLoading] = useState(false);
    const dispatch = useClassDispatch();
    if (!dispatch)
        throw new Error("TermTemplateTable should be defined as children of TermTemplatesProvider")
    const deleteTemplate = async () => {
        const onError = (error: ErrorClassflow<string>) => {
            notifications.show({
                message: error.response?.data.message,
                color: "orange"
            })
        }
        const onSuccess = ({ data: { data } }: ResponseClassflow<FormTemplate>) => {
            dispatch({
                type: "delete",
                payload: id
            })
            close();
            notifications.show(({
                message: "Se ha eliminado correctamente la plantilla",
                color: "orange"
            }))
        }
        const onSend = () => { setLoading(true) }
        const onFinally = () => { setLoading(false) }
        let del = new ClassflowDeleteService<{}, FormTemplate, string>(`/term-templates/${id}`, {});
        del.onSend = onSend;
        del.onError = onError;
        del.onSuccess = onSuccess;
        del.onFinally = onFinally;
        await classflowAPI.exec(del);
    }
    return <>
        <Modal.Root opened={opened} onClose={onClose} closeOnClickOutside={!loading} closeOnEscape={!loading}>
            <Modal.Overlay />
            <Modal.Content>
                <Modal.Header>
                    <Modal.Title>Borrar plantilla</Modal.Title>
                    <Modal.CloseButton disabled={!loading} />
                </Modal.Header>
                <Modal.Body>
                    <Box mb="xl">
                        <Text>¿Estas seguro de eliminar la plantilla? Es una acción sin retorno</Text>
                    </Box>
                    <Flex gap="sm" justify="end">
                        <Button variant="light" disabled={loading} color="gray" onClick={close}>No</Button>
                        <Button variant="filled" loading={loading} onClick={deleteTemplate}>Si</Button>
                    </Flex>
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>

    </>
}