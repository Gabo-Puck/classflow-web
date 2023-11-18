// form-context.ts file
import { createFormContext } from '@mantine/form';
import { IconMoodNeutral } from '@tabler/icons-react';
import { isRequired } from '@validations/basic';
import { executeValidations } from '@validations/index';
import { createContext, useContext } from 'react';
import { getValueByProp } from 'src/functions/general';
import PossibleAnswer from 'src/types/PossibleAnswer';
import { Question } from 'src/types/Question';
import { QuestionTypes } from 'src/types/QuestionTypes';


interface QuestionBody extends Question {
    answersValidateClosed?: any
    answersValidate?: any
    answersValidateMultiple?: any
    answersValidateMax?: any
}

export interface FormTemplate {
    id?: number
    name: string;
    createdAt: string
    updatedAt: string
    questionValidate?: any;
    questions: QuestionBody[];
}

export type FormTemplateBody = Omit<FormTemplate, "createdAt" | "updatedAt">
// You can give context variables any name
export const [FormTemplateFormProvider, useFormTemplateFormContext, useFormTemplateForm] =
    createFormContext<FormTemplateBody>();

interface useFormTermsProps {
    id: number | undefined;
    skipTitle?: boolean;
}

export const useFormTemplate = ({ id = undefined, skipTitle = false }: useFormTermsProps) => {
    const form = useFormTemplateForm({
        initialValues: {
            name: "",
            questions: [],
            id
        },
        validate: {
            name: (value) => !skipTitle ? executeValidations(value, [
                {
                    validator: isRequired,
                    message: "Ingresa un nombre para la plantilla"
                }
            ]) : null,
            questionValidate: (value, values, path) => executeValidations(value, [
                {
                    validator: (value) => values.questions.length > 0,
                    message: "Agrega por lo menos una pregunta"
                }
            ]),
            questions: {
                value: (value, values, path) => executeValidations(value, [
                    {
                        validator: isRequired,
                        message: "Ingresa el valor"
                    }
                ]),
                question: (value) => executeValidations(value, [
                    {
                        validator: isRequired,
                        message: "Ingresa la pregunta"
                    }
                ]),
                answersValidateMultiple: (value, values, path) => executeValidations(value, [
                    {
                        validator: (value) => {
                            //validate option based questions
                            let p = path.split(".");
                            p.pop();
                            let obj = getValueByProp(values, p.join(".")) as Question;
                            if (obj.payload.type !== QuestionTypes.MULTIPLE)
                                return true;
                            return obj.payload.data.filter((p) => p.correct).length > 0;

                        },
                        message: "Debes marcar por lo menos una respuesta como correcta"
                    }
                ]),
                answersValidateClosed: (value, values, path) => executeValidations(value, [
                    {
                        validator: (value) => {
                            //validate option based questions
                            let p = path.split(".");
                            p.pop();
                            let obj = getValueByProp(values, p.join(".")) as Question;
                            if (obj.payload.type !== QuestionTypes.CLOSED)
                                return true;
                            return obj.payload.data.filter((p) => p.correct).length === 1;

                        },
                        message: "Debes marcar solo una respuesta como correcta"
                    }
                ]),
                answersValidate: (value, values, path) => executeValidations(value, [
                    {
                        validator: (value) => {
                            //validate option based questions
                            let p = path.split(".");
                            p.pop();
                            let obj = getValueByProp(values, p.join(".")) as Question;
                            console.log({ obj });
                            if (obj.payload.type !== QuestionTypes.CLOSED && obj.payload.type !== QuestionTypes.MULTIPLE)
                                return true;
                            let length = obj.payload.data.length;
                            console.log({ length });
                            return obj.payload.data.length >= 2;

                        },
                        message: "Agrega por lo menos dos respuestas posibles"
                    },
                ]),

                payload: {
                    data: {
                        value: (value) => executeValidations(value, [
                            {
                                validator: isRequired,
                                message: "Escribe la respuesta"
                            }
                        ])
                    }
                }
            },
        },
        transformValues: (values) => ({
            ...values,
            questions: values.questions.map((t) => ({
                ...t,
                answersValidateClosed: undefined,
                answersValidate: undefined,
                answersValidateMultiple: undefined,
                questionValidate: undefined,
                answersValidateMax: undefined
            }))
        })
    });
    return form;
}

export const useFormTemplateHandlers = () => {
    const form = useFormTemplateFormContext();

    const answerFactory = () => {
        let answer: PossibleAnswer = {
            correct: false,
            value: "",
        }
        return answer;
    }
    const questionMultipleFactory = () => {
        let question: Question = {
            question: "",
            required: false,
            value: 0,
            payload: {
                type: QuestionTypes.MULTIPLE,
                data: [
                    {
                        correct: false,
                        value: ""
                    },
                    {
                        correct: false,
                        value: ""
                    }
                ]
            }
        }
        return question;
    }
    const questionOpenFactory = () => {
        let question: Question = {
            question: "",
            required: false,
            value: 0,
            payload: {
                type: QuestionTypes.OPEN
            }
        }
        return question;
    }
    const questionClosedFactory = () => {
        let question: Question = {
            question: "",
            required: false,
            value: 0,
            payload: {
                type: QuestionTypes.CLOSED,
                data: [
                    {
                        correct: false,
                        value: ""
                    },
                    {
                        correct: false,
                        value: ""
                    }
                ]
            }
        }
        return question;
    }
    const questionFileFactory = () => {
        let question: Question = {
            question: "",
            required: false,
            value: 0,
            payload: {
                type: QuestionTypes.FILE
            }
        }
        return question;
    }

    const handleDeleteQuestion = (index: number) => {
        form.removeListItem("questions", index)
    }
    const handleDeleteAnswer = (questionIndex: number, index: number) => {
        let question = form.values.questions[questionIndex].payload
        if (question.type !== QuestionTypes.CLOSED && question.type !== QuestionTypes.MULTIPLE)
            throw new Error("CreateClosedQuestionAnswer should use a QuestionType of type closed")
        if (question.data.length === 2)
            return;
        form.removeListItem(`questions.${questionIndex}.payload.data`, index)
    }

    const handleAddAnswer = (questionIndex: number) => {
        form.insertListItem(`questions.${questionIndex}.payload.data`, answerFactory())
    }

    const handleAddQuestion = (type: QuestionTypes) => {
        let question
        switch (type) {
            case QuestionTypes.CLOSED:
                question = questionClosedFactory();
                break;
            case QuestionTypes.MULTIPLE:
                question = questionMultipleFactory();
                break;
            case QuestionTypes.OPEN:
                question = questionOpenFactory();
                break;
            case QuestionTypes.FILE:
                question = questionFileFactory();
                break;
            default:
                throw new Error("Unrecognized QuestionType")
        }
        form.insertListItem("questions", question)
    }
    return {
        form,
        handleAddQuestion,
        handleAddAnswer,
        handleDeleteAnswer,
        handleDeleteQuestion
    }
}
export interface FormTemplateDetailState {
    index: number
};

//create context for state's form
export const FormTemplateDetailContext = createContext<FormTemplateDetailState | undefined>(undefined);

//Create a provider to access both, state and dispatch actions

type TermTemplateDetailProviderProps = FormTemplateDetailState & React.PropsWithChildren
export function FormTemplateDetailProvider({ children, index }: TermTemplateDetailProviderProps) {
    return <FormTemplateDetailContext.Provider value={{
        index
    }}>
        {children}
    </FormTemplateDetailContext.Provider>
}

//Create a custom hook to access the state
export function useFormTemplateDetail() {
    return useContext(FormTemplateDetailContext);
}