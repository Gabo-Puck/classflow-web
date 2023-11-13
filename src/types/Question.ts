import PossibleAnswer from "./PossibleAnswer";
import { QuestionTypes } from "./QuestionTypes";

export type OpenQuestion = { type: QuestionTypes.OPEN };
export type MultipleQuestion = { type: QuestionTypes.MULTIPLE; data: PossibleAnswer[] };
export type ClosedQuestion = { type: QuestionTypes.CLOSED; data: PossibleAnswer[] };
export type FileQuestion = { type: QuestionTypes.FILE; };

export interface Question {
    id?: String
    question: String
    value: number
    required: Boolean
    payload: OpenQuestion | MultipleQuestion | ClosedQuestion | FileQuestion
}