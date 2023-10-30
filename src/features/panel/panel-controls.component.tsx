
import { ClassesProvider } from "./panel-list.context";
import ClassList from "./panel-class-list.component";
import SelectOrder from "./panel-order-select.component";
import { Box, Group, Stack } from "@mantine/core";
import { ButtonModalEnroll } from "./panel-enroll.component";
import { useRole } from "@features/auth/auth-context";
import { ButtonCreateClass } from "./panel-create-class.component";


export default function PanelControls() {
    const role = useRole();
    return <ClassesProvider>
        <Stack mt="sm">
            <div style={{
                alignSelf: "end",
            }}>
                <ButtonModalEnroll />
                <ButtonCreateClass />
            </div>
            <SelectOrder />
            <ClassList />
        </Stack>
    </ClassesProvider>
}