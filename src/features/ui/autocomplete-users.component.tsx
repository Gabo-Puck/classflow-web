import { useAuth } from "@features/auth/auth-context";
import { StudentItem } from "@features/class/class-list-students.context";
import { SignupFormProvider } from "@features/signup/signup-form.context";
import { Combobox, TextInput, useCombobox, Loader, Text } from '@mantine/core';
import { notifications } from "@mantine/notifications";
import { ClassflowPostService, ErrorClassflow, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import { useEffect, useRef, useState } from "react";
import { UserItem } from "src/types/user";

interface AutocompleteUsersProps {
    url: string
    onSelect(s: UserItem): void
    selectedList: UserItem[] | null
}

export function AutocompleteUsers({ url, onSelect, selectedList }: AutocompleteUsersProps) {
    const userData = useAuth();
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });
    const [value, setValue] = useState('');
    const [users, setUsers] = useState<StudentItem[] | null>();
    if (!userData)
        throw new Error("Any AutocompleteUsers variant should be defined as children of AuthProvider");

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<UserItem[] | null>(null);
    const [empty, setEmpty] = useState(false);
    const abortController = useRef<AbortController>();

    function getUsers(searchQuery: string, signal: AbortSignal) {

        return new Promise<UserItem[]>(async (resolve, reject) => {
            // signal.addEventListener('abort', () => {
            //     reject(new Error('Request aborted'));
            // });
            const onError = (data: ErrorClassflow<string>) => {
                notifications.show({
                    message: data.response?.data.message,
                    color: "orange"
                })
            }
            const onSuccess = ({ data: { data: results } }: ResponseClassflow<UserItem[]>) => {
                let filteredResults = results.filter((item) => {
                    if (item.email === userData?.email)
                        return false;
                    if (selectedList === null)
                        return true;
                    if (selectedList.find((i) => i.email === item.email)) {
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
            let post = new ClassflowPostService<{ email: string }, UserItem[], string>(url, {
            }, {
                email: searchQuery
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
        <Combobox.Option value={item.email} key={item.email}>
            <Text fz="sm">
                {`${item.name} ${item.lastname}`}
            </Text>
            <Text fz="xs">
                {`${item.email}`}
            </Text>
        </Combobox.Option>
    ));

    const handleOptionSubmit = (optionValue: string) => {
        combobox.closeDropdown();
        if (!data)
            return;
        let option = data.find((item) => item.email === optionValue);
        if (!option)
            return;
        onSelect(option);
        setData((d) => {
            if (!d) return d;
            return d.filter((item) => item.id !== option?.id)
        })
        setValue("");
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
                    label="Selecciona los usuarios"
                    placeholder="Buscar por correo"
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

export const AutcompleteUsersInvite = ({ onSelect, selectedList }: Omit<AutocompleteUsersProps, "url">) => <AutocompleteUsers url="/classes/users/invite" onSelect={onSelect} selectedList={selectedList} />;
