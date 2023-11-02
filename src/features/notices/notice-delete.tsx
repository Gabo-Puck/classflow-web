import { Button, Group, Text } from "@mantine/core";
import { ActionsElementProps } from "./notices-list.component";

export default function NoticeDelete({ index }: ActionsElementProps) {
    return <>
        <Text>Borrar es una acción sin retorno. ¿Estas seguro de querer borrar el anuncio?</Text>
        <Group >
            <Button>Si</Button>
            <Button>No</Button>
        </Group>
    </>
}