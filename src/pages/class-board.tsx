import ClassHeader from "@features/class/class-header.component";
import ClassInvitationModes from "@features/class/class-invitation-code.component";
import NoticeControl from "@features/notices/notices-control.component";
import ListNotices from "@features/notices/notices-list.component";
import { Box, Container, Grid, Group, ScrollArea, Stack } from "@mantine/core";

export default function ClassBoard() {
    return <Container w="100vw" h="100vh" fluid>
        <Stack h="100vh" w="100%" justify="start" p="sm">
            <div style={{
                flex: 0
            }}>
                <ClassHeader />
            </div>
            <Grid grow styles={{
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
                        <NoticeControl />
                    </ScrollArea>
                </Grid.Col>
                <Grid.Col span={1}>
                    <ClassInvitationModes />
                </Grid.Col>
            </Grid>
            {/* <div>
                <ClassHeader />
            </div>

            <ScrollArea style={{
                flex: "1",

            }}>
                <Group align="start" pos="relative">
                    <div style={{ flex: 1 }}>
                        <NoticeControl />
                    </div>
                    <Box w="250px">
                        <Box w="250px" style={{
                            position: "fixed"
                        }}>
                            <ClassInvitationModes />
                        </Box>
                    </Box>
                </Group>
            </ScrollArea> */}
        </Stack>
    </Container >
}