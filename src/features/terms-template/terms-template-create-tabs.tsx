import { ActionIcon, Tabs, Text } from "@mantine/core";
import { IconExclamationCircle, IconX } from "@tabler/icons-react";
import { useTermTemplateFormContext } from "./terms-template-form.context";
import { IIndexable } from "src/types/interface";
import { useEffect } from "react";

interface TermsTabsProps {
    index: number
    name: string
    handleRemove: (index: number) => void
}

export default function TermsTab({ index, name, handleRemove }: TermsTabsProps) {
    const form = useTermTemplateFormContext();
    const errors = () => {

        let regex = new RegExp("termDetails\\." + index, "g")
        let keys = Object.keys(form.errors);
        console.log(keys);
        return keys.some((value) => regex.test(value));

    }


    return <Tabs.Tab
        leftSection={
            errors() &&
            <IconExclamationCircle size="1rem" color="red" />
        }
        rightSection={
            <ActionIcon onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleRemove(index);
            }}
                variant="subtle" size="xs">
                <IconX />
            </ActionIcon>
        }
        key={index}
        value={index.toString()}>
        <Text w="100px" truncate>
            {name}
        </Text>
    </Tabs.Tab>
}