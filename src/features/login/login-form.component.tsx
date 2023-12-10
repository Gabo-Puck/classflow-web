import { Anchor, Button, Container, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import { UserFormProvider, UserFormValues, useUserForm } from "./login-form.context";
import { executeValidations } from "@validations/exec-validations.validator";
import { validateEmailPattern, validatePasswordPattern } from "@validations/login";
import { isRequired, minLength } from "@validations/basic";
import { ClassflowPostService, ErrorClassflow, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import axios, { AxiosResponse } from "axios";
import { useAuth } from "@features/auth/auth-context";
import { useEffect, useState } from "react";
import { ErrorResponse, Link, useNavigate, useSearchParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import SendValidation from "./send-validation.component";
import { modals } from "@mantine/modals";
import SendChangePassword from "@features/change-password/change-password-send-form.component";


export default function LoginForm() {
    const navigate = useNavigate();
    const [searchParams, setSearhParams] = useSearchParams();
    const [showValidateEmail, setShowValidateEmail] = useState(false);
    
    const form = useUserForm({
        initialValues: {
            email: "",
            password: ""
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
            ]),
            password: (value, values, path) => executeValidations<string>(value, [
                {
                    validator: isRequired,
                    message: "Campo requerido"
                },
                {
                    validator: validatePasswordPattern,
                    message: "La contraseña tiene que tener por lo menos una mayúscula"
                },
            ])
        }
    })

    const onError = (data: ErrorClassflow<string>) => {
        if (data.response?.status == 405) {
            setShowValidateEmail(true);
            return
        }
        notifications.show({
            message: data.response?.data.message,
            title: "Atención",

        })
    }
    const onSuccess = (data: ResponseClassflow<string>) => {
        console.log("TOKEN", data);
        let redirect = searchParams.get("redirect");
        if (redirect)
            navigate(redirect);
        else
            navigate("/app/tablero");
    }
    const onSend = () => { }
    const onFinally = () => { }
    const handleSubmit = async (values: UserFormValues) => {
        let get = new ClassflowPostService<UserFormValues, string, string>("/authorization", {}, values);
        // let res = await axios.post("http://127.0.0.1:8000/authorization",values);
        get.onSend = onSend;
        get.onError = onError;
        get.onSuccess = onSuccess;
        get.onFinally = onFinally;
        await classflowAPI.exec(get);
    }
    const openModal = () => {
        modals.open({
            title:"Cambiar contraseña",
            children: <SendChangePassword onCorrect={()=>modals.closeAll()}/> 
        })
    }

    return <UserFormProvider form={form}>
        <Container size="responsive">
            {
                !showValidateEmail ?
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <Stack>
                            <TextInput
                                label="Correo"
                                placeholder="Correo"
                                {...form.getInputProps("email")}
                            />
                            <PasswordInput
                                label="Contraseña"
                                placeholder="Contraseña"
                                {...form.getInputProps("password")}
                            />
                            <Anchor onClick={openModal}>Cambiar contraseña</Anchor>
                            <Button type="submit">Entrar</Button>
                        </Stack>
                    </form> :
                    <SendValidation email={form.values["email"]} />
            }
        </Container>
    </UserFormProvider>

}