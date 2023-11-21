import { Button, Checkbox, InputLabel, NumberInput, Radio, ScrollArea, Stack, Text, TextInput } from "@mantine/core";
import { AssignmentCreateFormProvider, AssingmentCreateBody, useAssignmentCreateBodyFormContext, useFormCreateAssignment } from "./assignment-create-form.context";
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
import * as dayjs from "dayjs"
import { DateTimePicker } from "@mantine/dates"
import { AutcompleteGroupsAssignment } from "@features/ui/autocomplete-groups.component";
import { AutocompleteTerms, AutocompleteTermsAssignment } from "@features/ui/autocomplete-term.component";
import { AutocompleteTermCategoryAssignment } from "@features/ui/autocomplete-termCategory.component";
import FileListItems, { FileItem } from "./assignment-file-list.component";
export default function CreateAssignmentDetails() {
    const navigate = useNavigate();
    const { noticeId } = useParams();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [fileList, setFileList] = useState<FileItem[]>([]);
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({ types: ["heading", "paragraph"] })
        ],
        editable: !loading
    });
    const form = useAssignmentCreateBodyFormContext()
    useEffect(() => {
        if (noticeId && editor) {
            fetchData();
            return;
        }
    }, [editor])

    const onError = () => { }
    const onSuccess = ({ data: { data } }: ResponseClassflow<AssingmentCreateBody>) => {
        form.setFieldValue("title", data.name)
        if (data.description)
            editor?.commands.setContent(data.description)
    }
    const onSend = () => { setLoadingData(true) }
    const onFinally = () => { setLoadingData(false) }
    const fetchData = async () => {
        let get = new ClassflowGetService<{}, AssingmentCreateBody, string>(`/notices/${noticeId}`, {});
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
        let body = { ...form.values, id: Number(form.values.id), description: JSON.stringify(editor?.getJSON()) }
        let url = "";
        if (noticeId)
            url = "/notices/edit"
        else
            url = "/notices/create";
        let post = new ClassflowPostService<AssingmentCreateBody, string, string>(url, {}, body);
        post.onSend = onSend;
        post.onError = onError;
        post.onSuccess = onSuccess;
        post.onFinally = onFinally;
        await classflowAPI.exec(post);
    }
    if (loadingData) {
        return <Text>Loading...</Text>
    }
    return <Stack>
        <TextInput
            withAsterisk
            placeholder="Título de la tarea"
            {...form.getInputProps("name")} />
        <DateTimePicker
            valueFormat="DD MMM YYYY hh:mm A"
            label="Fecha de entrega"
            placeholder={dayjs().format("DD MMM YYYY hh:mm A")}
            dropdownType="modal"
            minDate={new Date()}
            {...form.getInputProps("dueAt")}
        />
        <Checkbox
            label="Permitir entrega tardía"
            {...form.getInputProps("lateDelivery")} />
        <NumberInput
            label="Penalización entrega tardía (%)"
            max={100}
            clampBehavior="strict"
            min={0}
            disabled={!form.values.lateDelivery}
            hideControls

            {...form.getInputProps("latePenalty")} />
        <AutcompleteGroupsAssignment selectedList={[]} onSelect={(s) => { form.setFieldValue("groupId", s.id) }} />
        <AutocompleteTermsAssignment selectedList={[]} onSelect={(s) => { form.setFieldValue("termId", s.id) }} />
        <AutocompleteTermCategoryAssignment disabled={form.values.termId == -1} termId={form.values.termId} selectedList={[]} onSelect={(s) => { form.setFieldValue("categoryId", s.id) }} />
        <InputLabel>Descripción</InputLabel>
        <RichTextEditor editor={editor}>
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
            <RichTextEditor.Content />
        </RichTextEditor>
        <FileListItems list={fileList} setList={setFileList} />
    </Stack>



}