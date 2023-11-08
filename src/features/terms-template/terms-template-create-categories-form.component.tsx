import { Alert, Button, Card, Grid, NumberInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { useTermTemplateDetail, useTermTemplateFormContext } from "./terms-template-form.context"
import { useState } from "react";
import DeleteButton from "@features/ui/DeleteButton";
import { generateUniqueName } from "src/functions/general";
import { useShallowEffect } from "@mantine/hooks";
import { IconAlertCircle } from "@tabler/icons-react";
import GradientText from "@features/ui/gradient-text";



export default function CreateTermDetailsCategories({ }) {
    const form = useTermTemplateFormContext();
    const termTemplateState = useTermTemplateDetail();
    if (termTemplateState === undefined)
        throw new Error("CreateTermDetailsCategories should be defined as children of TermTemplateDetailProvider")
    const { index: termTemplateIndex } = termTemplateState;
    const [sum, setSum] = useState(0);

    const fields = form.values.termDetails[termTemplateIndex].termTemplateDetailsCategories.map((element, index) => (
        <Grid key={index} align="start">
            <Grid.Col span={7}>
                <TextInput
                    label="Nombre"
                    multiline
                    withAsterisk
                    style={{ flex: 1 }}
                    {...form.getInputProps(`termDetails.${termTemplateIndex}.termTemplateDetailsCategories.${index}.name`)} />
            </Grid.Col>
            <Grid.Col span={3}>
                <NumberInput
                    clampBehavior="strict"
                    min={0}
                    max={100}
                    hideControls
                    label="Valor"
                    withAsterisk
                    allowLeadingZeros={false}
                    allowDecimal={false}
                    allowNegative={false}
                    {...form.getInputProps(`termDetails.${termTemplateIndex}.termTemplateDetailsCategories.${index}.value`)} />
            </Grid.Col>
            <Grid.Col span={2} pos="relative">
                <div style={{
                    position: "absolute",
                    top: "326%",
                    left: "20%",
                    transform: "translate(-50%, -50%)"
                }}>
                    <DeleteButton onClick={() => handleRemove(index)} />
                </div>


            </Grid.Col>
        </Grid>

    ));
    useShallowEffect(() => {
        let s = form.values.termDetails[termTemplateIndex].termTemplateDetailsCategories.reduce(
            (acc, curr) => acc + Number(curr.value), 0);
        setSum(s);
    }, [form.values.termDetails[termTemplateIndex].termTemplateDetailsCategories])

    const handleAdd = () => {
        let name = generateUniqueName('Categoria', form.values.termDetails[termTemplateIndex].termTemplateDetailsCategories)
        form.insertListItem(`termDetails.${termTemplateIndex}.termTemplateDetailsCategories`, {
            name: name,
            value: 0
        })
    }
    const handleRemove = (index: number) => {
        form.removeListItem(`termDetails.${termTemplateIndex}.termTemplateDetailsCategories`, index)
    }
    return <>
        <Card>
            <Stack>
                <Title order={3}>Encuadre</Title>
                <div>
                    <Button onClick={handleAdd}>Agregar categoría</Button>
                </div>
                
                {form.errors[`termDetails.${termTemplateIndex}.sum`] && <Alert variant="light" color="orange.5" title="Atención" icon={<IconAlertCircle />}>
                    {form.errors[`termDetails.${termTemplateIndex}.sum`]}
                </Alert>}

                {fields}
                <Grid align="flex-start">
                    <Grid.Col span={7} >
                        <Text ta="end">
                            Total
                        </Text>
                    </Grid.Col>
                    <Grid.Col span={3}>
                        <GradientText
                            gradientText={sum.toString()}
                            gradient={[
                                {
                                    condition: sum > 100,
                                    color: "red"
                                },
                                {
                                    condition: sum === 100,
                                    color: "green"
                                },
                                {
                                    condition: sum < 100,
                                    color: "yellow"
                                }
                            ]} />
                    </Grid.Col>
                </Grid>
            </Stack>
        </Card >
    </>
}