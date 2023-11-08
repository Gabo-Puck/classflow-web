import TermsTemplateForm from "@features/terms-template/terms-template-create-form.component";
import { Container } from "@mantine/core";

export default function CreateTermTemplate(){
    return <Container  w="100vw" h="100vh" fluid>
        <TermsTemplateForm/>
    </Container>
}