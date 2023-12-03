import { ActionIcon, Alert, Button, Flex, Group, InputLabel, Text, TextInput, Title, rem } from "@mantine/core";
import { modals } from "@mantine/modals";
import { Dropzone, DropzoneProps, FileWithPath, MIME_TYPES } from "@mantine/dropzone"
import { IconAlertCircle, IconCross, IconDownload, IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { SetStateAction, useState } from "react";
import { notifications } from "@mantine/notifications";
export interface FileItem {
    file: FileData
}
export interface FileData {
    type: string;
    filename: string;
    ext: string;
    base64?: string;
    path?: string;
    id?: number;
}
const classflowAPI = import.meta.env.VITE_CLASS_FLOW_API;
export interface FileListProps {
    list: FileItem[]
    setList: React.Dispatch<SetStateAction<FileItem[]>>
}

interface FileModalProps {
    onSave: (file: FileData) => void
}

const toBase64 = (file: Blob): Promise<string | ArrayBuffer | null> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});
function ModalFiles({ onSave }: FileModalProps) {
    const [disabled, setDisabled] = useState(true);
    const [filename, setFilename] = useState("");
    const [file, setFile] = useState<FileData | null>(null);
    const handleDrop = async (file: FileWithPath[]) => {
        let f = file[0];
        try {
            const fl = await toBase64(f);
            setFile({
                filename: "",
                type: "create",
                base64: fl?.toString().split(",", 2)[1],
                ext: f.type.split("/")[1]
            })
            setFilename(f.name);
            setDisabled(false);
        } catch (error) {
            notifications.show({
                message: "Algo ha salido mal con tu archivo. Asegurate que no este corrupto o exista en tu equipo",
                color: "orange"
            })
            console.log(error);
        }
    }
    const handleSave = () => {
        if (file !== null) {
            onSave({ ...file, filename })
            modals.closeAll()
        }
    }
    return <>
        <TextInput
            value={filename}
            onChange={({ target: { value } }) => setFilename(value)}
            label="Nombre archivo"
            disabled={disabled} />
        <Dropzone
            onDrop={handleDrop}
            onReject={(files) => console.log('rejected files', files)}
            maxSize={10 * 1024 * 1024}
            accept={[MIME_TYPES.pdf, MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.zip]}
        >
            <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                <Dropzone.Accept>
                    <IconUpload
                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                        stroke={1.5}
                    />
                </Dropzone.Accept>
                <Dropzone.Reject>
                    <IconX
                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                        stroke={1.5}
                    />
                </Dropzone.Reject>
                <Dropzone.Idle>
                    <IconPhoto
                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                        stroke={1.5}
                    />
                </Dropzone.Idle>

                <div>
                    <Text size="xl" inline>
                        Arrastra o selecciona un archivo
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                        Se aceptan archivos pdf, png, jpg, zip de máximo 10mb
                    </Text>
                </div>
            </Group>
        </Dropzone>
        <Button
            disabled={file == null || filename == "" || /\.$/.test(filename)}
            onClick={handleSave}>
            Guardar
        </Button>
    </>
}


interface FileElementProps {
    file: FileData
    index: number
    setList: React.Dispatch<SetStateAction<FileItem[]>>
}
function FileElement({ file, setList }: FileElementProps) {
    const handleDelete = () => {
        if (file.id !== undefined) {
            //mark as delete
            setList((list) => list.map((l) => file.id == l.file.id ? ({
                file: {
                    ...l.file,
                    type: "delete"
                }
            }) : { ...l }))
        } else {
            //delete
            setList((list) => list.filter((l) => (file.id != l.file.id)))
        }
    }
    const handleDownload = () => {
        const link = document.createElement('a');
        let url = ""
        if (file.path != undefined)
            url = `${classflowAPI}download?resource=${file.path}&filename=${file.filename.concat(".").concat(file.ext)}`;
        console.log({ file });
        if (file.base64 != undefined) {
            const byteCharacters = atob(file.base64);
            const byteNumbers = new Array(byteCharacters.length);

            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/octet-stream' });
            url = URL.createObjectURL(blob);
        }
        link.href = url;
        // link.target = "_self";
        // link.download = file.filename;
        console.log(`${file.filename}.${file.ext}`);
        link.download = `${file.filename}.${file.ext}`;
        link.click();
    }
    return <>
        <Group>
            <Text>{file.filename}</Text>
            <ActionIcon variant="subtle" onClick={handleDelete}>
                <IconX />
            </ActionIcon>
            <ActionIcon variant="subtle" onClick={handleDownload}>
                <IconDownload />
            </ActionIcon>
        </Group>
    </>
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
export default function FileListItems({ list, setList }: FileListProps) {
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
        <InputLabel>Archivos</InputLabel>
        <Flex>
            <div>
                <Button onClick={handleOpenModal}>Añadir archivo</Button>
            </div>
        </Flex>
        <Flex gap="sm">
            {list.filter((f) => f.file.type != "delete").map((l, index) => <>
                <FileElement file={l.file} index={index} setList={setList} />
            </>)}
        </Flex>
    </>
}