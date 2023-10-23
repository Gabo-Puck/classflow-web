import { Button, Container, PasswordInput, Stack, TextInput } from "@mantine/core";
import { UserFormProvider, UserFormValues, useUserForm } from "./login-form.context";
import { executeValidations } from "@validations/exec-validations.validator";
import { validateEmailPattern, validatePasswordPattern } from "@validations/login";
import { isRequired, minLength } from "@validations/basic";
import { ClassflowPostService, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import axios, { AxiosResponse } from "axios";
import { useAuth } from "@features/auth/auth-context";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function LoginForm() {
    const navigate = useNavigate();
    const [searchParams, setSearhParams] = useSearchParams();
    const userData = useAuth();
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

    const onError = () => { }
    const onSuccess = (data: ResponseClassflow<string>) => {
        console.log("TOKEN", data);
        let redirect = searchParams.get("redirect");
        if(redirect)
            navigate(redirect);
        else
            navigate("/app/panel");
    }
    useEffect(() => {
        console.log({ userData });
    }, [userData])
    const onSend = () => { }
    const onFinally = () => { }
    const handleSubmit = async (values: UserFormValues) => {
        console.log({ values });
        let get = new ClassflowPostService<UserFormValues, string, string>("/authorization", {}, values);
        // let res = await axios.post("http://127.0.0.1:8000/authorization",values);
        get.onSend = onSend;
        get.onError = onError;
        get.onSuccess = onSuccess;
        get.onFinally = onFinally;
        await classflowAPI.exec(get);
    }
    return <UserFormProvider form={form}>
        <Container size="responsive">
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
                    <Button type="submit">Entrar</Button>
                </Stack>
            </form>
        </Container>
    </UserFormProvider>

}