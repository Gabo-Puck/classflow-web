export const enum QuestionTypes {
    CLOSED,
    MULTIPLE,
    OPEN,
    FILE
}

export type OptionBasedQuestion = QuestionTypes.MULTIPLE | QuestionTypes.CLOSED;