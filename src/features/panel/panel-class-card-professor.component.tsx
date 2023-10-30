import AvatarClassflow from "@features/ui/avatar.component";
import { ClassItem } from "./panel-list.context";

interface ClassItemProps {
    item: ClassItem
}
import { Card, Avatar, Text, Progress, Badge, Group, ActionIcon } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { Link } from "react-router-dom";

const avatars = [
    'https://avatars.githubusercontent.com/u/10353856?s=460&u=88394dfd67727327c1f7670a1764dc38a8a24831&v=4',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
];

export default function ClassCardProfessor({ item }: ClassItemProps) {
    console.log({item});
    return (
        <Card 
            withBorder
            padding="lg"
            radius="md"
            component={Link}
            to={`/app/clase/${item.id}`}
            w="250px">
            <Text fz="lg" fw={500} mt="md">
                {item.name}
            </Text>
            <Text fz="sm" c="dimmed" mt={5}>
                {item.description}
            </Text>
            <Group justify="space-between" mt="md">

                <Text fz="sm" c="dimmed" mt={5}>
                    Students: {`${item._count?.enrolledStudents}`}
                </Text>
                <ActionIcon variant="default" size="lg" radius="md">
                    <IconUpload size="1.1rem" />
                </ActionIcon>
            </Group>
        </Card>
    );
}
