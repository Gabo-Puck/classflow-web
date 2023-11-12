
import { TermTemplate, TermTemplateBody, TermTemplateDetailsCategories, TermTemplateFormProvider, useFormTerms, useTermTemplateForm } from "./terms-template-form.context";
import CreateTermDetails from "./terms-template-create-details-form.component";
import { executeValidations } from "@validations/index";

import { getValueByProp } from "src/functions/general";
import { isRequired } from "@validations/basic";
import { LoadingOverlay, Stack, TextInput } from "@mantine/core";
import CatalogTitle from "@features/ui/CatalogTitle";
import { useNavigate, useParams } from "react-router-dom";
import { ClassflowGetService, ClassflowPostService, ClassflowPutService, ErrorClassflow, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";

export default function TermsTemplateForm({ }) {
    const { templateId } = useParams();
    const form = useFormTerms({ id: templateId !== undefined ? Number(templateId) : undefined });
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>();
    async function create() {
        const onError = (data: ErrorClassflow<string>) => {
            notifications.show({
                color: "orange",
                message: data.response?.data.message
            })
            form.setFieldError("name", data.response?.data.message)
        }
        const onSuccess = (data: ResponseClassflow<string>) => {
            console.log("TOKEN", data);
            navigate("../");
        }
        let url = "/term-templates/create";
        let post = new ClassflowPostService<TermTemplateBody, string, string>(url, {}, form.getTransformedValues());
        post.onError = onError;
        post.onSuccess = onSuccess;
        await classflowAPI.exec(post);
    }
    async function update() {
        const onError = () => { }
        const onSuccess = (data: ResponseClassflow<string>) => {
            console.log("TOKEN", data);
            navigate("../");
        }
        let url = "/term-templates/edit";
        let post = new ClassflowPutService<TermTemplateBody, string, string>(url, {}, form.getTransformedValues());
        post.onError = onError;
        post.onSuccess = onSuccess;
        await classflowAPI.exec(post);
    }
    const onSave = async () => {
        if (templateId) {
            await update();
        } else {
            await create();
        }
    }
    const fetch = async () => {
        try {
            setLoading(true);
            const onError = (data: ErrorClassflow<string>) => {
                notifications.show({
                    color: "orange",
                    message: data.response?.data.message
                })
                form.setFieldError("name", data.response?.data.message)
            }
            const onSuccess = ({ data: { data } }: ResponseClassflow<TermTemplateBody>) => {
                // form.setInitialValues({ ...form.values, ...data })
                form.setValues(data);
            }
            let url = `/term-templates/${templateId}`;
            let post = new ClassflowGetService<string, TermTemplateBody, string>(url, {});
            post.onError = onError;
            post.onSuccess = onSuccess;
            await classflowAPI.exec(post);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (templateId) {
            fetch();
        }
    }, [])
    return <>
        <LoadingOverlay overlayProps={{
            radius: "sm",
            blur: 2
        }} visible={loading} c="grape" />
        <TermTemplateFormProvider form={form}>
            <CreateTermDetails onSave={onSave}>
                <CatalogTitle title="Crear plantilla parcial" />
                <TextInput
                    label="Nombre plantilla"
                    withAsterisk
                    {...form.getInputProps("name")} />
            </CreateTermDetails>

        </TermTemplateFormProvider>
    </>
}