import { Button, Container, NativeSelect, PasswordInput, Select, Stack, TextInput } from "@mantine/core";
import { SignupFormProvider, SignupFormValues, useSignupForm } from "./signup-form.context";
import { executeValidations } from "@validations/exec-validations.validator";
import { validateEmailPattern, validatePasswordPattern } from "@validations/login";
import { isRequired, matchValues, minLength } from "@validations/basic";
import { ClassflowPostService, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import { ROLES, useAuth } from "@features/auth/auth-context";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";


const userOptions = {
    [ROLES.STUDENT]: "Estudiante",
    [ROLES.PROFESSOR]: "Profesor"
}

export default function LoginForm() {
    const navigate = useNavigate();
    const [searchParams, setSearhParams] = useSearchParams();
    const userData = useAuth();
    const [loading, setLoading] = useState(false);
    const form = useSignupForm({
        initialValues: {
            email: "",
            password: "",
            lastname: "",
            name: "",
            role: "",
            repeatPassword: ""
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
                    validator: (value) => matchValues(value, values.repeatPassword),
                    message: "Las contraseñas no coinciden"
                },
                {
                    validator: isRequired,
                    message: "Campo requerido"
                },
                {
                    validator: validatePasswordPattern,
                    message: "La contraseña tiene que tener por lo menos una mayúscula"
                }
            ]),
            repeatPassword: (value, values, path) => executeValidations<string|undefined>(value, [
                {
                    validator: (value) => matchValues(value, values.password),
                    message: "Las contraseñas no coinciden"
                },
                {
                    validator: isRequired,
                    message: "Campo requerido"
                },
                {
                    validator: validatePasswordPattern,
                    message: "La contraseña tiene que tener por lo menos una mayúscula"
                }
            ]),
            lastname: (value, values, path) => executeValidations<string | undefined>(value, [
                {
                    validator: isRequired,
                    message: "Campo requerido"
                },
            ]),
            name: (value, values, path) => executeValidations<string | undefined>(value, [
                {
                    validator: isRequired,
                    message: "Campo requerido"
                },
            ]),
            role: (value, values, path) => executeValidations<string | undefined>(value, [
                {
                    validator: isRequired,
                    message: "Campo requerido"
                },
            ])
        }
    })

    const onError = () => { }
    const onSuccess = (data: ResponseClassflow<string>) => {
        console.log("TOKEN", data);
        navigate("/login");
    }
    useEffect(() => {
        console.log({ userData });
    }, [userData])
    const onSend = () => { setLoading(true) }
    const onFinally = () => { setLoading(false) }
    const handleSubmit = async (values: SignupFormValues) => {
        console.log("Handle");
        let { repeatPassword, ...body } = values;
        let get = new ClassflowPostService<SignupFormValues, string, string>("/users/create", {}, body);
        // let res = await axios.post("http://127.0.0.1:8000/authorization",values);
        get.onSend = onSend;
        get.onError = onError;
        get.onSuccess = onSuccess;
        get.onFinally = onFinally;
        await classflowAPI.exec(get);
    }
    return <SignupFormProvider form={form}>
        <Container size="responsive">
            <form onSubmit={form.onSubmit(handleSubmit, (errors) => console.log(errors))}>
                <Stack>
                    <TextInput
                        label="Correo"
                        placeholder="Correo"
                        {...form.getInputProps("email")}
                    />
                    <TextInput
                        label="Nombre"
                        placeholder="Nombre"
                        {...form.getInputProps("name")}
                    />
                    <TextInput
                        label="Apellidos"
                        placeholder="Apellidos"
                        {...form.getInputProps("lastname")}
                    />
                    <Select label="¿Qué eres?" {...form.getInputProps("role")} data={[{
                        value: ROLES.PROFESSOR,
                        label: "Profesor"
                    }, {
                        value: ROLES.STUDENT,
                        label: "Estudiante"
                    }]} />
                    <PasswordInput
                        label="Contraseña"
                        placeholder="Contraseña"
                        {...form.getInputProps("password")}
                    />
                    <PasswordInput
                        label="Repetir contraseña"
                        placeholder="Repetir contraseña"
                        {...form.getInputProps("repeatPassword")}
                    />
                    <Button type="submit" disabled={loading}>Registrarse</Button>
                </Stack>
            </form>
        </Container>
    </SignupFormProvider >

}