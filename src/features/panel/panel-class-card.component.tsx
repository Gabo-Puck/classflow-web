import { ClassItem } from "./panel-list.context";

interface ClassItemProps {
    item: ClassItem
}
export default function ClassCard({ item }: ClassItemProps) {
    return <div>{item.name}</div>
}