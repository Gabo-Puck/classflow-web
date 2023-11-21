import { FormTemplate } from "@features/forms-template/forms-template-form.context";
import { ButtonAddForm, ButtonAddFormProps } from "./assignment-create-form.component";



export default function AssignmentAddForm({ enableForm, setEnableForm }: ButtonAddFormProps) {
    return <ButtonAddForm enableForm={enableForm} setEnableForm={setEnableForm} />
}