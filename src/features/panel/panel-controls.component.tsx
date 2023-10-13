
import { ClassesProvider } from "./panel-list.context";
import ClassList from "./panel-class-list.component";


export default function PanelControls() {
    return <ClassesProvider>
        <ClassList />
    </ClassesProvider>
}