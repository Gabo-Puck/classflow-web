import { createFormContext } from "@mantine/form"
export interface SignupFormValues {
    email: string
    name: string
    lastname: string
    role: string
    password: string
    repeatPassword?: string

}

export const [SignupFormProvider, useSignupFormContext, useSignupForm] = createFormContext<SignupFormValues>();