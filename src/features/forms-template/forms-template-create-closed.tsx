import { useMemo } from "react";
import { Question } from "src/types/Question";
import { useFormTemplateFormContext, useFormTemplateHandlers } from "./forms-template-form.context";
import { Button, Flex, Title, Tooltip, TooltipFloating } from "@mantine/core";
import { QuestionTypes } from "src/types/QuestionTypes";
import { CreateFormAnswerMemoized } from "./form-template-create-answer";

interface CreateClosedQuestionProps {
    index: number
}

interface CreateClosedQuestionWrapperProps {
    index: number
    parentIndex: number
}
export function CreateClosedQuestionWrapper({ index, parentIndex }: CreateClosedQuestionWrapperProps) {
    const form = useFormTemplateFormContext();
    const { handleDeleteAnswer } = useFormTemplateHandlers();
    const question = form.values.questions[parentIndex];

    if (question.payload.type !== QuestionTypes.CLOSED)
        throw new Error("CreateClosedQuestionAnswer should use a QuestionType of type closed")

    const answer = question.payload.data[index];
    let errors: string[] = [];
    const checkErrors = () => {
        let valueError = form.errors[`questions.${parentIndex}.payload.data.${index}.value`]?.toString();
        if (valueError !== undefined)
            errors.push(valueError);
    }
    checkErrors();
    return <>
        <CreateFormAnswerMemoized
            key={parentIndex}
            handleDeleteAnswer={handleDeleteAnswer}
            parentIndex={parentIndex}
            value={JSON.stringify({ ...answer, length: question.payload.data.length })}
            error={JSON.stringify(errors)}
            form={form} index={index}
            type={QuestionTypes.CLOSED} />
    </>
}

export function CreateClosedQuestionAnswers({ index }: CreateClosedQuestionProps) {
    const form = useFormTemplateFormContext();
    const { handleAddAnswer } = useFormTemplateHandlers();
    const question = form.values.questions[index];
    if (question.payload.type !== QuestionTypes.CLOSED)
        throw new Error("CreateClosedQuestionAnswer should use a QuestionType of type closed")

    const fields = question.payload.data.map((q, i) =>
        <CreateClosedQuestionWrapper
            key={i}
            index={i}
            parentIndex={index}
        />)
    return <>
        <Flex justify="space-between" align="center">
            <Title order={5}>Respuestas</Title>
            <Tooltip
                label="Máximo 15 respuestas"
                disabled={question.payload.data.length < 15}>
                <Button
                    disabled={question.payload.data.length >= 15}
                    onClick={() => handleAddAnswer(index)}
                >
                    Agregar
                </Button>
            </Tooltip>
        </Flex>
        {fields}
    </>;
}