import { TermTemplateFormProvider, useFormTerms } from "@features/terms-template/terms-template-form.context";
import { AssingmentCreateBody, AssignmentCreateFormProvider, useFormCreateAssignment } from "./assignment-create-form.context";
import CreateTermDetails from "@features/terms-template/terms-template-create-details-form.component";
import CatalogTitle from "@features/ui/CatalogTitle";
import { Button, ScrollArea, Stack, Tabs, Text, TextInput } from "@mantine/core";
import { ClassflowGetService, ClassflowPostService, ClassflowPutService, ErrorClassflow, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import { notifications } from "@mantine/notifications";
import { useNavigate, useParams } from "react-router-dom";
import CreateAssignmentDetails from "./assignment-create-details.component";
import AssignmentAddForm from "./assignment-add-form.component";
import { useEffect, useState } from "react";
import { FormTemplateFormProvider, useFormTemplate } from "@features/forms-template/forms-template-form.context";
import { modals } from "@mantine/modals";
import { FileItem } from "./assignment-file-list.component";

//TODO: Fix delete files when are retrieved from backend
export default function AssignmentCreateForm() {
    const form = useFormCreateAssignment({ id: undefined });
    const formCreate = useFormTemplate({ id: undefined, skipTitle: true })
    const [enableForm, setEnableForm] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState<FileItem[]>([]);
    const { AssignmentId } = useParams()
    const { classId } = useParams()
    const navigate = useNavigate();

    async function create() {
        const onError = (data: ErrorClassflow<string>) => {
            notifications.show({
                color: "orange",
                message: data.response?.data.message
            })
            form.setFieldError("name", data.response?.data.message)
        }
        const onSuccess = ({ data: { data } }: ResponseClassflow<AssingmentCreateBody>) => {
            navigate(`/app/clase/${classId}/tareas`);
        }
        const onSend = () => {
            setLoading(true);
        }
        const onFinally = () => {
            setLoading(false);
        }
        let classDetails = form.getTransformedValues();
        let errorsAssignment = form.validate();
        let errorsForm = {
            hasErrors: false
        }
        if (enableForm) {
            errorsForm = formCreate.validate();
        }
        // console.log({ errorsAssignment, errorsForm, f: form.values });
        if (errorsForm.hasErrors || errorsAssignment.hasErrors) {
            modals.open({
                title: "Atención",
                children: <>
                    <Text>Hay errores en el formulario. Por favor verifica antes de enviar</Text>
                    {enableForm && <Text>Recuerda que los formularios deben tener por lo menos 2 preguntas</Text>}
                </>
            })
            return
        }

        let { id, ...formData } = formCreate.getTransformedValues();
        console.log({ formData });
        let body: AssingmentCreateBody = {
            ...classDetails,
            form: enableForm ? {
                ...formData,
                assignmentId: undefined
            } : undefined,
            AssignmentFile: fileList
        }

        let operation;
        if (AssignmentId) {
            let url = "/assignment/edit";
            operation = new ClassflowPutService<AssingmentCreateBody, AssingmentCreateBody, string>(url, {}, body)
        } else {
            let url = "/assignment/create";
            operation = new ClassflowPostService<AssingmentCreateBody, AssingmentCreateBody, string>(url, {}, body)
        }

        operation.onError = onError;
        operation.onSuccess = onSuccess;
        operation.onSend = onSend;
        operation.onFinally = onFinally;
        await classflowAPI.exec(operation);
    }

    async function fetch() {
        const onError = (data: ErrorClassflow<string>) => {
            notifications.show({
                color: "orange",
                message: data.response?.data.message
            })
            form.setFieldError("name", data.response?.data.message)
        }
        const onSuccess = ({ data: { data } }: ResponseClassflow<AssingmentCreateBody>) => {
            // navigate(`/app/clase/${data.id}/anuncios`);
            let { form: f, ...resto } = data;
            console.log({ data });
            form.setValues({
                ...resto,
                dueAt: new Date(resto.dueAt),
                termId: resto.category?.termDetails.id
            });
            setFileList(data.AssignmentFile)
            if (f) {
                formCreate.setValues(f);
                setEnableForm(true);
            }
            if (resto.description)
                form.values.description = resto.description
        }
        const onSend = () => {
            setLoading(true);
        }
        const onFinally = () => {
            setLoading(false);
        }

        let url = `/assignment/${AssignmentId}`;
        let post = new ClassflowGetService<AssingmentCreateBody, AssingmentCreateBody, string>(url, {});
        post.onError = onError;
        post.onSuccess = onSuccess;
        post.onSend = onSend;
        post.onFinally = onFinally;
        await classflowAPI.exec(post);
    }

    const handleSave = async () => {
        await create();
    }

    useEffect(() => {
        if (AssignmentId) { fetch(); return; }

    }, [])
    return <>
        <AssignmentCreateFormProvider form={form}>
            <FormTemplateFormProvider form={formCreate}>
                <Tabs defaultValue="first" >
                    <div style={{ flex: 0 }}>
                        <Tabs.List>
                            <Tabs.Tab value="first">Asignación</Tabs.Tab>
                            <Tabs.Tab value="second">Formulario</Tabs.Tab>
                        </Tabs.List>
                    </div>
                    <Tabs.Panel value="first">
                        <CreateAssignmentDetails fileList={fileList} setFileList={setFileList} />
                    </Tabs.Panel>
                    <Tabs.Panel value="second">
                        <AssignmentAddForm enableForm={enableForm} setEnableForm={setEnableForm} />
                    </Tabs.Panel>
                    <Button onClick={handleSave} loading={loading}>Guardar</Button>
                </Tabs>
            </FormTemplateFormProvider>
        </AssignmentCreateFormProvider>
    </>
}