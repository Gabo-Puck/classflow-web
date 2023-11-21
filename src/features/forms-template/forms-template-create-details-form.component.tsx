import { ActionIcon, Alert, Button, Card, Checkbox, Flex, Grid, Group, Menu, NumberInput, ScrollArea, Stack, Text, TextInput, Title, Tooltip, rem } from "@mantine/core";
import { FormTemplateBody, useFormTemplateFormContext, useFormTemplateHandlers } from "./forms-template-form.context"
import { PropsWithChildren, memo, useEffect, useMemo, useState } from "react";
import { useShallowEffect } from "@mantine/hooks";
import { useParams } from "react-router-dom";
import { UseFormReturnType } from "@mantine/form";
import { QuestionTypes } from "src/types/QuestionTypes";
import { Question } from 'src/types/Question';
import { CreateClosedQuestionAnswers } from "./forms-template-create-closed";
import { CreateMultipleQuestionAnswers } from "./forms-template-create-multiple";
import { IconAlertCircle, IconDotsVertical } from "@tabler/icons-react";
import { IconTrash } from "@tabler/icons-react";

interface QuestionWrapperProps {
    index: number
}
interface QuestionProps extends QuestionWrapperProps {
    value: string
    error: string
    form: UseFormReturnType<FormTemplateBody, (values: FormTemplateBody) => FormTemplateBody>
    handleDeleteQuestion: (index: number) => void
}
const QuestionMemoized = memo(QuestionComponent, (prev, next) => {
    console.log({ prev, next });
    return prev.value === next.value && prev.error === next.error
})

function QuestionWrapper({ index }: QuestionWrapperProps) {
    const { templateId } = useParams();
    const form = useFormTemplateFormContext();
    const { handleDeleteQuestion } = useFormTemplateHandlers();
    const element = form.values.questions[index];
    let { question, value, required } = element;
    let errors: string[] = [];
    const checkErrors = () => {
        let valueError = form.errors[`questions.${index}.value`]?.toString();
        if (valueError !== undefined)
            errors.push(valueError);
        let questionError = form.errors[`questions.${index}.question`]?.toString();
        if (questionError !== undefined)
            errors.push(questionError);
        let answerValidatedclosed = form.errors[`questions.${index}.answersValidateClosed`]?.toString();
        if (answerValidatedclosed !== undefined)
            errors.push(answerValidatedclosed);
        let answerValidatedMultiple = form.errors[`questions.${index}.answersValidateMultiple`]?.toString();
        if (answerValidatedMultiple !== undefined)
            errors.push(answerValidatedMultiple);
    }
    const getOption = () => {
        switch (element.payload.type) {
            case QuestionTypes.CLOSED:
                return <CreateClosedQuestionAnswers index={index} />
            case QuestionTypes.MULTIPLE:
                return <CreateMultipleQuestionAnswers index={index} />
        }
        return <></>;
    }
    const Details = getOption();
    checkErrors();
    return <>
        <Card component={Stack}>
            <QuestionMemoized
                handleDeleteQuestion={handleDeleteQuestion}
                value={JSON.stringify({ question, value, required })}
                error={JSON.stringify(errors)}
                form={form} index={index} />
            {Details}
        </Card>
    </>
}

function QuestionComponent({ form, index, handleDeleteQuestion }: QuestionProps) {
    console.log(`QuestionComponent ${index} was rendered at`, new Date().toLocaleTimeString());
    return <Stack my="sm">
        {form.errors[`questions.${index}.answersValidateClosed`] && <Alert variant="light" color="orange.5" title="Atención" icon={<IconAlertCircle />}>
            {form.errors[`questions.${index}.answersValidateClosed`]}
        </Alert>}
        {form.errors[`questions.${index}.answersValidateMultiple`] && <Alert variant="light" color="orange.5" title="Atención" icon={<IconAlertCircle />}>
            {form.errors[`questions.${index}.answersValidateMultiple`]}
        </Alert>}
        {form.errors[`questions.${index}.answersValidate`] && <Alert variant="light" color="orange.5" title="Atención" icon={<IconAlertCircle />}>
            {form.errors[`questions.${index}.answersValidate`]}
        </Alert>}
        <Group justify="space-between">
            <Flex align="baseline" gap="xs">
                <Title order={3}>{`Pregunta ${index + 1}`}</Title>
                {
                    form.values.questions[index].payload.type === QuestionTypes.FILE &&
                    <Text c="gray.5" size="sm">5mb max</Text>
                }
            </Flex>
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
                            label="Obligatoria"
                            {...form.getInputProps(`questions.${index}.required`, {
                                type: "checkbox"
                            })}
                        />
                    </Menu.Item>

                    <Menu.Divider />

                    <Menu.Label>Cuidado</Menu.Label>
                    <Menu.Item
                        c="red"
                        onClick={() => { handleDeleteQuestion(index) }}
                        leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                    >
                        Eliminar
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </Group>
        <Grid>
            <Grid.Col>
                <TextInput
                    withAsterisk
                    label="Pregunta"
                    {...form.getInputProps(`questions.${index}.question`)}
                />

            </Grid.Col>
            <Grid.Col>
                <NumberInput
                    hideControls
                    withAsterisk
                    label="Valor"
                    {...form.getInputProps(`questions.${index}.value`)}
                />
            </Grid.Col>
        </Grid>
    </Stack>
}

interface CreateTermDetails extends PropsWithChildren {
    onSave: VoidFunction;
    hasErrors?(): boolean;
    delegateSave?: boolean;
}


export default function CreateFormDetails({ children, delegateSave = false, onSave = () => { }, hasErrors = () => false }: CreateTermDetails) {
    const form = useFormTemplateFormContext();
    const { handleAddQuestion } = useFormTemplateHandlers();
    const [loading, setLoading] = useState(false);
    const [disableFileQuestion, setDisableFileQuestion] = useState<boolean>(false);
    useEffect(() => {
        console.log({ values: form.values });
    }, [form.values])


    const fields = useMemo(
        () => form.values.questions.map((q, index) =>
            <QuestionWrapper
                key={index}
                index={index}
            />)
        , [form.values.questions.length])

    const handleSubmit = async () => {
        if (delegateSave) return;
        let errors = form.validate();
        let errorsParent = hasErrors();
        if (!errors.hasErrors && !errorsParent) {
            try {
                setLoading(true);
                await onSave();
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        }
    }
    useShallowEffect(() => {
        let count = form.values.questions.filter(({ payload: { type } }) => type === QuestionTypes.FILE).length;
        setDisableFileQuestion(count >= 5);
    }, [form.values.questions])
    return <>
        <Flex direction="column" h="100%">
            <ScrollArea styles={{
                root: {
                    height: "100%",
                    flex: 1
                }
            }} offsetScrollbars>
                <Stack>
                    {children}
                    <Flex justify="space-between">
                        <Menu trigger="hover">

                            <Menu.Target>
                                <Button onClick={handleSubmit} loading={loading} disabled={
                                    form.values.questions.length >= 15
                                }>Agregar una pregunta</Button>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item onClick={() => handleAddQuestion(QuestionTypes.OPEN)}>
                                    Abierta
                                </Menu.Item>
                                <Menu.Item onClick={() => handleAddQuestion(QuestionTypes.CLOSED)}>
                                    Cerrada
                                </Menu.Item>
                                <Menu.Item onClick={() => handleAddQuestion(QuestionTypes.MULTIPLE)}>
                                    Múltiple
                                </Menu.Item>

                                <Menu.Item disabled={disableFileQuestion} onClick={() => handleAddQuestion(QuestionTypes.FILE)}>
                                    Archivo
                                    {disableFileQuestion && < Text size="xs">
                                        5 preguntas máximo
                                    </Text>}
                                </Menu.Item>

                            </Menu.Dropdown>
                        </Menu>
                    </Flex>
                    {fields}
                </Stack>
            </ScrollArea>
            {!delegateSave && <Flex py="sm" justify="end">
                <Tooltip
                    label="Crea mínimo dos preguntas"
                    disabled={form.values.questions.length >= 2}>
                    <Button onClick={handleSubmit} loading={loading} disabled={
                        form.values.questions.length < 2
                    }>Guardar</Button>
                </Tooltip>
            </Flex>}
        </Flex >
    </>
}