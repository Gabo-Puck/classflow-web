import { AutocompleteTerms, AutocompleteTermsTemplate } from "@features/ui/autocomplete-template-terms.component";
import RadioOption from "@features/ui/radio-option";
import { Button, Flex, Grid, Modal, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconDirectionSignFilled, IconTemplate } from "@tabler/icons-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const Options = {
    "use-template": 1,
    "no-template": 2
}

function SelectTemplateModal() {
    const [value, setValue] = useState(-1);
    const handleClick = () => {
        modals.closeAll();
    }
    return <>
        <Stack h="45vh" justify="center">
            <AutocompleteTermsTemplate selectedList={[]} onSelect={(s) => setValue(s.id as number)} />
        </Stack>
        <Flex justify="end">
            <Button m="sm" onClick={() => { modals.close("select-template") }}>Atrás</Button>
            <Button m="sm" component={Link} to={`/app/clase/crear?template=${value}`} onClick={handleClick} disabled={value === -1}>Siguiente</Button>
        </Flex>
    </>
}


export default function SelectModal() {
    const [value, setValue] = useState(0);
    const navigate = useNavigate();
    const handleClick = () => {
        if (value === Options["use-template"]) {
            modals.open({
                title: "hoe",
                modalId: "select-template",
                id: "select-template",
                itemID: "select-template",
                children: <SelectTemplateModal />

            })
            return;
        }
        navigate(`/app/clase/crear`);
        modals.closeAll();
    }
    return <>
        <Stack h="45vh" justify="center">
            <Grid p={0} m={0}>
                <Grid.Col span={6}>
                    <RadioOption
                        propsRadio={{
                            value: Options["use-template"],
                            checked: value === Options["use-template"]
                        }}
                        propsButton={{
                            onClick: () => setValue(Options["use-template"])
                        }}
                        title="Usar plantilla"
                        description="Usa una de las plantillas parciales que ya haz creado"
                        Icon={<IconTemplate />}
                    />

                </Grid.Col>

                <Grid.Col span={6}>
                    <RadioOption
                        propsRadio={{
                            value: Options["no-template"],
                            checked: value === Options["no-template"]
                        }}
                        propsButton={{
                            onClick: () => setValue(Options["no-template"])

                        }}
                        title="No usar plantilla"
                        description="Crea tu clase desde cero"
                        Icon={<IconDirectionSignFilled />}
                    />
                </Grid.Col>
            </Grid>
        </Stack>
        <Flex justify="end">
            <Button m="sm" onClick={() => { modals.close("options-modal")  }}>Cerrar</Button>
            <Button m="sm" onClick={handleClick} disabled={value === 0}>Siguiente</Button>
        </Flex>
    </>
}