import { Button, Grid, LoadingOverlay, Modal, Text, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ROLES, useRole } from "@features/auth/auth-context";
import { ContextModalProps, modals } from "@mantine/modals";
import SelectModal from "./assignment-select-modal.component";
import { FormTemplateBody, FormTemplateFormProvider, useFormTemplate, useFormTemplateForm, useFormTemplateFormContext } from "@features/forms-template/forms-template-form.context";
import CreateFormDetails from "@features/forms-template/forms-template-create-details-form.component";
import CatalogTitle from "@features/ui/CatalogTitle";
import React, { SetStateAction, useState } from "react";
import { notifications } from "@mantine/notifications";
import { ClassflowGetService, ErrorClassflow, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";


export interface ButtonAddFormProps {
    enableForm: boolean;
    setEnableForm: React.Dispatch<SetStateAction<boolean>>
}

export function ButtonAddForm({ enableForm, setEnableForm }: ButtonAddFormProps) {
    const role = useRole();
    const form = useFormTemplateFormContext();
    const [loading, setLoading] = useState<boolean>(false);
    const handleSelect = async (id?: number) => {
        if (!id) {
            setEnableForm(true);
            form.reset();
            return;
        }
        try {
            setLoading(true);
            const onError = (data: ErrorClassflow<string>) => {
                notifications.show({
                    color: "orange",
                    message: data.response?.data.message
                })
                form.setFieldError("name", data.response?.data.message)
            }
            const onSuccess = ({ data: { data } }: ResponseClassflow<FormTemplateBody>) => {
                form.setValues(data);
                setEnableForm(true);
            }
            let url = `/form-templates/${id}`;
            let post = new ClassflowGetService<string, FormTemplateBody, string>(url, {});
            post.onError = onError;
            post.onSuccess = onSuccess;
            await classflowAPI.exec(post);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }

    }
    const open = () => {
        modals.open({
            modalId: "options-modal",
            title: "Crear clase",
            children: <SelectModal onSelect={handleSelect} />,
            style: {
                display: "flex",
                flexDirection: "column"
            },
            styles: {
                content: {
                    display: "flex",
                    flexDirection: "column"
                }
            }
        })
    }
    const deleteForm = () => {
        form.reset();
        setEnableForm(false);
    }


    return <>
        <Button onClick={open}>{form.values.id ? "Cambiar formulario" : "Añadir formulario"}</Button>
        <LoadingOverlay overlayProps={{
            radius: "sm",
            blur: 2
        }} visible={loading} c="grape" />
        {enableForm && <>
            <FormTemplateFormProvider form={form}>
                <Button onClick={deleteForm}>Borrar formulario</Button>

                <CreateFormDetails delegateSave={true} onSave={() => { }}>
                    <CatalogTitle title="Formulario" />
                    <TextInput
                        label="Nombre formulario"
                        withAsterisk
                        {...form.getInputProps("name")} />
                </CreateFormDetails>

            </FormTemplateFormProvider>
        </>
        }
    </>
}