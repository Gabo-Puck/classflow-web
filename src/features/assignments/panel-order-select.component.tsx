import { Combobox, InputBase, Input, useCombobox, Group, Text, ScrollArea } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useQuery } from './assingments-list.context';
import { ClassflowGetService, ResponseClassflow, classflowAPI } from '@services/classflow/classflow';
import { useParams } from 'react-router-dom';
import { ClassItem } from '@features/panel/panel-list.context';

interface Item {
    value: string;
    description?: string;
    label: string;
    type: AssignmentOrderEnum;
}

export const enum AssignmentOrderEnum {
    COMPLETED = 1,
    PENDING,
    NEWEST,
    OLDEST,
    CLASIFICATION
}

const orderOptionsGroupDate: Item[] = [
    { value: "newest", label: 'Más reciente', type: AssignmentOrderEnum.NEWEST },
    { value: "oldest", label: 'Más antiguo', type: AssignmentOrderEnum.OLDEST },
];
const orderOptionsGroupState: Item[] = [
    { value: "completed", label: 'Completadas', type: AssignmentOrderEnum.COMPLETED },
    { value: "pending", label: 'Pendientes', type: AssignmentOrderEnum.PENDING },
];

function SelectOption({ description, label }: Item) {
    return (
        <Group>
            {/* <Text fz={20}>{icon}</Text> */}
            <div>
                <Text fz="sm" fw={500}>
                    {label}
                </Text>
                {description && <Text fz="sm" c="dimmed">{description}</Text>}
            </div>
        </Group>
    );
}

export default function SelectOrderAssignments() {
    let [orderOptionsGroup, setOrderOptionsGroup] = useState([...orderOptionsGroupDate, ...orderOptionsGroupState]);
    const { classId } = useParams();

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const filter = useQuery();
    const [value, setValue] = useState<string | null>(filter?.order.toString() || AssignmentOrderEnum.NEWEST.toString());
    const [selectedOption, setSelectedOption] = useState<Item | undefined>();
    const [orderOptionsGroupCategory, setOrderOptionsGroupCategory] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    if (!filter) {
        throw new Error("SelectOrderAssignments should be used inside a QueryProvider")
    }
    const { setOrder } = filter;

    useEffect(() => {
        if (value) {
            setSelectedOption(orderOptionsGroup.find((item) => item.value === value));
        }
    }, [value])
    useEffect(() => {
        if (selectedOption) {
            let selectedType = orderOptionsGroup.find((item) => item.value === value)
            if (selectedType?.type == AssignmentOrderEnum.CLASIFICATION) {
                setOrder({
                    order: selectedType.type,
                    category: Number(selectedType.value.split("|")[1])
                })
            } else {
                setOrder({
                    order: Number(selectedType?.type)
                });
            }
        } else {
            setOrder({
                order: AssignmentOrderEnum.NEWEST
            });
        }
    }, [selectedOption])
    const handleGetClassDetails = async () => {
        const onError = () => {
            setLoading(false);
        }
        const onSuccess = ({ data, status }: ResponseClassflow<ClassItem>) => {
            let { terms } = data.data;
            let items: Item[] = [];
            terms.forEach((t) => {
                t.termCategories.forEach((tc) => {
                    items.push({
                        label: tc.name,
                        value: `${t.id}|${tc.id.toString()}`,
                        type: AssignmentOrderEnum.CLASIFICATION,
                        description: t.name
                    })
                })
            })
            setOrderOptionsGroup((options) => [...options, ...items])
            setOrderOptionsGroupCategory(items);
        }
        const onSend = () => {
            setLoading(true);
        }
        //get the class general data
        let url = `/classes/${classId}`;
        let get = new ClassflowGetService<null, ClassItem, string>(url, {});
        get.onSend = onSend;
        get.onError = onError;
        get.onSuccess = onSuccess;
        await classflowAPI.exec(get);
    }
    const createGroups = () => {
        handleGetClassDetails();
    }

    useEffect(() => {
        createGroups()
    }, [])

    return (
        <Combobox
            store={combobox}
            withinPortal={false}
            onOptionSubmit={(val) => {
                setValue(val);
                combobox.closeDropdown();
            }}
        >
            <Combobox.Target>
                <InputBase
                    component="button"
                    type="button"
                    pointer

                    rightSection={<Combobox.Chevron />}
                    onClick={() => combobox.toggleDropdown()}
                    rightSectionPointerEvents="none"
                    multiline
                >
                    {selectedOption ? (
                        <SelectOption {...selectedOption} />
                    ) : (
                        <Input.Placeholder>Selecciona un valor</Input.Placeholder>
                    )}
                </InputBase>
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Options>
                    <ScrollArea.Autosize type='scroll' mah={200}>
                        <Combobox.Group label="Fecha">
                            {orderOptionsGroupDate.map((item) => (
                                <Combobox.Option value={item.value} key={item.value} active={value === item.value}>
                                    <SelectOption {...item} />
                                </Combobox.Option>
                            ))}
                        </Combobox.Group>
                        <Combobox.Group label="Estado">
                            {orderOptionsGroupState.map((item) => (
                                <Combobox.Option value={item.value} key={item.value} active={value === item.value}>
                                    <SelectOption {...item} />
                                </Combobox.Option>
                            ))}
                        </Combobox.Group>
                        <Combobox.Group label="Categoria">
                            {orderOptionsGroupCategory.length !== 0 ? orderOptionsGroupCategory.map((item) => (
                                <Combobox.Option value={item.value} key={item.value} active={value === item.value}>
                                    <SelectOption {...item} />
                                </Combobox.Option>
                            )) : <Combobox.Empty>No hay categorías</Combobox.Empty>}
                        </Combobox.Group>
                    </ScrollArea.Autosize>
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}