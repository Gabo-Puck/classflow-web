import { useState } from 'react';
import { IconChevronRight } from '@tabler/icons-react';
import { Combobox, TextInput, useCombobox, Checkbox, ActionIcon, Group } from '@mantine/core';
import classes from './TransferList.module.css';

const fruits = [
    { name: '🍎 Apples' },
    { name: '🍌 Bananas' },
    { name: '🍓 Strawberries' }
];

const vegetables = [
    { name: '🥦 Broccoli' },
    { name: '🥕 Carrots' },
    { name: '🥬 Lettuce' }
];

export interface OptionType {
    name: string
}

interface RenderListProps {
    options: OptionType[];
    onTransfer(options: OptionType[]): void;
    type: 'forward' | 'backward';
    Item: React.ElementType<{ item: OptionType }>
}

function DefaultItem({ item }: { item: OptionType }) {
    return <span>{item.name}</span>

}

function RenderList({ Item = DefaultItem, options, onTransfer, type }: RenderListProps) {
    const combobox = useCombobox();
    const [value, setValue] = useState<OptionType[]>([]);
    const [search, setSearch] = useState('');

    const handleValueSelect = (val: string) =>
        setValue((current) =>
            Boolean(value.find(i => val === i.name)) ? current.filter((v) => v.name !== val) : [...current, {
                name: val
            }]
        );

    const items = options
        .filter((item) => item.name.toLowerCase().includes(search.toLowerCase().trim()))
        .map((item) => (
            <Combobox.Option
                value={item.name}
                key={item.name}
                active={Boolean(value.find(i => item.name === i.name))}
                onMouseOver={() => combobox.resetSelectedOption()}
            >
                <Group gap="sm">
                    <Checkbox
                        checked={Boolean(value.find(i => item.name === i.name))}
                        onChange={() => { }}
                        aria-hidden
                        tabIndex={-1}
                        style={{ pointerEvents: 'none' }}
                    />
                    <Item item={item} />
                </Group>
            </Combobox.Option>
        ));

    return (
        <div className={classes.renderList} data-type={type}>
            <Combobox store={combobox} onOptionSubmit={handleValueSelect}>
                <Combobox.EventsTarget>
                    <Group wrap="nowrap" gap={0} className={classes.controls}>
                        <TextInput
                            placeholder="Search groceries"
                            classNames={{ input: classes.input }}
                            value={search}
                            onChange={(event) => {
                                setSearch(event.currentTarget.value);
                                combobox.updateSelectedOptionIndex();
                            }}
                        />
                        <ActionIcon
                            radius={0}
                            variant="default"
                            size={36}
                            className={classes.control}
                            onClick={() => {
                                onTransfer(value);
                                setValue([]);
                            }}
                        >
                            <IconChevronRight className={classes.icon} />
                        </ActionIcon>
                    </Group>
                </Combobox.EventsTarget>

                <div className={classes.list}>
                    <Combobox.Options>
                        {items.length > 0 ? items : <Combobox.Empty>Nothing found....</Combobox.Empty>}
                    </Combobox.Options>
                </div>
            </Combobox>
        </div>
    );
}

export interface ActionsElementProps<T> extends React.PropsWithChildren {
    data: T;
}

export interface TransferListProps {
    Item?: React.ElementType<{ item: OptionType }>
}


export function TransferList({ Item = DefaultItem }: TransferListProps) {
    const [data, setData] = useState<[OptionType[], OptionType[]]>([fruits, vegetables]);

    const handleTransfer = (transferFrom: number, options: OptionType[]) =>
        setData((current) => {
            const transferTo = transferFrom === 0 ? 1 : 0;
            const transferFromData = current[transferFrom].filter((item) => !options.find(i=>item.name===i.name));
            const transferToData = [...current[transferTo], ...options];

            const result = [];
            result[transferFrom] = transferFromData;
            result[transferTo] = transferToData;
            return result as [OptionType[], OptionType[]];
        });

    return (
        <div className={classes.root}>
            <RenderList
                type="forward"
                options={data[0]}
                onTransfer={(options) => handleTransfer(0, options)}
                Item={Item}
            />
            <RenderList
                type="backward"
                options={data[1]}
                onTransfer={(options) => handleTransfer(1, options)}
                Item={Item}
            />
        </div>
    );
}