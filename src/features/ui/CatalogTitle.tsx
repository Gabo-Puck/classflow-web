import { Title, TitleOrder } from "@mantine/core";

interface CatalogTitleProps {
    title: string;
    order?: TitleOrder
}
export default function CatalogTitle({ title, order = 3 }: CatalogTitleProps) {
    return <Title order={order}>{title}</Title>
}