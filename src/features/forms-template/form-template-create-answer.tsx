import { UseFormReturnType } from "@mantine/form"
import { memo } from "react"
import { FormTemplateBody, useFormTemplateHandlers } from "./forms-template-form.context"
import { ActionIcon, Alert, Box, Button, Card, Checkbox, Grid, Group, Menu, NumberInput, Stack, Text, TextInput, Title, Tooltip, rem } from "@mantine/core"
import { IconArrowsLeftRight, IconCircle, IconDots, IconDotsVertical, IconSettings, IconSquare, IconTrash } from "@tabler/icons-react"
import { OptionBasedQuestion, QuestionTypes } from "src/types/QuestionTypes"
import { IconAlertCircle } from "@tabler/icons-react"



interface CraeteFormAnswerProps {
    index: number
    parentIndex: number
    value: string
    error: string
    form: UseFormReturnType<FormTemplateBody, (values: FormTemplateBody) => FormTemplateBody>
    type: OptionBasedQuestion
    handleDeleteAnswer: (questionIndex: number, index: number) => void
}
function CreateFormAnswer({ handleDeleteAnswer, form, parentIndex, index, value, error, type }: CraeteFormAnswerProps) {
    let question = form.values.questions[parentIndex].payload;
    if (question.type !== QuestionTypes.CLOSED && question.type !== QuestionTypes.MULTIPLE)
        throw new Error("CreateFormAnswer should use a QuestionType of type closed")
    console.log(`CreateFormAnser from ${parentIndex} at ${index} was rendered at ${new Date().toLocaleString()}`);
    return <>
       
        <TextInput
            withAsterisk
            label=""
            {...form.getInputProps(`questions.${parentIndex}.payload.data.${index}.value`)}
            leftSection={
                type === QuestionTypes.CLOSED ?
                    <IconCircle
                        style={{
                            width: rem(20),
                            height: rem(20)
                        }} /> : <IconSquare style={{
                            width: rem(20),
                            height: rem(20)
                        }} />
            }
            rightSection={
                <Menu withinPortal={false} shadow="md" width={200} closeOnItemClick={false}>
                    <Menu.Target>
                        <ActionIcon variant="subtle">
                            <IconDotsVertical />
                        </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Label>Opciones</Menu.Label>
                        <Menu.Item>
                            <Checkbox
                                w="100%"
                                styles={{
                                    labelWrapper: {
                                        flex: 1
                                    }
                                }}
                                label="Correcta"
                                {...form.getInputProps(`questions.${parentIndex}.payload.data.${index}.correct`, {
                                    type: "checkbox"
                                })}
                            />
                        </Menu.Item>

                        <Menu.Divider />

                        <Menu.Label>
                            <Text>
                                Cuidado
                            </Text>
                            {question.data.length == 2 && <Text size="xs">
                                2 respuestas mínimo
                            </Text>}
                        </Menu.Label>

                        <Menu.Item
                            c="red"
                            disabled={question.data.length == 2}
                            onClick={() => handleDeleteAnswer(parentIndex, index)}
                            leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                        >
                            Eliminar

                        </Menu.Item>


                    </Menu.Dropdown>
                </Menu>
            }
        />

    </>
}

export const CreateFormAnswerMemoized = memo(CreateFormAnswer, (prev, next) => {
    console.log({ prev, next });
    return prev.value === next.value && prev.error === next.error
});