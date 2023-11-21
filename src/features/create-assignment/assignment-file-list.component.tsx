import { ActionIcon, Button, Flex, Group, InputLabel, Text, TextInput, rem } from "@mantine/core";
import { modals } from "@mantine/modals";
import { Dropzone, DropzoneProps, FileWithPath, MIME_TYPES } from "@mantine/dropzone"
import { IconCross, IconDownload, IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { SetStateAction, useState } from "react";
export interface FileItem {
    type: string;
    filename: string;
    base64?: string;
    path?: string;
    id?: number;
}

export interface FileListProps {
    list: FileItem[]
    setList: React.Dispatch<SetStateAction<FileItem[]>>
}

interface FileModalProps {
    onSave: (file: FileItem) => void
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
    const [file, setFile] = useState<FileItem | null>(null);
    const handleDrop = async (file: FileWithPath[]) => {
        let f = file[0];
        const fl = await toBase64(f);
        setFile({
            filename: "",
            type: "create",
            base64: fl?.toString().split(",", 2)[1],
        })
        setFilename(f.name);
        setDisabled(false);
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
            disabled={file == null || filename == ""}
            onClick={handleSave}>
            Guardar
        </Button>
    </>
}


interface FileElementProps {
    file: FileItem
    index: number
    setList: React.Dispatch<SetStateAction<FileItem[]>>
}
function FileElement({ file, setList, index }: FileElementProps) {
    const handleDelete = () => {
        if (file.id !== undefined) {
            //mark as delete
            setList((list) => list.map((l, i) => i == index ? ({ ...l, type: "delete" }) : { ...l }))
        } else {
            //delete
            setList((list) => list.filter((l, i) => (i != index)))
        }
    }
    const handleDownload = () => {
        const link = document.createElement('a');
        let url = ""
        if (file.path != undefined)
            url = file.path;
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
        link.download = file.filename || 'descarga';
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

export default function FileListItems({ list, setList }: FileListProps) {
    const handleOpenModal = () => {
        modals.open({
            title: "Añadir archivo",
            children: <ModalFiles onSave={(f) => {
                setList((v: FileItem[]) => [...v, {
                    ...f
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
            {list.filter((f) => f.type != "delete").map((l, index) => <>
                <FileElement file={l} index={index} setList={setList} />
            </>)}
        </Flex>
    </>
}