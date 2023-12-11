import ClassInvitationModes from "@features/class-board/class-invitation-code.component";
import AssignmentsControl from "@features/assignments/assignments";
import { Grid, ScrollArea, Stack, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import ListAssignments from "@features/assignments/assignments-list.component";
import { AssignmentsProvider } from "@features/assignments/assingments-list.context";
import SelectOrderAssignments from "@features/assignments/panel-order-select.component";

export default function Assignments() {
    const isMobile = useMediaQuery(`(max-width: 1049px)`);
    return <AssignmentsProvider>
        <ScrollArea h={"100%"}>
            <AssignmentsControl />
            <SelectOrderAssignments/>
            <ListAssignments />
        </ScrollArea>
    </AssignmentsProvider>
}