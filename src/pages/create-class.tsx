import ClassCreateForm from "@features/create-class/class-create-form";
import { ClassCreateFormProvider, useFormCreateClass } from "@features/create-class/class-create-form.context";
import { Stack } from "@mantine/core";

export default function CreateClass() {
    return <>
        <Stack h="100vh" w="100%" justify="start" p="sm">
            <ClassCreateForm />
        </Stack>
    </>
}