import ClassInvitationModes from "@features/class-board/class-invitation-code.component";
import NoticesControl from "@features/notices/notices-control.component";
import { Grid, ScrollArea } from "@mantine/core";

export default function Notices() {
    return <Grid grow styles={{
        inner: {
            height: "100%"
        }
    }} style={{
        flex: 1
    }}>
        <Grid.Col span={7} h="100%">
            <ScrollArea styles={{
                root: {
                    height: "100%"
                }
            }}>
                <NoticesControl />
            </ScrollArea>
        </Grid.Col>
        <Grid.Col span={1}>
            <ClassInvitationModes />
        </Grid.Col>
    </Grid>
}