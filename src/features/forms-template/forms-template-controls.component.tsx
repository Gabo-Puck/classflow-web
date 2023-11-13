import { TermTemplatesProvider } from "./forms-template-list.context";
import TermsTemplateList from "./forms-template-list.component";
import { Box, Button, Group, ScrollArea, Stack, Title } from "@mantine/core";
import { Link } from "react-router-dom";


export default function TermsTemplateControls() {
    return <TermTemplatesProvider>
        <Stack pt="sm" h="100%">
            <div style={{ flex: 0 }}>
                <Group justify="space-between">
                    <Title>Tus plantillas</Title>
                    <div style={{
                        alignSelf: "end",
                    }}>
                        <Button component={Link} to="crear">Crear plantilla</Button>
                    </div>
                </Group>
            </div>
            <ScrollArea styles={{
                root: {
                    height: "100%"
                }
            }}>

                <TermsTemplateList />
            </ScrollArea>
        </Stack>
    </TermTemplatesProvider>
}