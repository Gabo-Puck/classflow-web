import { Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { ClassflowPostService, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import { isRequired } from "@validations/basic";
import { executeValidations, validateEmailPattern } from "@validations/index";
import { useState } from "react";

interface SendChangePasswordProps {
    onCorrect: VoidFunction;
}

export default function SendChangePassword({ onCorrect }: SendChangePasswordProps) {
    const [loading, setLoading] = useState(false);
    const form = useForm({
        initialValues: {
            email: ""
        },
        validate: {
            email: (value, values, path) => executeValidations<string | undefined>(value, [
                {
                    validator: isRequired,
                    message: "Campo requerido"
                },
                {
                    validator: validateEmailPattern,
                    message: "El correo tiene que estar en formato nombre@dominio"
                }
            ])
        }
    })

    const onError = () => { }
    const onSuccess = (data: ResponseClassflow<string>) => {
        notifications.show({
            title:"Solicitud procesada correctamente",
            message:"En unos momentos recibirás un correo para poder cambiar tu contraseña"
        })
        onCorrect();
    }
    const onSend = () => { setLoading(true) }
    const onFinally = () => { setLoading(false) }
    const handleSubmit = async (values: { email: string }) => {
        console.log("Handle");
        let body = values
        let get = new ClassflowPostService<{ email: string }, string, string>("/authorization/sendPasswordChange", {}, body);
        get.onSend = onSend;
        get.onError = onError;
        get.onSuccess = onSuccess;
        get.onFinally = onFinally;
        await classflowAPI.exec(get);
    }

    return <>
        <form onSubmit={form.onSubmit(handleSubmit, (errors) => console.log(errors))}>
            <TextInput
                label="Correo"
                placeholder="Correo"
                {...form.getInputProps("email")}
            />
            <Button type="submit" disabled={loading}>Enviar</Button>
        </form>
    </>
}