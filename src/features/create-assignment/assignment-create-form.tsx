import { TermTemplateFormProvider, useFormTerms } from "@features/terms-template/terms-template-form.context";
import { AssingmentCreateBody, AssignmentCreateFormProvider, useFormCreateAssignment } from "./assignment-create-form.context";
import CreateTermDetails from "@features/terms-template/terms-template-create-details-form.component";
import CatalogTitle from "@features/ui/CatalogTitle";
import { Button, ScrollArea, Stack, Tabs, Text, TextInput } from "@mantine/core";
import { ClassflowPostService, ErrorClassflow, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import CreateAssignmentDetails from "./assignment-create-details.component";
import AssignmentAddForm from "./assignment-add-form.component";
import { useState } from "react";
import { FormTemplateFormProvider, useFormTemplate } from "@features/forms-template/forms-template-form.context";
import { modals } from "@mantine/modals";

export default function AssignmentCreateForm() {
    const form = useFormCreateAssignment({ id: undefined });
    const formCreate = useFormTemplate({ id: undefined, skipTitle: true })
    const [enableForm, setEnableForm] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
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
            navigate(`/app/clase/${data.id}/anuncios`);
        }
        const onSend = () => {
            setLoading(true);
        }
        const onFinally = () => {
            setLoading(false);
        }
        let classDetails = form.values;
        let errorsAssignment = form.validate();
        let errorsForm = {
            hasErrors: false
        }
        if (enableForm) {
            errorsForm = formCreate.validate();
        }
        console.log({ errorsAssignment, errorsForm, f: form.values });
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

        let formData = formCreate.getTransformedValues();
        let body: AssingmentCreateBody = {
            ...classDetails,
            form: enableForm ? { ...formData } : undefined
            // terms: classTerms.termDetails.map((t) => (
            //     {
            //         ...t,
            //         termCategories: t.termTemplateDetailsCategories,
            //         termTemplateDetailsCategories: undefined
            //     }
            // ))
        }

        let url = "/assignment/create";
        let post = new ClassflowPostService<AssingmentCreateBody, AssingmentCreateBody, string>(url, {}, body);
        post.onError = onError;
        post.onSuccess = onSuccess;
        post.onSend = onSend;
        post.onFinally = onFinally;
        await classflowAPI.exec(post);
    }
    const handleSave = async () => {
        await create();
    }
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
                        <CreateAssignmentDetails />
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