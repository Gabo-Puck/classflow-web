
import { ClassesProvider } from "./panel-list.context";
import ClassList from "./panel-class-list.component";
import SelectOrder from "./panel-order-select.component";
import { Box, Group, ScrollArea, Stack, Title } from "@mantine/core";
import { ButtonModalEnroll } from "./panel-enroll.component";
import { useRole } from "@features/auth/auth-context";
import { ButtonCreateClass } from "./panel-create-class.component";


export default function PanelControls() {
    return <ClassesProvider>
        <Stack pt="sm" h="100%">
            <div style={{ flex: 0 }}>
                <Group justify="space-between">
                    <Title>Tus clases</Title>
                    <div style={{
                        alignSelf: "end",
                    }}>
                        <ButtonModalEnroll />
                        <ButtonCreateClass />
                    </div>
                </Group>
            </div>
                <SelectOrder />
            <ScrollArea styles={{
                root: {
                    height: "100%"
                }
            }}>

                <ClassList />
            </ScrollArea>
        </Stack>
    </ClassesProvider>
}