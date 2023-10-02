import { createFormContext } from "@mantine/form"
export interface UserFormValues {
    email: string,
    password: string
}

export const [UserFormProvider, useUserFormContext, useUserForm] = createFormContext<UserFormValues>();