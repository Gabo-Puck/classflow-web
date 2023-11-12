import { Alert, Box, Button, Card, Flex, Grid, Group, NumberInput, ScrollArea, Stack, Tabs, Text, TextInput, Title } from "@mantine/core";
import { TermTemplateDetailProvider, useTermTemplateFormContext } from "./terms-template-form.context"
import CreateTermDetailsCategories from "./terms-template-create-categories-form.component";
import { PropsWithChildren, useMemo, useRef, useState } from "react";
import { IconAlertCircle } from "@tabler/icons-react";
import { generateUniqueName } from "src/functions/general";
import TermsTab from "./terms-template-create-tabs";
import { useShallowEffect } from "@mantine/hooks";
import GradientText from "@features/ui/gradient-text";

interface CustomAccordionProps {
    index: number
}
function CreateTerm({ index }: CustomAccordionProps) {
    const form = useTermTemplateFormContext();
    return <TermTemplateDetailProvider key={index} index={index}>
        <Stack my="md">
            <Card component={Stack}>
                <Title order={3}>Parcial</Title>
                <Grid>
                    <Grid.Col>
                        <TextInput
                            withAsterisk
                            label="Nombre de parcial"
                            {...form.getInputProps(`termDetails.${index}.name`)} />

                    </Grid.Col>
                    <Grid.Col>
                        <NumberInput
                            hideControls
                            withAsterisk
                            label="Valor"
                            {...form.getInputProps(`termDetails.${index}.value`)} />
                    </Grid.Col>
                </Grid>
            </Card>
            <CreateTermDetailsCategories />
        </Stack>


    </TermTemplateDetailProvider>
}

interface CreateTermDetails extends PropsWithChildren {
    onSave: VoidFunction;
    hasErrors?(): boolean;
}

export default function CreateTermDetails({ children, onSave, hasErrors = () => false }: CreateTermDetails) {
    const form = useTermTemplateFormContext();
    const [index, setIndex] = useState<number>(-1);
    const [sum, setSum] = useState<number>(0);
    const handleRemove = (index: number) => {
        form.removeListItem("termDetails", index)
        setIndex((i) => index === i ? index - 1 : i - 1)
    }
    const [loading, setLoading] = useState(false);
    const fields = form.values.termDetails.map((item, index) =>
        <TermsTab
            handleRemove={handleRemove}
            index={index}
            name={item.name}
            key={index}
        />
    )

    const handleAdd = () => {
        let name = generateUniqueName('Parcial', form.values.termDetails)
        form.insertListItem("termDetails", {
            name,
            value: 0,
            termTemplateDetailsCategories: []
        })
        setIndex((index) => index + 1)
    }

    const fields2 = useMemo(
        () => index !== -1 ?
            <Tabs.Panel value={index.toString()} >
                <CreateTerm index={Number(index)} />
            </Tabs.Panel>
            : <></>, [index])

    const handleSubmit = async () => {
        let errors = form.validate();
        let errorsParent = hasErrors();
        if (!errors.hasErrors && !errorsParent) {
            try{
                setLoading(true);
                await onSave();
            }catch(e){
                console.log(e);
            }finally{
                setLoading(false);
            }
        }
    }
    const containerRef = useRef<any>();
    function move(e: React.WheelEvent<HTMLDivElement>) {
        if (e.deltaY > 0) containerRef.current.scrollLeft += 80;
        else containerRef.current.scrollLeft -= 80;
    }
    useShallowEffect(() => {
        let s = form.values.termDetails.reduce(
            (acc, curr) => acc + Number(curr.value), 0);
        setSum(s);
    }, [form.values.termDetails])
    return <>
        <Tabs styles={{
            root: {
                height: "100%",
                display: "flex",
                flexDirection: "column"
            }
        }} variant="default" value={index.toString()} keepMounted={false} onChange={(e) => { setIndex(Number(e)) }} defaultValue={"0"}>
            <ScrollArea styles={{
                root: {
                    height: "100%"
                }
            }} offsetScrollbars>
                <div style={{
                    flex: 0
                }}>
                    <Stack>
                        {children}
                        {form.errors[`sum`] && <Alert variant="light" color="orange.5" title="Atención" icon={<IconAlertCircle />}>
                            {form.errors[`sum`]}
                        </Alert>}
                        <Flex justify="space-between">
                            <Button onClick={handleAdd}>Agregar parcial</Button>
                            <Group>
                                <Text>Total: </Text>
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

                            </Group>
                        </Flex>

                        <ScrollArea scrollbarSize={2} offsetScrollbars viewportRef={containerRef} onWheel={move}>
                            <Tabs.List style={{
                                flexWrap: "nowrap"
                            }}>
                                {fields}
                            </Tabs.List>
                        </ScrollArea>
                    </Stack>
                </div>

                <Box>
                    {fields2}
                </Box>
            </ScrollArea>
            <Flex py="sm" justify="end">
                <Button onClick={handleSubmit} loading={loading} disabled={
                    form.values.termDetails.length === 0
                }>Guardar</Button>
            </Flex>
        </Tabs>
    </>
}