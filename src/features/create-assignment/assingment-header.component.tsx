import { ClassItem } from '@features/panel/panel-list.context';
import { Card, Avatar, Text, Progress, Badge, Group, ActionIcon } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { useClassDetail } from './assignment-detail.context';


interface ClassItemProps {
    item: ClassItem
}

const avatars = [
    'https://avatars.githubusercontent.com/u/10353856?s=460&u=88394dfd67727327c1f7670a1764dc38a8a24831&v=4',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
];

export default function ClassHeader() {
    const classDetail = useClassDetail();
    if (!classDetail)
        throw new Error("Classheader should be defined inside a ClassContext");
    return (
        <Card withBorder padding="lg" radius="md">
            <Text fz="lg" fw={500} mt="md">
                !{classDetail.name}¡
            </Text>
            <Text fz="sm" c="dimmed" mt={5}>
                {classDetail.description}
            </Text>
            <Text fz="sm" c="dimmed" mt={5}>
                {classDetail.code}
            </Text>
        </Card>
    );
}
