import { Text } from "@mantine/core";
import { ClassflowPostService, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";


function getCookie(name: string) {
    var match = document.cookie.match(RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
    return match ? match[1] : null;
}
export default function ApplicationWrapper({ ...props }) {
    const [loading, setLoading] = useState(true);
    const onError = () => { }
    const onSuccess = (data: ResponseClassflow<string>) => {

        console.log("TOKEN", data);
    }
    const onSend = () => { }
    const onFinally = () => { }
    const handleSubmit = async () => {
        let get = new ClassflowPostService<string, string, string>("/authorization", {}, "");
        // let res = await axios.post("http://127.0.0.1:8000/authorization",values);
        get.onSend = onSend;
        get.onError = onError;
        get.onSuccess = onSuccess;
        get.onFinally = onFinally;
        await classflowAPI.exec(get);
    }
    useEffect(() => {
        handleSubmit()
    }, [])
    return <Text>Loading...</Text>
    return <Outlet />
}