import { Button, Container, NativeSelect, PasswordInput, ScrollArea, Select, Stack, Text, TextInput } from "@mantine/core";
import { NoticeFormProvider, NoticeFormValues, useNoticeForm } from "./notices-create-form.context";
import { executeValidations } from "@validations/exec-validations.validator";
import { validateEmailPattern, validatePasswordPattern } from "@validations/login";
import { isRequired, matchValues, maxLength, minLength } from "@validations/basic";
import { ClassflowGetService, ClassflowPostService, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import { ROLES, useAuth } from "@features/auth/auth-context";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { JSONContent, useEditor } from "@tiptap/react";
import StarterKit from '@tiptap/starter-kit';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { TextAlign } from '@tiptap/extension-text-align';
import { notifications } from "@mantine/notifications";

export default function NoticeForm() {
    const navigate = useNavigate();
    const { noticeId } = useParams();
    const userData = useAuth();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [content, setContent] = useState<JSONContent[] | null>(null);
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({ types: ["heading", "paragraph"] })
        ],
        editable: !loading
    });
    const form = useNoticeForm({
        initialValues: {
            id: noticeId ? Number(noticeId) : undefined,
            title: "",
            content: null
        },
        validate: {
            title: (value, values, path) => executeValidations<string | undefined>(value, [
                {
                    validator: isRequired,
                    message: "Campo requerido"
                },
                {
                    validator: (value) => maxLength(value as string, 50),
                    message: "El correo tiene que estar en formato nombre@dominio"
                }
            ]),
        }
    })

    useEffect(() => {
        if (noticeId && editor) {
            fetchData();
            return;
        }
    }, [editor])

    const onError = () => { }
    const onSuccess = ({ data: { data } }: ResponseClassflow<NoticeFormValues>) => {

        form.setFieldValue("title", data.title)
        setContent(data.content);
        if (data.content)
            editor?.commands.setContent(data.content)
    }
    const onSend = () => { setLoadingData(true) }
    const onFinally = () => { setLoadingData(false) }
    const fetchData = async () => {
        let get = new ClassflowGetService<{}, NoticeFormValues, string>(`/notices/${noticeId}`, {});
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
            navigate("../../");
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
        if (noticeId)
            url = "/notices/edit"
        else
            url = "/notices/create";
        let post = new ClassflowPostService<{
            title: string,
            content: string,

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
    return <NoticeFormProvider form={form}>

        <form onSubmit={form.onSubmit(handleSubmit, (errors) => console.log(errors))}>
            <Stack>
                <TextInput
                    label="Titulo"
                    placeholder="El titulo del aviso"
                    {...form.getInputProps("title")}
                />
                <RichTextEditor editor={editor} style={{
                    maxHeight: "90vh"
                }}>
                    <RichTextEditor.Toolbar sticky stickyOffset={1}>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Bold />
                            <RichTextEditor.Italic />
                            <RichTextEditor.Underline />
                            <RichTextEditor.Strikethrough />
                            <RichTextEditor.ClearFormatting />
                            <RichTextEditor.Highlight />
                            <RichTextEditor.Code />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.H1 />
                            <RichTextEditor.H2 />
                            <RichTextEditor.H3 />
                            <RichTextEditor.H4 />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Blockquote />
                            <RichTextEditor.Hr />
                            <RichTextEditor.BulletList />
                            <RichTextEditor.OrderedList />
                            <RichTextEditor.Subscript />
                            <RichTextEditor.Superscript />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Link />
                            <RichTextEditor.Unlink />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.AlignLeft />
                            <RichTextEditor.AlignCenter />
                            <RichTextEditor.AlignJustify />
                            <RichTextEditor.AlignRight />
                        </RichTextEditor.ControlsGroup>
                    </RichTextEditor.Toolbar>
                    <ScrollArea.Autosize>
                        <RichTextEditor.Content />

                    </ScrollArea.Autosize>
                </RichTextEditor>
                <div style={{
                    alignSelf: "end"
                }}>
                    <Button onClick={handleSubmit} loading={loading}>Guardar</Button>
                </div>
            </Stack>
        </form>
    </NoticeFormProvider >

}