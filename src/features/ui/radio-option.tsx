import { ButtonProps, Checkbox, ElementProps, Radio, RadioProps, Text, UnstyledButton, UnstyledButtonProps } from "@mantine/core";
import classes from './Create.module.css';
import { ElementType } from "react";
import { TablerIconsProps } from "@tabler/icons-react";


interface PropsButton extends ElementProps<"button", keyof UnstyledButtonProps> { }

interface RadioOptionProps {
    title: string
    description: string
    propsRadio: RadioProps
    propsButton?: PropsButton
    Icon?: React.ReactNode
}
export default function RadioOption({ title, description, propsRadio, propsButton, Icon }: RadioOptionProps) {
    return <div className={classes.root}>
        <Radio
            classNames={{ root: classes.checkboxWrapper, inner: classes.inner }}
            size="md"
            {...propsRadio}
        />
        <UnstyledButton
            className={classes.control}
            styles={{
                root: {
                    display: "flex",
                    flexDirection: "column",
                    justifyItems: "center",
                    alignItems:"center"
                }
            }}
            data-checked={propsRadio?.checked || undefined}
            {...propsButton}
        >
            <Text className={classes.label}>{title}</Text>
            {Icon}
            <Text className={classes.description}>
                {description}
            </Text>
        </UnstyledButton>
    </div>
}