// form-context.ts file
import { TermTemplateDetails } from '@features/terms-template/terms-template-form.context';
import { createFormContext } from '@mantine/form';
import { isRequired } from '@validations/basic';
import { executeValidations } from '@validations/index';
import { createContext, useContext } from 'react';
import { getValueByProp } from 'src/functions/general';
import { IName } from 'src/types/Name';

export interface ClassCreate {
    id?: number
    name: string;
    description: string;
    createdAt: string
    updatedAt: string
}


export type ClassCreateBody = Omit<ClassCreate, "createdAt" | "updatedAt">
// You can give context variables any name
export const [ClassCreateFormProvider, useClassCreateBodyFormContext, useClassCreateBodyForm] =
    createFormContext<ClassCreateBody>();

interface useFormTermsProps {
    id: number | undefined;
}

export const useFormCreateClass = ({ id = undefined }: useFormTermsProps) => {
    return useClassCreateBodyForm({
        initialValues: {
            name: "",
            description: "",
            id
        },
        validate: {
            name: (value) => executeValidations(value, [
                {
                    validator: isRequired,
                    message: "Ingresa un nombre para la clase"
                }
            ]),
            description: (value) => executeValidations(value, [
                {
                    validator: isRequired,
                    message: "Ingresa un descripción para la clase"
                }
            ])
        }
    }
    )
}