import { Button, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { ClassflowPostService, ErrorClassflow, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ISendEmail {
    email: string
}
export default function SendValidation(props: ISendEmail) {
    const [enabled, setEnabled] = useState(true)
    const onError = (data: ErrorClassflow<string>) => {
        if (data.response?.status == 400) {
            notifications.show({
                message: data.response?.data.message,
                title: "Atención",
    
            })
            setEnabled(false);
            return
        }
        notifications.show({
            message: data.response?.data.message,
            title: "Atención",

        })
    }
    const onSuccess = (data: ResponseClassflow<string>) => {
        console.log("TOKEN", data);
        notifications.show({
            message: data.data.message
        })
    }
    const onSend = () => { }
    const onFinally = () => { }
    const handleEnviarCorreo = () => {
        let post = new ClassflowPostService<ISendEmail, string, string>("/authorization/sendValidation", {}, {
            email: props.email
        });
        // let res = await axios.post("http://127.0.0.1:8000/authorization",values);
        post.onSend = onSend;
        post.onError = onError;
        post.onSuccess = onSuccess;
        post.onFinally = onFinally;
        classflowAPI.exec(post);
    }

    return <>
        <Text>Valida tu correo</Text>
        <Button onClick={handleEnviarCorreo} disabled={!enabled}>Enviar</Button>
    </>
}