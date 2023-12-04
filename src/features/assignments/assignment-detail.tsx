import { ROLES, useAuth } from "@features/auth/auth-context";
import TextAlign from "@tiptap/extension-text-align";
import { JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { ClassflowDeleteService, ClassflowGetService, ErrorClassflow, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import { ActionIcon, Group, LoadingOverlay, ScrollArea, Stack, Text, Title, Tooltip } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import Loading from "@features/ui/Loading";
import UpdateButton from "@features/ui/UpdateButton";
import DeleteButton from "@features/ui/DeleteButton";
import { AssigmentCreate } from "@features/create-assignment/assignment-create-form.context";
import { useAssignmentDetail, useAssignmentDetailDispatch } from "./assignment-details.context";
import { FileListItemsOperation, FileListItemsView } from "@features/ui/file-item-list";
export default function AssignmentDetails() {
    const navigate = useNavigate();
    const { AssignmentId } = useParams();
    const userData = useAuth();
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const assignmentState = useAssignmentDetail();
    const dispatch = useAssignmentDetailDispatch();
    console.log({ dispatch, assignmentState });
    if (!dispatch || assignmentState === undefined)
        throw new Error("AssignmentDetails should be defined as children of AssignmentProvider")
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({ types: ["heading", "paragraph"] })
        ],
        editable: false,
    });

    useEffect(() => {
        if (AssignmentId && editor) {
            fetchData();
            return;
        }
    }, [editor])

    useEffect(() => {
        console.log({ assignmentState });
    }, [assignmentState])
    const fetchData = async () => {
        const onError = () => { }
        const onSuccess = ({ data: { data } }: ResponseClassflow<AssigmentCreate>) => {
            // setAssignment(data);
            dispatch({
                type: "set",
                payload: data
            })
            if (data.description)
                editor?.commands.setContent(data.description)
        }
        const onSend = () => { setLoadingData(true) }
        const onFinally = () => { setLoadingData(false) }
        let get = new ClassflowGetService<{}, AssigmentCreate, string>(`/assignment/${AssignmentId}`, {});
        get.onSend = onSend;
        get.onError = onError;
        get.onSuccess = onSuccess;
        get.onFinally = onFinally;
        await classflowAPI.exec(get);
    }
    const deleteNotice = async () => {
        const onError = (error: ErrorClassflow<string>) => {
            notifications.show({
                message: error.response?.data.message,
                color: "orange"
            })
        }
        const onSuccess = ({ data: { data } }: ResponseClassflow<AssigmentCreate>) => {
            modals.closeAll()
            modals.openConfirmModal({
                title: "Borrar anuncio",
                children: <>
                    <Text>Se ha borrado tu anuncio correctamente</Text>
                </>,
                labels: {
                    confirm: "Ok",
                    cancel: "No"
                },
                onConfirm: () => {
                    modals.closeAll();
                    navigate("../")
                },
                confirmProps: {
                    loading: loadingDelete
                },
                cancelProps: {
                    display: "none"
                },
                closeOnConfirm: false,
                closeOnClickOutside: false,
                withCloseButton: false,
                closeOnCancel: false
            })
        }
        const onSend = () => { setLoadingDelete(true) }
        const onFinally = () => { setLoadingDelete(false) }
        let del = new ClassflowDeleteService<{}, AssigmentCreate, string>(`/notices/${AssignmentId}`, {});
        del.onSend = onSend;
        del.onError = onError;
        del.onSuccess = onSuccess;
        del.onFinally = onFinally;
        await classflowAPI.exec(del);
    }
    const handleDelete = () => {
        modals.openConfirmModal({
            title: "Borrar tarea",
            children: <>
                <Text>Borrar una tarea es una acción sin retorno. ¿Estas seguro?</Text>
            </>,

            labels: {
                confirm: "Si",
                cancel: "No"
            },
            onConfirm: () => {
                setLoadingDelete(true)
                deleteNotice();
            },
            closeOnConfirm: false
        })
    }
    if (loadingData || !assignmentState) {
        return <Text>Loading...</Text>
    }

    const { assignment } = assignmentState;
    console.log({ D: assignment });
    return <Stack>
        <Loading visible={loadingDelete} />
        {/* ...other content */}
        <Group justify="space-between">
            <Title order={2}>{assignment?.title}</Title>
            <Group>
                {userData?.role === ROLES.PROFESSOR && <>
                    <UpdateButton onClick={() => navigate(`../editar/${AssignmentId}`)} />
                    <DeleteButton onClick={handleDelete} />
                </>
                }
            </Group>
        </Group>
        <RichTextEditor editor={editor}>
            <RichTextEditor.Content />
        </RichTextEditor>
        {
            assignment?.AssignmentFile !== undefined
                ?
                <FileListItemsView list={assignment?.AssignmentFile} /> :
                <>x</>
        }

    </Stack >
}