import { ActionIcon, Tooltip } from "@mantine/core";
import { IconTrashFilled } from "@tabler/icons-react";


interface UpdateButtonProps {
    onClick: VoidFunction
}

export default function DeleteButton({ onClick = () => { } }: UpdateButtonProps) {
    return <Tooltip label="Eliminar">
        <ActionIcon color="red" onClick={onClick}>
            <IconTrashFilled />
        </ActionIcon>
    </Tooltip>
}