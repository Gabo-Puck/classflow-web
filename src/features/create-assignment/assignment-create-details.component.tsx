import * as dayjs from "dayjs"
import { Alert, Checkbox, InputLabel, NumberInput, Stack, Text, TextInput } from "@mantine/core";
import { useAssignmentCreateBodyFormContext } from "./assignment-create-form.context";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEditor } from "@tiptap/react";
import StarterKit from '@tiptap/starter-kit';
import { RichTextEditor } from '@mantine/tiptap';
import { TextAlign } from '@tiptap/extension-text-align';
import { DateTimePicker } from "@mantine/dates"
import { AutcompleteGroupsAssignment } from "@features/ui/autocomplete-groups.component";
import { AutocompleteTermsAssignment } from "@features/ui/autocomplete-term.component";
import { AutocompleteTermCategoryAssignment } from "@features/ui/autocomplete-termCategory.component";
import { IconAlertCircle } from "@tabler/icons-react";
import { FileItem } from "@features/ui/file-item";
import { FileListItemsOperation } from "@features/ui/file-item-list";

interface CreateAssignmentDetailsProps {
    fileList: FileItem[];
    setFileList: React.Dispatch<React.SetStateAction<FileItem[]>>
}
export default function CreateAssignmentDetails({ fileList, setFileList }: CreateAssignmentDetailsProps) {
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({ types: ["heading", "paragraph"] })
        ],
        editable: !loading,
        onBlur: ({ editor }) => {
            if (!loading)
                form.setFieldValue("description", editor?.getJSON())
        }
    });
    const form = useAssignmentCreateBodyFormContext()

    if (loadingData) {
        return <Text>Loading...</Text>
    }

    useEffect(() => {
        console.log({ xsss: form.values.description });
        if (editor !== null)
            editor.commands.setContent(form.values.description)
    }, [editor, form.values.description])

    useEffect(() => {
        console.log({ fileList });
    }
        , [fileList])
    return <Stack>
        <TextInput
            withAsterisk
            placeholder="Título de la tarea"
            {...form.getInputProps("title")} />
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
        <AutcompleteGroupsAssignment
            textInputProps={{
                error: form.errors["groupId"]
            }}
            value={form.values.group?.name || ""}
            selectedList={[]}
            onSelect={(s) => { form.setFieldValue("groupId", s.id) }} />
        <AutocompleteTermsAssignment
            value={form.values.category?.termDetails.name || ""}
            textInputProps={{
                error: form.errors["termId"]
            }}
            selectedList={[]}
            onSelect={(s) => { form.setFieldValue("termId", s.id) }} />
        <AutocompleteTermCategoryAssignment
            value={form.values.category?.name || ""}
            textInputProps={{
                error: form.errors["categoryId"]
            }}
            disabled={form.values.termId == -1}
            termId={form.values.termId as number} selectedList={[]}
            onSelect={(s) => { form.setFieldValue("categoryId", s.id) }} />
        <InputLabel>Descripción</InputLabel>
        {form.errors["description"] && <Alert variant="light" color="orange.5" title="Atención" icon={<IconAlertCircle />}>
            {form.errors["description"]}
        </Alert>}
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
        <FileListItemsOperation list={fileList} setList={setFileList} />
    </Stack>



}