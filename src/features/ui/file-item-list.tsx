import { SetStateAction } from "react";
import { FileElement, FileElementEditable, FileItem } from "./file-item";
import { modals } from "@mantine/modals";
import { Button, Flex, FlexProps, InputLabel, Stack, StyleProp } from "@mantine/core";
import { ModalFiles } from "./file-modal";

export interface FileListProps {
    list: FileItem[]
    setList: React.Dispatch<SetStateAction<FileItem[]>>
    direction?: StyleProp<React.CSSProperties['flexDirection']>
}

function obtenerMayorID(arreglo: FileItem[]) {
    if (arreglo.length === 0) {
        return 0; // Retorna null si el arreglo está vacío
    }

    // Utilizamos el método reduce para encontrar el máximo ID
    const mayorID = arreglo.reduce((maxID, objeto) => {
        const objetoID = objeto.file.id || 0; // Suponemos que la propiedad 'id' existe en cada objeto

        return objetoID > maxID ? objetoID : maxID;
    }, -Infinity);

    return mayorID;
}

export function FileListItemsView({ list, direction }: Omit<FileListProps, "setList">) {
    return <>
        <Stack>
            <InputLabel>Archivos</InputLabel>
            <Flex gap="sm" direction={direction}>
                {list.filter((f) => f.file.type != "delete").map((l) => <>
                    <FileElement file={l.file} />
                </>)}
            </Flex>
        </Stack>
    </>
}

export function FileListItemsOperation({ list, setList, direction }: FileListProps) {
    const handleOpenModal = () => {
        modals.open({
            title: "Añadir archivo",
            children: <ModalFiles onSave={(f) => {
                let id = obtenerMayorID(list);
                setList((v: FileItem[]) => [...v, {
                    file: {
                        ...f,
                        id: id + 1
                    }
                }]);
            }} />
        })
    }
    return <>
        <Stack>
            <InputLabel>Archivos</InputLabel>
            <Flex>
                <Button onClick={handleOpenModal}>Añadir archivo</Button>
            </Flex>
            <Flex gap="sm" direction={direction}>
                {list.filter((f) => f.file.type != "delete").map((l, index) => <>
                    <FileElementEditable file={l.file} index={index} setList={setList} />
                </>)}
            </Flex>
        </Stack>
    </>
}