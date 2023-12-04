import { SetStateAction } from "react";
import { FileExtensionIcon, FileTypes } from "./file-extension-icon";
import { ActionIcon, Card, Group, Text } from "@mantine/core";
import { IconDownload, IconX } from "@tabler/icons-react";

const classflowAPI = import.meta.env.VITE_CLASS_FLOW_API;

export interface FileItem {
    file: FileData
}

export interface FileData {
    type: string;
    filename: string;
    ext: FileTypes;
    base64?: string;
    path?: string;
    id?: number;
}

export interface FileElementProps {
    file: FileData
    index: number
    setList: React.Dispatch<SetStateAction<FileItem[]>>
}

export function FileElementEditable({ file, setList }: FileElementProps) {
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
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group >
                <FileExtensionIcon type={file.ext} />
                <Text>{file.filename}</Text>
                <ActionIcon variant="subtle" onClick={handleDelete}>
                    <IconX />
                </ActionIcon>
                <ActionIcon variant="subtle" onClick={handleDownload}>
                    <IconDownload />
                </ActionIcon>
            </Group>
        </Card>
    </>
}
export function FileElement({ file }: Omit<FileElementProps, "index" | "setList">) {
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
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group >
                <FileExtensionIcon type={file.ext} />
                <Text>{file.filename}</Text>
                <ActionIcon variant="subtle" onClick={handleDownload}>
                    <IconDownload />
                </ActionIcon>
            </Group>
        </Card>
    </>
}