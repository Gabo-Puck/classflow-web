import AssignmentCreateForm from "@features/create-assignment/assignment-create-form";
import { ScrollArea, Stack } from "@mantine/core";

export default function AssignmentCreate() {
    return <ScrollArea styles={{ root: { flex: 1 } }}>
        <Stack justify="start" p="sm">
            <AssignmentCreateForm />
        </Stack>
    </ScrollArea>
}