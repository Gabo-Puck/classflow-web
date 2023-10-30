import InvitationsControls from "@features/invitations/invitations-controls.component";
import { Box, Container, Stack, Text } from "@mantine/core";

export default function Invitations() {
    return <Container w="100vw" h="100vh" pt="sm" fluid>
        <Stack h="100%" w="100%">
            <InvitationsControls />
        </Stack>
    </Container>
}
