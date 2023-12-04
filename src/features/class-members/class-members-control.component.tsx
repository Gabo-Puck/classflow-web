import { Button, Stack } from "@mantine/core";
import { NoticesProvider } from "./class-members-list.context";
import ListClassMembers from "./class-members-list.component";
import { Link } from "react-router-dom";


export default function ClassMembersControl() {
    return <>
        <NoticesProvider>
            <Stack>
                <ListClassMembers />
            </Stack>
        </NoticesProvider>
    </>

}
