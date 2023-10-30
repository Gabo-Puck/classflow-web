import ClassHeader from "@features/class/class-header.component";
import ClassInvitationModes from "@features/class/class-invitation-code.component";
import { Box, Container, Stack } from "@mantine/core";

export default function ClassBoard() {
    return <Container w="100vw" h="100vh" pt="sm" fluid>
        <Stack h="100%" w="100%">
            <ClassHeader />
            <Box w="250px">
                <ClassInvitationModes />
            </Box>
        </Stack>
    </Container>
}