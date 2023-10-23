

import Signup from "@features/signup/signup-form.component";
import { Card, Center } from "@mantine/core";

export default function Login() {
    return <Center w="100%" h="100%">
        <Card component={Center}>
            <Signup />
        </Card>
    </Center>
}