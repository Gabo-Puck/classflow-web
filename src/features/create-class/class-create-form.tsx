import { TermTemplateFormProvider, useFormTerms } from "@features/terms-template/terms-template-form.context";
import { ClassCreateBody, ClassCreateFormProvider, useFormCreateClass } from "./class-create-form.context";
import CreateTermDetails from "@features/terms-template/terms-template-create-details-form.component";
import CatalogTitle from "@features/ui/CatalogTitle";
import { TextInput } from "@mantine/core";
import { ClassflowPostService, ErrorClassflow, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";

export default function ClassCreateForm() {
    const form = useFormCreateClass({ id: undefined });
    const formTerms = useFormTerms({ id: undefined, skipTitle: true })
    const navigate = useNavigate();
    async function create() {
        const onError = (data: ErrorClassflow<string>) => {
            notifications.show({
                color: "orange",
                message: data.response?.data.message
            })
            form.setFieldError("name", data.response?.data.message)
        }
        const onSuccess = ({ data: { data } }: ResponseClassflow<ClassCreateBody>) => {
            navigate(`/app/clase/${data.id}/anuncios`);
        }

        let classDetails = form.values;
        let classTerms = formTerms.getTransformedValues();
        let body = {
            ...classDetails,
            terms: classTerms.termDetails.map((t) => (
                {
                    ...t,
                    termCategories: t.termTemplateDetailsCategories,
                    termTemplateDetailsCategories: undefined
                }
            ))
        }
        let url = "/classes/create";
        let post = new ClassflowPostService<ClassCreateBody, ClassCreateBody, string>(url, {}, body);
        post.onError = onError;
        post.onSuccess = onSuccess;
        await classflowAPI.exec(post);
    }
    const handleSave = async () => {
        await create();
    }
    return <>
        <ClassCreateFormProvider form={form}>
            <TermTemplateFormProvider form={formTerms}>
                <CreateTermDetails onSave={handleSave} hasErrors={() => form.validate().hasErrors}>
                    <CatalogTitle title="Crear clase" />
                    <TextInput
                        label="Nombre clase"
                        withAsterisk
                        {...form.getInputProps("name")} />
                    <TextInput
                        label="Descripción"
                        withAsterisk
                        {...form.getInputProps("description")} />
                </CreateTermDetails>
            </TermTemplateFormProvider>
        </ClassCreateFormProvider>
    </>
}