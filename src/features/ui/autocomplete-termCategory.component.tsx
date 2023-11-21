import { useAuth } from "@features/auth/auth-context";
import { StudentItem } from "@features/class/class-list-students.context";
import { SignupFormProvider } from "@features/signup/signup-form.context";
import { Combobox, TextInput, useCombobox, Loader, Text } from '@mantine/core';
import { notifications } from "@mantine/notifications";
import { ClassflowPostService, ErrorClassflow, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import { useEffect, useRef, useState } from "react";
import { TermCategoryItem } from "src/types/termCategory";

interface AutocompleteTermCategoriesProps {
    url: string
    onSelect(s: TermCategoryItem): void
    selectedList: TermCategoryItem[] | null
    removeOnSelect: boolean
    clearOnSelect: boolean
    termId: number
    disabled: boolean
}

export function AutocompleteTermCategory({ disabled, termId, url, onSelect, selectedList, removeOnSelect, clearOnSelect }: AutocompleteTermCategoriesProps) {
    const userData = useAuth();
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });
    const [value, setValue] = useState('');
    const [users, setUsers] = useState<StudentItem[] | null>();
    if (!userData)
        throw new Error("Any AutocompleteUsers variant should be defined as children of AuthProvider");

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<TermCategoryItem[] | null>(null);
    const [empty, setEmpty] = useState(false);
    const abortController = useRef<AbortController>();

    function getUsers(searchQuery: string, signal: AbortSignal) {

        return new Promise<TermCategoryItem[]>(async (resolve, reject) => {
            // signal.addEventListener('abort', () => {
            //     reject(new Error('Request aborted'));
            // });
            const onError = (data: ErrorClassflow<string>) => {
                notifications.show({
                    message: data.response?.data.message,
                    color: "orange"
                })
            }
            const onSuccess = ({ data: { data: results } }: ResponseClassflow<TermCategoryItem[]>) => {
                let filteredResults = results.filter((item) => {
                    if (item.name === userData?.name)
                        return false;
                    if (selectedList === null)
                        return true;
                    if (selectedList.find((i) => i.name === item.name)) {
                        return false;
                    }
                    return true
                });
                resolve(filteredResults);
            }
            const onSend = () => {
                setLoading(true);
            }
            const onFinally = () => {
                setLoading(false);
            }
            let post = new ClassflowPostService<{ query: string, termId: number }, TermCategoryItem[], string>(url, {
            }, {
                query: searchQuery,
                termId
            });
            post.onSend = onSend;
            post.onError = onError;
            post.onSuccess = onSuccess;
            post.onFinally = onFinally;
            await classflowAPI.exec(post);


        });
    }

    const fetchOptions = async (query: string) => {
        abortController.current?.abort();
        abortController.current = new AbortController();
        setLoading(true);
        let users = await getUsers(query, abortController.current.signal);
        setData(users);
        setLoading(false);
        setEmpty(users.length === 0);
        abortController.current = undefined;
    };

    const options = (data || []).map((item) => (
        <Combobox.Option value={item.name} key={item.name}>
            <Text fz="sm">
                {`${item.name}`}
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
        if (!removeOnSelect) {
            setValue(option.name)
            return
        };
        setData((d) => {
            if (!d) return d;
            return d.filter((item) => item.id !== option?.id)
        })
        if (!clearOnSelect) return
        setValue("");
    }

    useEffect(() => {
        if (data === null)
            setEmpty(true);
        else
            setEmpty(data.length === 0);
    }, [data])
    useEffect(() => {
        setValue("");
        fetchOptions("");
    }, [termId])
    return (
        <Combobox
            width="100%"
            onOptionSubmit={handleOptionSubmit}
            withinPortal={false}
            store={combobox}
            disabled={disabled}
        >
            <Combobox.Target>
                <TextInput
                    disabled={disabled}
                    label="Selecciona la categoría"
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
                    {empty && <Combobox.Empty>No hay resultados</Combobox.Empty>}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );

}

export const AutocompleteTermCategoryAssignment = ({ termId, disabled, onSelect, selectedList = [] }: Omit<AutocompleteTermCategoriesProps, "url" | "clearOnSelect" | "removeOnSelect">) => <AutocompleteTermCategory termId={termId} disabled={disabled} url={`/classes/termsCategories`} onSelect={onSelect} selectedList={selectedList} removeOnSelect={false} clearOnSelect={false} />;
