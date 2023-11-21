import { useAuth } from "@features/auth/auth-context";
import { StudentItem } from "@features/class/class-list-students.context";
import { SignupFormProvider } from "@features/signup/signup-form.context";
import { TermTemplate } from "@features/terms-template/terms-template-form.context";
import { TermTemplateListItem } from "@features/terms-template/terms-template-list.context";
import { Combobox, TextInput, useCombobox, Loader, Text } from '@mantine/core';
import { notifications } from "@mantine/notifications";
import { ClassflowGetService, ClassflowPostService, ErrorClassflow, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


interface AutocompleteFormTemplateProps {
    url: string
    onSelect(s: Pick<TermTemplate, "id" | "name">): void
    selectedList: Pick<TermTemplate, "id" | "name">[] | null
}

export function AutocompleteFormTemplate({ url, onSelect, selectedList }: AutocompleteFormTemplateProps) {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Pick<TermTemplate, "id" | "name">[] | null>(null);
    const [empty, setEmpty] = useState(false);
    const abortController = useRef<AbortController>();
    function getTerms(searchQuery: string, signal: AbortSignal) {

        return new Promise<Pick<TermTemplate, "id" | "name">[]>(async (resolve, reject) => {
            const onError = (data: ErrorClassflow<string>) => {
                notifications.show({
                    message: data.response?.data.message,
                    color: "orange"
                })
            }
            const onSuccess = ({ data: { data: results } }: ResponseClassflow<Pick<TermTemplate, "id" | "name">[]>) => {
                resolve(results);
            }
            const onSend = () => {
                setLoading(true);
            }
            const onFinally = () => {
                setLoading(false);
            }
            let get = new ClassflowPostService<{ query: string }, Pick<TermTemplate, "id" | "name">[], string>(url, {
            }, {
                query: searchQuery
            });
            get.onSend = onSend;
            get.onError = onError;
            get.onSuccess = onSuccess;
            get.onFinally = onFinally;
            await classflowAPI.exec(get);


        });
    }

    const fetchOptions = async (query: string) => {
        abortController.current?.abort();
        abortController.current = new AbortController();
        setLoading(true);
        let users = await getTerms(query, abortController.current.signal);
        setData(users);
        setLoading(false);
        setEmpty(users.length === 0);
        abortController.current = undefined;
    };

    const options = (data || []).map((item) => (
        <Combobox.Option value={item.name} key={item.name}>
            <Text fz="sm">
                {item.name}
            </Text>
        </Combobox.Option>
    ));

    const handleOptionSubmit = (optionValue: string) => {
        combobox.closeDropdown();
        if (!data)
            return;
        let option = data.find((item) => item.name === optionValue);
        if (!option)
            return;
        onSelect(option);
        // setData((d) => {
        //     if (!d) return d;
        //     return d.filter((item) => item.id !== option?.id)
        // })
        setValue(optionValue);
    }

    useEffect(() => {
        if (data === null)
            setEmpty(true);
        else
            setEmpty(data.length === 0);
    }, [data])

    return (
        <Combobox
            width="100%"
            onOptionSubmit={handleOptionSubmit}
            withinPortal={false}
            store={combobox}
        >
            <Combobox.Target>
                <TextInput
                    label="Selecciona la plantilla"
                    placeholder="Buscar por nombre"
                    value={value}
                    onChange={(event) => {
                        setValue(event.currentTarget.value);
                        fetchOptions(event.currentTarget.value);
                        combobox.resetSelectedOption();
                        combobox.openDropdown();
                    }}
                    onClick={() => combobox.openDropdown()}
                    onFocus={() => {
                        combobox.openDropdown();
                        if (data === null) {
                            fetchOptions(value);
                        }
                    }}
                    onBlur={() => combobox.closeDropdown()}
                    rightSection={loading && <Loader size={18} />}
                />
            </Combobox.Target>

            <Combobox.Dropdown hidden={data === null}>
                <Combobox.Options w="90%">
                    {options}
                    {empty && <Combobox.Empty>
                        <Text>
                            No hay resultados.
                        </Text>
                        {/* <Text component={Link} to="/app/parciales">A</Text> */}
                    </Combobox.Empty>}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );

}

export const AutocompleteFormTemplateAssignment = ({ onSelect, selectedList }: Omit<AutocompleteFormTemplateProps, "url">) => <AutocompleteFormTemplate url="/form-templates" onSelect={onSelect} selectedList={selectedList} />;
