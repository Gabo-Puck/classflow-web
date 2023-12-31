import ClassInvitationModes from "@features/class-board/class-invitation-code.component";
import NoticesControl from "@features/notices/notices-control.component";
import { Grid, ScrollArea, Stack, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export default function Notices() {
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
            <ScrollArea h={"100%"}>
                <NoticesControl />
            </ScrollArea>
        </Grid.Col>

    </Grid>
}