import { Avatar, Text } from "@mantine/core"
import { useEffect, useState } from "react"

interface AvatarClassflowProps {
    img: string
}
export default function AvatarClassflow({ img }: AvatarClassflowProps) {
    const [loading, setLoading] = useState(true);
    const [fullpath, setFullPath] = useState<string | null>("");
    async function load() {
        try {
            setFullPath(img);
        } catch (error) {
            console.log({ error });
            setFullPath(null);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => { load() }, [])
    if ( loading) {
        return <Text>Loading</Text>
    }
    return <Avatar src={fullpath || ""} radius="xl" />
}