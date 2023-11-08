import { MantineColor, MantineColorScheme, Text } from "@mantine/core";

interface GradientTextProps {
    gradient: {
        condition: boolean;
        color: MantineColor
    }[]
    gradientText: string
}
export default function GradientText({ gradient, gradientText }: GradientTextProps) {
    const found = gradient.find((v) => v.condition);
    const color = found === undefined ? "" : found.color;
    return <Text ta="end" c={color}>
        {gradientText}
    </Text>
}
