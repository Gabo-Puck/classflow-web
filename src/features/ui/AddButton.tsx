import { ActionIcon, Tooltip } from "@mantine/core";
import { IconSquarePlus } from '@tabler/icons-react';
interface UpdateButtonProps {
    onClick: VoidFunction
}

export default function AddButton({ onClick = () => { } }: UpdateButtonProps) {
    return <Tooltip label="Agregar">
        <ActionIcon color="indigo" onClick={onClick}>
            <IconSquarePlus />
        </ActionIcon>
    </Tooltip>
}