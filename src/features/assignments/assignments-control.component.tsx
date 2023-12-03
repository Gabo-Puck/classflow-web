import { Button, Group, ScrollArea, Stack, Table, Text } from "@mantine/core";
import { ClassflowGetService, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import React, { useEffect, useState } from "react";
import { ROLES, useAuth } from "@features/auth/auth-context";
import { AssignmentItem, AssignmentsProvider, useAssignments, useAssignmentsDispatch } from "./assingments-list.context";
import AvatarClassflow from "@features/ui/avatar.component";
import ListClass, { ActionsElementProps } from "./assignments-list.component";
import { Link } from "react-router-dom";


export default function ClassControl() {
    return <>
        <AssignmentsProvider>
            <Stack>
                <Button component={Link} to="crear" fullWidth>Crear anuncio</Button>
                <ListClass />
            </Stack>
        </AssignmentsProvider>
    </>

}
