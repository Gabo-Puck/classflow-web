import ClassInvitationModes from "@features/class-board/class-invitation-code.component";
import AssignmentsControl from "@features/assignments/assignments";
import { Grid, ScrollArea, Stack, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import ListAssignments from "@features/assignments/assignments-list.component";
import { AssignmentsProvider } from "@features/assignments/assingments-list.context";
import AssignmentDetails from "@features/assignments/assignment-detail";
import { AssignmentDetailProvider } from "@features/assignments/assignment-details.context";
import AssignmentDeliverFiles from "@features/assignments/assignment-deliver-files";

export default function AssignmentDetail() {
    const isMobile = useMediaQuery(`(max-width: 1049px)`);
    return <AssignmentDetailProvider>
        <ScrollArea h={"100%"}>
            <Grid>
                <Grid.Col span={8}>
                    <AssignmentDetails />
                </Grid.Col>
                <Grid.Col span={4}>
                    <AssignmentDeliverFiles />
                </Grid.Col>
            </Grid>
        </ScrollArea>
    </AssignmentDetailProvider>
}