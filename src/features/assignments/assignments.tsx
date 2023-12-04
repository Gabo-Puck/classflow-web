import { useTabsClassBoard, useTabsClassboardDispatch } from "@features/class-board/class-navigation-tabs.context";
import { Button } from "@mantine/core";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Assignments() {

    return <div style={{ flex: 1 }}>
        <Button component={Link} to="crear" fullWidth>Crear tarea</Button>
    </div>

}