import { ScrollArea, Stack, Table, Text } from "@mantine/core";
import { ClassflowGetService, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import React, { useEffect, useState } from "react";
import { ROLES, useAuth } from "@features/auth/auth-context";
import { StudentItem, useStudents, useStudentsDispatch } from "./class-list-students.context";
import AvatarClassflow from "@features/ui/avatar.component";


export interface ActionsElementProps extends React.PropsWithChildren {
    student: StudentItem;
    index: number
}

export interface ListStudentsProps {
    Element?: React.ComponentType<ActionsElementProps>
}

export default function ListStudents({ Element }: ListStudentsProps) {
    const students = useStudents();
    const dispatch = useStudentsDispatch();

    if (!students || !dispatch)
        throw new Error("ListStudents should be defined as children of ListStudents")

    if (students.items === null) {
        return <Text>Loading...</Text>
    }
    const rows = students.items.map((element, index) => (
        <Table.Tr key={element.id}>
            <Table.Td><AvatarClassflow img={element.profilePic} /></Table.Td>
            <Table.Td>
                <Stack gap="xs">
                    <Text fz="sm">
                        {`${element.name.trim()} ${element.lastname.trim()}`}
                    </Text>
                    <Text fz="xs">
                        {element.email}
                    </Text>

                </Stack>
            </Table.Td>
            {Element && <Table.Td>
                <Element index={index} student={element} />
            </Table.Td>}
        </Table.Tr>
    ));
    const ths = (
        <Table.Tr>
            <Table.Th></Table.Th>
            <Table.Th>Nombre</Table.Th>
            {Element && <Table.Th>Controles</Table.Th>}
        </Table.Tr>
    );

    return <>
        <ScrollArea style={{
            flex: 1
        }}>
            <Table captionSide="top">
                <Table.Thead>{ths}</Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </ScrollArea>
    </>

}
