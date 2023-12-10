import { Button, Container, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { ClassflowGetService, ClassflowPostService, ErrorClassflow, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import { isRequired, matchValues } from "@validations/basic";
import { executeValidations, validatePasswordPattern } from "@validations/index";
import { useEffect, useState } from "react";
import { useNavigate, useNavigation, useParams, useSearchParams } from "react-router-dom";


const showError = (state: number) => {
    console.log({ state });
    if (state === 200) {
        return <Text>Se ha validado tu correo</Text>
    }
    if (state === 401) {
        return <Text>Codigo caducado</Text>
    }
    if (state === 400) {
        return <Text>Codigo invalido</Text>
    }
    return <Text>Ha ocurrido un error</Text>
}
export default function ChangePassword() {
    const [searchParams, setSearhParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [state, setState] = useState<number>(0);
    const navigate = useNavigate()
    const form = useForm({
        initialValues: {
            password: "",
            repeatPassword: ""
        },
        validate: {
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
                    message: "La contraseña tiene que tener por lo menos una mayúscula, un número y 8 caracteres"
                }
            ]),
            repeatPassword: (value, values, path) => executeValidations<string | undefined>(value, [
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
                    message: "La contraseña tiene que tener por lo menos una mayúscula, un número y 8 caracteres"
                }
            ]),
        }
    })

    const handleSubmit = async (values: { password: string, repeatPassword: string }) => {
        const onError = () => { }
        const onSuccess = (data: ResponseClassflow<string>) => {
            console.log("TOKEN", data);
            navigate("/login");
        }
        const onSend = () => { setLoading(true) }
        const onFinally = () => { setLoading(false) }
        console.log("Handle");
        let { repeatPassword, ...body } = values;
        let get = new ClassflowPostService<{ password: string, token: string }, string, string>("/users/recover", {}, {
            password: body.password,
            token: searchParams.get("token") || ""
        });
        // let res = await axios.post("http://127.0.0.1:8000/authorization",values);
        get.onSend = onSend;
        get.onError = onError;
        get.onSuccess = onSuccess;
        get.onFinally = onFinally;
        await classflowAPI.exec(get);
    }
    useEffect(() => {
        const onError = (data: ErrorClassflow<string>) => {
            //401 token caducado
            //400 token invalido
            setState(data.response?.status || 0);
        }
        const onSuccess = (data: ResponseClassflow<string>) => {
            console.log("SUCCESS", data);
            //status = 200
            setState(data.status);
        }
        const onFinally = () => {
            setLoading(false);
        }
        let get = new ClassflowGetService<string, string, string>(`/users/validate-password/${searchParams.get("token")}`, {});
        get.onError = onError;
        get.onSuccess = onSuccess;
        get.onFinally = onFinally;
        classflowAPI.exec(get);
    }, [])
    if (loading) {
        return <Text>Cargando...</Text>
    }

    if (state !== 200) {
        return <Stack>
            {
                showError(state)
            }
        </Stack>
    }

    return <Container size="responsive">
        <Stack>
            <form onSubmit={form.onSubmit(handleSubmit, (errors) => console.log(errors))}>
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
                <Button type="submit" disabled={loading}>Cambiar contraseña</Button>
            </form>
        </Stack>

    </Container>

}