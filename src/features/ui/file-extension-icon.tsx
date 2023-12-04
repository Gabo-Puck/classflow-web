import { IconFile, IconFileTypeJpg, IconFileTypePdf, IconFileTypePng, IconFileZip } from "@tabler/icons-react";

export type FileTypes = "pdf" | "zip" | "png" | "jpg";
export interface FileExtensionIconProps {
    type: FileTypes

}
export function FileExtensionIcon({ type }: FileExtensionIconProps) {
    const selectIcon = () => {
        switch (type) {
            case "pdf":
                return IconFileTypePdf;
            case "zip":
                return IconFileZip;
            case "png":
                return IconFileTypePng;
            case "jpg":
                return IconFileTypeJpg;
            default:
                return IconFile;
        }
    }
    let Icon = selectIcon();
    return <Icon />;
}