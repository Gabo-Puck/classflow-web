import { LoadingOverlay } from "@mantine/core";

interface LoadingProps {
    visible: boolean
}

export default function Loading({ visible }: LoadingProps) {
    return <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 1 }}
        loaderProps={{ color: 'cyan', type: 'oval' }}
    />
}