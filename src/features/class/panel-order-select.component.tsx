import { useQuery } from '@features/panel/panel-list.context';
import { Combobox, InputBase, Input, useCombobox, Group, Text } from '@mantine/core';
import { useEffect, useState } from 'react';

interface Item {
    icon: string;
    value: string;
    label: string
}

const orderOptions: Item[] = [
    { icon: '🍎', value: "1", label: 'Más reciente', },
    { icon: '🍌', value: "2", label: 'Más antiguo',  },
    { icon: '🥦', value: "3", label: 'Más tareas', },
];

function SelectOption({ icon, value, label }: Item) {
    return (
        <Group>
            {/* <Text fz={20}>{icon}</Text> */}
            <div>
                <Text fz="sm" fw={500}>
                    {label}
                </Text>
            </div>
        </Group>
    );
}

export default function SelectOrder() {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const [value, setValue] = useState<string | null>("1");
    const [selectedOption, setSelectedOption] = useState<Item | undefined>();
    const filter = useQuery();

    if (!filter) {
        throw new Error("SelectOrder should be used inside a QueryProvider")
    }
    const { setOrder } = filter;

    useEffect(() => {
        if (value) {
            setSelectedOption(orderOptions.find((item) => item.value === value));
        }
    }, [value])
    useEffect(() => {
        if (selectedOption) {
            setOrder(Number(selectedOption.value));
        } else {
            setOrder(0);
        }
    }, [selectedOption])
    const options = orderOptions.map((item) => (
        <Combobox.Option value={item.value} key={item.value} active={value === item.value}>
            <SelectOption {...item} />
        </Combobox.Option>
    ));

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
                <Combobox.Options >{options}</Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}