
import { ClassesProvider } from "./panel-list.context";
import ClassList from "./panel-class-list.component";
import SelectOrder from "./panel-order-select.component";
import { Box, Stack } from "@mantine/core";


export default function PanelControls() {
    return <ClassesProvider>
        <Stack mt="sm">
            <SelectOrder />
            <ClassList />
        </Stack>
    </ClassesProvider>
}