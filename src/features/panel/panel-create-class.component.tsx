import { Button, Modal, PinInput, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { ClassflowPostService, ErrorClassflow, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import { useState } from "react";
import { ClassItem, useClassDispatch, useClasses } from "./panel-list.context";
import { useForm } from "@mantine/form";
import { executeValidations } from "@validations/index";
import { exactLength } from "@validations/basic";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { ROLES, useRole } from "@features/auth/auth-context";
import { Link } from "react-router-dom";


export function ButtonCreateClass() {
    const role = useRole();
    return <>
        {/* render only for professor */}
        {role === ROLES.PROFESSOR && <>
            <Button component={Link} to="/app/clase/crear">Crear clase</Button>
        </>
        }
    </>
}