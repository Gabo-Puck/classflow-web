import { Button, Modal, PinInput, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { ClassflowPostService, ErrorClassflow, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import { useState } from "react";
import { ClassItem, useClassDispatch, useClasses } from "./panel-list.context";
import { useForm } from "@mantine/form";
import { executeValidations } from "@validations/index";
import { exactLength } from "@validations/basic";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { ROLES, useRole } from "@features/auth/auth-context";

interface EnrollInfo {
    code: string
}

interface EnrollClassProps {
    close(): void
}

export function EnrollClass({
    close = () => { }
}: EnrollClassProps) {
    const [loading, setLoading] = useState(false);
    const classes = useClassDispatch();
    if (!classes) {
        throw new Error("EnrollClass should be defined in")
    }
    const form = useForm<EnrollInfo>({
        initialValues: {
            code: ""
        },
        validate: {
            code: (value) => executeValidations(value, [
                {
                    message: "El código tiene que tener 6 carácteres",
                    validator: (value) => exactLength(value, 6)
                }])
        }
    });
    const onError = (data: ErrorClassflow<string>) => {
        notifications.show({
            message: data.response?.data.message,
            color: "orange"
        })
    }
    const onSuccess = (data: ResponseClassflow<ClassItem>) => {
        notifications.show({
            message: data.data.message,
            color: "green"
        })

        if (classes) {
            classes({
                type: "unset"
            })
        }
        close();
    }
    const onSend = () => {
        setLoading(true);
    }
    const onFinally = () => {
        setLoading(false);
    }
    const handleSubmit = async () => {
        let post = new ClassflowPostService<EnrollInfo, ClassItem, string>("/classes/enroll", {
        }, {
            code: form.values.code
        });
        post.onSend = onSend;
        post.onError = onError;
        post.onSuccess = onSuccess;
        post.onFinally = onFinally;
        await classflowAPI.exec(post);
    }
    return <>
        <Stack align="center">
            <Text>Escribe el código de la clase</Text>
            <PinInput disabled={loading} length={6} {...form.getInputProps("code")} />
            <Button onClick={handleSubmit} loading={loading} disabled={!form.isValid()}>Unirme</Button>
        </Stack>
    </>

}

export function ButtonModalEnroll() {
    const [opened, { open, close }] = useDisclosure(false);
    const role = useRole();
    return <>
        {/* render only for students */}
        {role === ROLES.STUDENT && <>
            <Button onClick={open}>Unirse</Button>
            <Modal id="enroll-modal" opened={opened} onClose={close} title="Unirse a una clase">
                <EnrollClass close={close} />
            </Modal>
        </>
        }
    </>
}