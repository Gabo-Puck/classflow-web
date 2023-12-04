import { useState } from "react";
import { FileData } from "./file-item";
import { Dropzone, FileWithPath, MIME_TYPES } from "@mantine/dropzone";
import { FileTypes } from "./file-extension-icon";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { Button, Group, Text, TextInput, rem } from "@mantine/core";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";

export interface FileModalProps {
    onSave: (file: FileData) => void
}

const toBase64 = (file: Blob): Promise<string | ArrayBuffer | null> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});
export function ModalFiles({ onSave }: FileModalProps) {
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
                ext: f.type.split("/")[1] as FileTypes
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


