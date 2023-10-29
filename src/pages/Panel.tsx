

import LoginForm from "@features/login/login-form.component";
import PanelControls from "@features/panel/panel-controls.component";
import SelectOrder from "@features/panel/panel-order-select.component";
import { Card, Center, Container } from "@mantine/core";




export default function Panel() {
    return <Container w="100vw" h="100vh" fluid>
            <PanelControls />
        </Container>
   
}