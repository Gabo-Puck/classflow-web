import React, { SetStateAction, useState } from 'react';
import { IconChevronRight } from '@tabler/icons-react';
import { Combobox, TextInput, useCombobox, Checkbox, ActionIcon, Group, Grid } from '@mantine/core';
import classes from './TransferList.module.css';


export interface OptionType {
    id: number
    name: string

}

interface RenderListProps<T extends OptionType> {
    options: T[];
    onTransfer(options: T[]): void;
    type: 'forward' | 'backward';
    Item: React.ElementType<{ item: T }>
    placeholder: string
}

function DefaultItem({ item }: { item: OptionType }) {
    return <span>{item.name}</span>

}

function RenderList<T extends OptionType>({ Item = DefaultItem, options, onTransfer, type, placeholder = "Buscar" }: RenderListProps<T>) {
    const combobox = useCombobox();
    const [value, setValue] = useState<T[]>([]);
    const [search, setSearch] = useState('');

    const handleValueSelect = (val: string) =>
        setValue((current) => {
            let newList = [];
            let itemFound = value.find(i => Number(val) === i.id);
            let optionFound = options.find(i => Number(val) === i.id);
            if (Boolean(itemFound))
                newList = current.filter((v) => v.id !== Number(val))
            else
                newList = [...current, { ...itemFound, ...optionFound }]
            return newList as T[]
        }
        );

    const items = options
        .filter((item) => item.name.toLowerCase().includes(search.toLowerCase().trim()))
        .map((item) => (
            <Combobox.Option
                value={String(item.id)}
                key={item.id}
                active={Boolean(value.find(i => item.id === i.id))}
                onMouseOver={() => combobox.resetSelectedOption()}
            >
                <Group gap="sm">
                    <Checkbox
                        checked={Boolean(value.find(i => item.id === i.id))}
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
        <div className={classes.renderList} data-type={type} style={{
            display: "flex",
            flexDirection: "column",
            height: "100%"
        }}>
            <Combobox store={combobox} onOptionSubmit={handleValueSelect}>
                <Combobox.EventsTarget>
                    <Group wrap="nowrap" gap={0} className={classes.controls}>
                        <TextInput
                            w="100%"
                            placeholder={placeholder}
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
                            disabled={items.length === 0 || value.length === 0}
                            onClick={() => {
                                onTransfer(value);
                                setValue([]);
                            }}
                        >
                            <IconChevronRight className={classes.icon} />
                        </ActionIcon>
                    </Group>
                </Combobox.EventsTarget>

                <div className={classes.list} style={{ flex: 1 }}>
                    <Combobox.Options>
                        {items.length > 0 ? items : <Combobox.Empty>No hay resultados....</Combobox.Empty>}
                    </Combobox.Options>
                </div>
            </Combobox>
        </div>
    );
}

export interface ActionsElementProps<T> extends React.PropsWithChildren {
    data: T;
}

export interface TransferListProps<T extends OptionType> {
    Item?: React.ElementType<{ item: T }>
    transferList: [T[], T[]]
    setTransferList: React.Dispatch<SetStateAction<[T[], T[]]>>
    placeholder?: string
    AllListTile: React.ReactNode
    SelectedListTile: React.ReactNode
}


export function TransferList<T extends OptionType>(
    {
        AllListTile,
        SelectedListTile,
        placeholder = "Buscar",
        Item = DefaultItem,
        setTransferList,
        transferList }: TransferListProps<T>) {

    const handleTransfer = (transferFrom: number, options: T[]) =>
        setTransferList((current) => {
            const transferTo = transferFrom === 0 ? 1 : 0;
            const transferFromData = current[transferFrom].filter((item) => !options.find(i => item.id === i.id));
            const transferToData = [...current[transferTo], ...options];

            const result = [];
            result[transferFrom] = transferFromData;
            result[transferTo] = transferToData;
            return result as [T[], T[]];
        });

    return (
        <Grid w="100%" h="100%">
            <Grid.Col span={6} style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ flex: 0 }}>
                    {AllListTile}
                </div>
                <div style={{ flex: 1 }}>
                    <RenderList
                        type="forward"
                        options={transferList[0]}
                        onTransfer={(options) => handleTransfer(0, options)}
                        Item={Item}
                        placeholder={placeholder}
                    />
                </div>
            </Grid.Col>
            <Grid.Col span={6} style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ flex: 0 }}>
                    {SelectedListTile}
                </div>
                <div style={{ flex: 1 }}>
                    <RenderList
                        type="backward"
                        options={transferList[1]}
                        onTransfer={(options) => handleTransfer(1, options)}
                        Item={Item}
                        placeholder={placeholder}
                    />
                </div>

            </Grid.Col>
        </Grid>

    );
}