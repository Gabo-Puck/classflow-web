

import LoginForm from "@features/login/login-form.component";
import { Card, Center } from "@mantine/core";




export default function Login() {
    return <Center w="100%" h="100%">
        <Card h="60%" component={Center}>
            <LoginForm />
        </Card>
    </Center>
}