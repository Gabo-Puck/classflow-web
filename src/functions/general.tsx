import { IName } from "src/types/Name";
import { IIndexable } from "src/types/interface";

export const generateUniqueName = (base: string, elements: IName[]) => {
    let nombreGenerado = base;
    let contador = 1;

    while (elements.some((elemento) => elemento.name === nombreGenerado)) {
        nombreGenerado = `${base} ${contador}`;
        contador++;
    }

    return nombreGenerado;
};


export const getValueByProp = (obj: Object, path: string) => {
    const stuff = path.split(".");
    let it: Object | undefined = obj;
    stuff.forEach((p) => {
        if (it !== undefined)
            it = (it as IIndexable)[p] as Object | undefined;
    })
    return it;
}


// export default function CreateTermDetails() {
//     const form = useTermTemplateFormContext();
//     const [open, setOpen] = useState<string | null>();
//     const fields = useMemo(() => form.values.termDetails.map((item, index) => (
//         <CreateTerm key={index} render={open === index.toString()} index={index} />)),
//         [open, form.values.termDetails.length]
//     )

//     const handleAdd = () => {
//         form.insertListItem("termDetails", {
//             name: "",
//             value: 0,
//             termTemplateDetailsCategories: []
//         })
//     }

//     return <>
//         <ScrollArea>
//             <Button onClick={handleAdd}>Agregar parcial</Button>
//             <Accordion onChange={(e) => setOpen(e)} loop={false}>
//                 <Stack>
//                     {fields}
//                 </Stack>
//             </Accordion>
//         </ScrollArea>
//     </>
// }