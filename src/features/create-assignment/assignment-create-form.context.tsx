// form-context.ts file
import { FormTemplate, FormTemplateBody } from '@features/forms-template/forms-template-form.context';
import { TermTemplateDetails } from '@features/terms-template/terms-template-form.context';
import { createFormContext } from '@mantine/form';
import { isRequired } from '@validations/basic';
import { executeValidations } from '@validations/index';
import { createContext, useContext } from 'react';
import { getValueByProp } from 'src/functions/general';
import { IName } from 'src/types/Name';

export interface AssigmentCreate {
    id?: number
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    dueAt: string;
    lateDelivery: boolean;
    latePenalty: number;
    groupId: number
    termId: number
    categoryId: number
    form?: FormTemplateBody
}


export type AssingmentCreateBody = Omit<AssigmentCreate, "createdAt" | "updatedAt">
// You can give context variables any name
export const [AssignmentCreateFormProvider, useAssignmentCreateBodyFormContext, useAssignmentCreateBodyForm] =
    createFormContext<AssingmentCreateBody>();

interface useFormAssignmentProps {
    id: number | undefined;
}

export const useFormCreateAssignment = ({ id = undefined }: useFormAssignmentProps) => {
    return useAssignmentCreateBodyForm({
        initialValues: {
            name: "",
            description: "",
            id,
            dueAt: "",
            lateDelivery: false,
            latePenalty: 0,
            groupId: -1,
            termId: -1,
            categoryId: -1
        },
        validate: {
            name: (value) => executeValidations(value, [
                {
                    validator: isRequired,
                    message: "Ingresa un nombre para la tarea"
                }
            ]),
            description: (value) => executeValidations(value, [
                {
                    validator: isRequired,
                    message: "Ingresa un descripción para la tarea"
                }
            ]),
            dueAt: (value) => executeValidations(value, [
                {
                    validator: isRequired,
                    message: "Ingresa una fecha de entrega"
                }
            ]),
            latePenalty: (value, values) => executeValidations(value, [
                {
                    validator: (value) => {
                        return values.lateDelivery && value === 0
                    },
                    message: "Agrega una penalización"
                }
            ]),
            categoryId: (value) => executeValidations(value, [
                {
                    validator: (value) => {
                        return value !== -1
                    },
                    message: "Agrega una categoría"
                }
            ]),
            groupId: (value) => executeValidations(value, [
                {
                    validator: (value) => {
                        return value !== -1
                    },
                    message: "Agrega un grupo"
                }
            ]),
            termId: (value) => executeValidations(value, [
                {
                    validator: (value) => {
                        return value !== -1
                    },
                    message: "Agrega un parcial"
                }
            ])
        }
    }
    )
}