import { useEffect, useState } from "react";
import { FormTemplateListItem, useClassDispatch, useTemplates, useQuery } from "./forms-template-list.context"
import { ClassflowGetService, ErrorClassflow, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import { Dialog, Group, Modal, Table } from '@mantine/core';
import { Text } from "@mantine/core";
import { getFullFriendlyDate } from "src/functions/dates";
import UpdateButton from "@features/ui/UpdateButton";
import { useNavigate } from "react-router-dom";
import DeleteButton from "@features/ui/DeleteButton";
import { modals } from "@mantine/modals";
import DeleteTemplate from "./forms-template-delete.component";
import { useDisclosure } from "@mantine/hooks";

export default function FormTemplateList() {
    const termTemplates = useTemplates();
    const filter = useQuery();
    const dispatch = useClassDispatch();
    const navigate = useNavigate();
    const [isOpen, { close, open }] = useDisclosure();
    const [showEliminar, setShowEliminar] = useState(false);
    const [idTemplate, setIdTemplate] = useState(-1);
    const [loading, setLoading] = useState(true);
    const onError = () => {
        alert("algo a salido mal");
    }
    if (!termTemplates || !dispatch)
        throw new Error("FormTemplateTable should be defined as children of TermTemplatesProvider")
    const { items } = termTemplates;
    const onSuccess = ({ data, status }: ResponseClassflow<FormTemplateListItem[]>) => {
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
    const getTemplates = async () => {
        let url = "/form-templates";
        let get = new ClassflowGetService<null, FormTemplateListItem[], string>(url, {});
        get.onSend = onSend;
        get.onError = onError;
        get.onSuccess = onSuccess;
        get.onFinally = onFinally;
        await classflowAPI.exec(get);
    }
    const handleDelete = (id: number) => {
        setIdTemplate(id);
    }
    useEffect(() => {
        console.log({ classes: termTemplates });
        if (termTemplates.items === null) {
            getTemplates();
        }
    }, [termTemplates.items])
    useEffect(() => {
        if (idTemplate !== -1)
            open();
    }, [idTemplate])
    if (loading || termTemplates.items === null) {
        return <Text>Loading...</Text>
    }
    const rows = termTemplates.items.map((element) => (
        <Table.Tr key={element.name}>
            <Table.Td>{element.name}</Table.Td>
            <Table.Td>{getFullFriendlyDate(element.createdAt)}</Table.Td>
            <Table.Td>{getFullFriendlyDate(element.updatedAt)}</Table.Td>
            <Table.Td>
                <Group>
                    <UpdateButton onClick={() => navigate(`editar/${element.id}`)} />
                    <DeleteButton onClick={() => handleDelete(element.id as number)} />
                </Group>
            </Table.Td>
        </Table.Tr>
    ));
    return <>


        <DeleteTemplate opened={isOpen} close={close} id={idTemplate} onClose={() => {
            close();
            setIdTemplate(-1);
        }} />

        <Table>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Nombre</Table.Th>
                    <Table.Th>Creado</Table.Th>
                    <Table.Th>Actualizado</Table.Th>
                    <Table.Th>Actions</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    </>
}