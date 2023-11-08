import { ActionIcon, Tooltip } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";

interface UpdateButtonProps {
    onClick: VoidFunction
}

export default function UpdateButton({ onClick = () => { } }: UpdateButtonProps) {
    return <Tooltip label="Editar">
        <ActionIcon color="indigo" onClick={onClick}>
            <IconPencil />
        </ActionIcon>
    </Tooltip>
}