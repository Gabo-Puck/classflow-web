import { useEffect, useState } from "react";
import ClassCard from "./panel-class-card.component";
import { ClassItem, useClassDispatch, useClasses } from "./panel-list.context"
import { ClassflowGetService, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import axios, { AxiosResponse } from "axios";
import { ROLES, useAuth } from "@features/auth/auth-context";

export default function ClassList() {
    const classes = useClasses();
    const userDate = useAuth();
    const dispatch = useClassDispatch();
    const [loading, setLoading] = useState(true);
    const onError = () => {
        alert("algo a salido mal");
    }
    if (!classes || !dispatch)
        throw new Error("ClassList should be defined as children of ClassProvider")

    const onSuccess = ({ data, status }: ResponseClassflow<ClassItem[]>) => {
        dispatch({
            type: "set",
            payload: data.data
        });
    }
    const onSend = () => {
        setLoading(true);
    }
    const onFinally = () => {
        setLoading(false);
    }
    const getClasses = async () => {
        let url = "";
        console.log({ userDate });
        if (userDate?.role === ROLES.STUDENT)
            url = "/classes/students";
        else
            url = "/classes/professor"
        let get = new ClassflowGetService<null, ClassItem[], string>(url, {
        });
        get.onSend = onSend;
        get.onError = onError;
        get.onSuccess = onSuccess;
        get.onFinally = onFinally;
        await classflowAPI.exec(get);
    }

    useEffect(() => {
        getClasses();
    }, [])
    return <>
        {classes.items.map((c) => <ClassCard item={c} />)}
    </>
}