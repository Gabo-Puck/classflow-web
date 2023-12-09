import GroupForm from "@features/groups/group-create-form.component";
import GroupControl from "@features/groups/groups-control.component";
import { Grid, ScrollArea, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export default function CreateGroup() {
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
                <GroupForm />
            </ScrollArea>
        </Grid.Col>
    </Grid>
}