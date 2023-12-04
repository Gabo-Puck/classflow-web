import { Button, Stack } from "@mantine/core";
import { GroupsProvider } from "./groups-list.context";
import ListGroups from "./groups-list.component";
import { Link } from "react-router-dom";


export default function GroupControl() {
    return <>
        <GroupsProvider>
            <Stack h="100%">
                <Button component={Link} to="crear" fullWidth>Crear grupo</Button>
                <ListGroups />
            </Stack>
        </GroupsProvider>
    </>

}
