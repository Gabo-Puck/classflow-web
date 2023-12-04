import ClassInvitationModes from "@features/class-board/class-invitation-code.component";
import ClassMembersControl from "@features/class-members/class-members-control.component";

import { Grid, ScrollArea, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export default function ClassMembers() {
    const isMobile = useMediaQuery(`(max-width: 1049px)`);
    return <Grid grow styles={{
        root: {
            height: "100%",
            flex: 1
        },
        inner: {
            height: "100%",
            flex: 1
        }
    }} >
        <Grid.Col span={9} h="100%">
            <ScrollArea.Autosize h={"100%"}>
                <Stack>
                    <ClassMembersControl />
                    {isMobile && <ClassInvitationModes />}
                </Stack>
            </ScrollArea.Autosize>
        </Grid.Col>
        {!isMobile && <Grid.Col span={2} h="100%">
            <ScrollArea.Autosize h={"100%"}>
                <ClassInvitationModes />
            </ScrollArea.Autosize>
        </Grid.Col>}
    </Grid>
}