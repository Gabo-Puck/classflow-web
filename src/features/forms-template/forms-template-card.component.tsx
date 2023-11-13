import AvatarClassflow from "@features/ui/avatar.component";
import { FormTemplateListItem } from "./forms-template-list.context";

interface ClassItemProps {
    item: FormTemplateListItem
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
    console.log({ item });
    return (
        <Card
            withBorder
            padding="lg"
            radius="md"
            component={Link}
            to={`/app/clase/${item.id}/anuncios`}
            w={{
                xl: "15% !important",
                xml: "20% !important",
                lg: "22% !important",
                md: "30% !important",
                sm: "46% !important",
                xsm: "100% !important",
            }}
            miw={{
                xl: "14% !important",
                xml: "19% !important",
                lg: "22% !important",
                md: "30% !important",
                sm: "46% !important",
                xsm: "100% !important",
            }}
            h="225px"
            >
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
            </Group>
        </Card>
    );
}
