import { Button, Container, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import { ClassflowGetService, ClassflowPostService, ErrorClassflow, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";


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
export default function VerifyEmailCard() {
    const [searchParams, setSearhParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [state, setState] = useState<number>(0);
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
    useEffect(() => {
        let get = new ClassflowGetService<string, string, string>(`/users/validate/${searchParams.get("token")}`, {});
        get.onError = onError;
        get.onSuccess = onSuccess;
        get.onFinally = onFinally;
        classflowAPI.exec(get);
    })
    if (loading) {
        return <Text>Cargando...</Text>
    }

    return <Container size="responsive">

        <Stack>
            {
                showError(state)
            }
        </Stack>

    </Container>

}