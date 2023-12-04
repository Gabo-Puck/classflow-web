import { Button, ScrollArea, Stack, Text, TextInput } from "@mantine/core";
import { GroupDetails, GroupFormProvider, GroupFormValues, useGroupForm } from "./group-create-form.context";
import { executeValidations } from "@validations/exec-validations.validator";
import { isRequired, maxLength } from "@validations/basic";
import { ClassflowGetService, ClassflowPostService, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEditor } from "@tiptap/react";
import StarterKit from '@tiptap/starter-kit';
import { RichTextEditor } from '@mantine/tiptap';
import { TextAlign } from '@tiptap/extension-text-align';
import { notifications } from "@mantine/notifications";
import CatalogTitle from "@features/ui/CatalogTitle";
import { OptionType, TransferList } from "@features/ui/transfer-list.component";


export default function GroupForm() {
    const navigate = useNavigate();
    const { noticeId: groupId } = useParams();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({ types: ["heading", "paragraph"] })
        ],
        editable: !loading
    });
    const form = useGroupForm({
        initialValues: {
            id: groupId ? Number(groupId) : undefined,
            name: "",
            GroupDetails: []
        },
        validate: {
            name: (value) => executeValidations<string | undefined>(value, [
                {
                    validator: isRequired,
                    message: "Campo requerido"
                }
            ]),
            GroupDetails: (value) => executeValidations<GroupDetails[]>(value, [
                {
                    validator: (value) => {
                        return value?.length <= 2
                    },
                    message: "Selecciona por lo menos 2 personas"

                }
            ])
        }
    })

    function DefaultItem({ item }: { item: OptionType }) {
        return <h1>{item.name}</h1>

    }

    useEffect(() => {
        if (groupId) {
            fetchData();
            return;
        }
    }, [])

    const onError = () => { }
    const onSuccess = ({ data: { data } }: ResponseClassflow<GroupFormValues>) => {
        form.setValues(data)
    }
    const onSend = () => { setLoadingData(true) }
    const onFinally = () => { setLoadingData(false) }
    const fetchData = async () => {
        let get = new ClassflowGetService<{}, GroupFormValues, string>(`/notices/${groupId}`, {});
        // let res = await axios.post("http://127.0.0.1:8000/authorization",values);
        get.onSend = onSend;
        get.onError = onError;
        get.onSuccess = onSuccess;
        get.onFinally = onFinally;
        await classflowAPI.exec(get);
    }
    const handleSubmit = async () => {
        const onError = () => { }
        const onSuccess = (data: ResponseClassflow<string>) => {
            console.log("TOKEN", data);
            navigate("../");
        }
        const onSend = () => { setLoading(true) }
        const onFinally = () => { setLoading(false) }
        let hasErrors = form.validate().hasErrors;
        if (editor?.isEmpty) {
            notifications.show({
                message: "Agrega contenido en el anuncio antes de guardarlo",
                color: "orange"
            })
            return;
        }
        if (hasErrors)
            return;
        let body = { ...form.values, id: Number(form.values.id), content: JSON.stringify(editor?.getJSON()) }
        let url = "";
        if (groupId)
            url = "/groups/edit"
        else
            url = "/groups/create";
        let post = new ClassflowPostService<{
            name: string,
            GroupDetails: GroupDetails[],
        }, string, string>(url, {}, body);
        post.onSend = onSend;
        post.onError = onError;
        post.onSuccess = onSuccess;
        post.onFinally = onFinally;
        await classflowAPI.exec(post);
    }
    if (loadingData) {
        return <Text>Loading...</Text>
    }
    return <GroupFormProvider form={form}>
        <form onSubmit={form.onSubmit(handleSubmit, (errors) => console.log(errors))}>
            <Stack>
                <CatalogTitle title={groupId ? "Editar equipo" : "Crear equipo"} />

                <TextInput
                    label="Nombre"
                    placeholder="Nombre del equipo"
                    {...form.getInputProps("name")}
                />
                <TransferList Item={DefaultItem} />
                <div style={{
                    alignSelf: "end"
                }}>
                    <Button onClick={handleSubmit} loading={loading}>Guardar</Button>
                </div>
            </Stack>
        </form>
    </GroupFormProvider >

}