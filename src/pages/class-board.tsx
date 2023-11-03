import { ClassProvider } from "@features/class/class-detail.context";
import ClassHeader from "@features/class-board/class-header.component";
import ClassInvitationModes from "@features/class-board/class-invitation-code.component";
import NoticeControl from "@features/notices/notices-control.component";
import ListNotices from "@features/notices/notices-list.component";
import { Box, Container, Grid, Group, ScrollArea, Stack } from "@mantine/core";
import { Tabs } from '@mantine/core';
import { useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import Notices from "./Notices";
import NavigationTabs from "@features/class-board/class-navigation-tabs.component";
import { TabsProvider } from "@features/class-board/class-navigation-tabs.context";

export default function ClassBoard() {
    return <ClassProvider>
        <TabsProvider>
            <Stack h="100vh" w="100%" justify="start" p="sm">
                <div style={{
                    flex: 0
                }}>
                    <NavigationTabs />
                    <ClassHeader />
                </div>
                <Outlet />
            </Stack>
        </TabsProvider>
    </ClassProvider>
}