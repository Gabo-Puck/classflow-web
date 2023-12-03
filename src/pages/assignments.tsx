import ClassInvitationModes from "@features/class-board/class-invitation-code.component";
import AssignmentsControl from "@features/assignments/assignments";
import { Grid, ScrollArea, Stack, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import ListAssignments from "@features/assignments/assignments-list.component";
import { AssignmentsProvider } from "@features/assignments/assingments-list.context";

export default function Assignments() {
    const isMobile = useMediaQuery(`(max-width: 1049px)`);
    return <ScrollArea.Autosize h={"100%"}>
        <AssignmentsProvider>
            <Stack>
                <AssignmentsControl />
                <ListAssignments />
            </Stack>
        </AssignmentsProvider>
    </ScrollArea.Autosize>
}