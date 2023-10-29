import ClassHeader from "@features/class/class-header.component";
import ClassInvitationCode from "@features/class/class-invitation-code.component";
import { Container, Stack } from "@mantine/core";

export default function ClassBoard() {
    return <Container w="100vw" h="100vh" fluid>
        <Stack h="100%" w="100%" mt="sm">
        <ClassHeader />
        <ClassInvitationCode />

        </Stack>
    </Container>
}