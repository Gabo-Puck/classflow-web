import { Button, Grid, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ROLES, useRole } from "@features/auth/auth-context";
import { ContextModalProps, modals } from "@mantine/modals";
import SelectModal from "./panel-select-modal.component";


const TestModal = ({ context, id, innerProps }: ContextModalProps<{ modalBody: string }>) => (
    <>
        <Text size="sm">{innerProps.modalBody}</Text>
        <Button fullWidth mt="md" onClick={() => context.closeModal(id)}>
            Close modal
        </Button>
    </>
);
export function ButtonCreateClass() {
    const role = useRole();
    const open = () => {
        modals.open({
            modalId: "options-modal",
            title: "Crear clase",
            children: <SelectModal />,
            style: {
                display: "flex",
                flexDirection: "column"
            },
            styles: {
                content: {
                    display: "flex",
                    flexDirection: "column"
                }
            }
        })
    }


    return <>
        {role === ROLES.PROFESSOR && <>
            <Button onClick={open}>Crear clase</Button>
        </>
        }
    </>
}