import { useAuth } from "@features/auth/auth-context";
import TextAlign from "@tiptap/extension-text-align";
import { JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { NoticeFormValues, useNoticeForm } from "./notices-create-form.context";
import { ClassflowDeleteService, ClassflowGetService, ErrorClassflow, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import { ActionIcon, Group, LoadingOverlay, ScrollArea, Stack, Text, Tooltip } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { IconTrashFilled, IconPencil } from '@tabler/icons-react';
import NoticeForm from "./notices-create-form.component";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import Loading from "@features/ui/Loading";
import UpdateButton from "@features/ui/UpdateButton";
import DeleteButton from "@features/ui/DeleteButton";
import NoticesCommentsControl from "@features/notices-comments/notices-comment-control.component";
export default function NoticeDetail() {
    const navigate = useNavigate();
    const { noticeId } = useParams();
    const userData = useAuth();
    const [loading, setLoading] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [notice, setNotice] = useState<NoticeFormValues | null>();
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({ types: ["heading", "paragraph"] })
        ],
        editable: false,
    });

    useEffect(() => {
        if (noticeId && editor) {
            fetchData();
            return;
        }
    }, [editor])


    const fetchData = async () => {
        const onError = () => { }
        const onSuccess = ({ data: { data } }: ResponseClassflow<NoticeFormValues>) => {
            setNotice(data);
            if (data.content)
                editor?.commands.setContent(data.content)
        }
        const onSend = () => { setLoadingData(true) }
        const onFinally = () => { setLoadingData(false) }
        let get = new ClassflowGetService<{}, NoticeFormValues, string>(`/notices/${noticeId}`, {});
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
        const onSuccess = ({ data: { data } }: ResponseClassflow<NoticeFormValues>) => {
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
        let del = new ClassflowDeleteService<{}, NoticeFormValues, string>(`/notices/${noticeId}`, {});
        del.onSend = onSend;
        del.onError = onError;
        del.onSuccess = onSuccess;
        del.onFinally = onFinally;
        await classflowAPI.exec(del);
    }
    const handleDelete = () => {
        modals.openConfirmModal({
            title: "Borrar anuncio",
            children: <>
                <Text>Borrar un anuncio es una acción sin retorno. ¿Estas seguro?</Text>
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
    if (loadingData || !notice) {
        return <Text>Loading...</Text>
    }
    return <ScrollArea styles={{ root: { flex: 1 } }}>
        <Stack p="sm">
            <Loading visible={loadingDelete} />
            {/* ...other content */}
            <Group justify="space-between" style={{ flex: 10 }}>
                <h1>{notice?.title}</h1>
                <Group>
                    {userData?.id === notice?.creatorId && <>
                        <UpdateButton onClick={() => navigate(`../editar/${notice.id}`)} />
                        <DeleteButton onClick={handleDelete} />
                    </>
                    }
                </Group>
            </Group>
            <Stack>
                <RichTextEditor editor={editor}>
                    <ScrollArea.Autosize>
                        <RichTextEditor.Content />
                    </ScrollArea.Autosize>
                </RichTextEditor>
                <NoticesCommentsControl />

            </Stack>
        </Stack >
    </ScrollArea>
}