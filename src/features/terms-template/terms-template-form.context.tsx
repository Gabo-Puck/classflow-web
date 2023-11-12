// form-context.ts file
import { createFormContext } from '@mantine/form';
import { isRequired } from '@validations/basic';
import { executeValidations } from '@validations/index';
import { createContext, useContext } from 'react';
import { getValueByProp } from 'src/functions/general';
import { IName } from 'src/types/Name';

export interface TermTemplate {
    id?: number
    name: string;
    createdAt: string
    updatedAt: string
    sum?: number
    termDetails: TermTemplateDetails[];
}

export interface TermTemplateDetails extends IName {
    id?: number
    value: number
    sum?: number
    termTemplateDetailsCategories: TermTemplateDetailsCategories[]
}

export interface TermTemplateDetailsCategories extends IName {
    id?: number
    value: number
}

export type TermTemplateBody = Omit<TermTemplate, "createdAt" | "updatedAt">
// You can give context variables any name
export const [TermTemplateFormProvider, useTermTemplateFormContext, useTermTemplateForm] =
    createFormContext<TermTemplateBody>();

interface useFormTermsProps {
    id: number | undefined;
    skipTitle?: boolean;
}

export const useFormTerms = ({ id = undefined, skipTitle = false }: useFormTermsProps) => {
    return useTermTemplateForm({
        initialValues: {
            name: "",
            termDetails: [],
            id,
            sum: 0
        },
        validate: {
            name: (value) => !skipTitle ? executeValidations(value, [
                {
                    validator: isRequired,
                    message: "Ingresa un nombre para la plantilla"
                }
            ]) : null,
            sum: (value, values) => executeValidations(value, [
                {
                    validator: (value) => {
                        let s = values.termDetails.reduce(
                            (acc, curr) => acc + Number(curr.value), 0);
                        return s === 100;
                    },
                    message: "La suma de los parciales debe ser 100"
                }
            ]),
            termDetails: {
                name: (value, values, path) => executeValidations(value, [
                    {
                        validator: isRequired,
                        message: "Ingresa un nombre para el parcial"
                    },
                    {
                        validator: (value) => {
                            let found = values.termDetails.find((v, index) => {
                                let p = `termDetails.${index}.name`;
                                return v.name == value && path !== p
                            });
                            return found === undefined;
                        },
                        message: "Ya existe un parcial con este nombre"
                    }
                ]),
                sum: (value, values, path) => executeValidations(value, [
                    {
                        validator: (value) => {
                            let p = path.split(".");
                            p.pop();
                            let index = p.pop();
                            let s = values.termDetails[Number(index)].termTemplateDetailsCategories.reduce(
                                (acc, curr) => acc + Number(curr.value), 0);
                            return s === 100;
                        },
                        message: "La suma de las categorías debe ser 100"
                    }
                ]),
                termTemplateDetailsCategories: {
                    name: (value, values, path) => executeValidations(value, [
                        {
                            validator: isRequired,
                            message: "Ingresa un nombre para la categoría"
                        },
                        {
                            validator: (value) => {
                                let p = path.split(".");
                                p.pop();
                                p.pop();
                                const actual = p.join(".");
                                let x = getValueByProp(values, actual) as TermTemplateDetailsCategories[];

                                let found = x.find((v, index) => {
                                    let p = `${actual}.${index}.name`;
                                    return v.name == value && path !== p
                                });
                                return found === undefined;
                            },
                            message: "Ya existe una categoría con este nombre"
                        }
                    ]),
                    value: (value) => executeValidations(value, [{
                        validator: (value) => value > 0,
                        message: "Ingresa un valor"
                    }])
                },
                value: (value) => executeValidations(value, [{
                    validator: (value) => value > 0,
                    message: "Ingresa un valor"
                }])
            }
        },
        transformValues: (values) => ({
            ...values,
            sum: undefined,
            termDetails: values.termDetails.map((t) => ({
                ...t,
                sum: undefined,
                id: undefined,
                value: Number(t.value),
                termTemplateId:undefined,
                termTemplateDetailsCategories: t.termTemplateDetailsCategories.map((d) => ({
                    ...d,
                    id:undefined,
                    termTemplateDetailsId:undefined,
                    
                    value: Number(d.value)
                }))
            }))
        })
    });
}
export interface TermTemplateDetailState {
    index: number
};

//create context for state's form
export const TermTemplateDetailContext = createContext<TermTemplateDetailState | undefined>(undefined);

//Create a provider to access both, state and dispatch actions

type TermTemplateDetailProviderProps = TermTemplateDetailState & React.PropsWithChildren
export function TermTemplateDetailProvider({ children, index }: TermTemplateDetailProviderProps) {
    return <TermTemplateDetailContext.Provider value={{
        index
    }}>
        {children}
    </TermTemplateDetailContext.Provider>
}

//Create a custom hook to access the state
export function useTermTemplateDetail() {
    return useContext(TermTemplateDetailContext);
}