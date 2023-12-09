import { Button, Group, InputLabel, ScrollArea, Stack, Text, TextInput } from "@mantine/core";
import { GroupClassflow, GroupDetails, GroupFormProvider, GroupFormValues, useGroupForm } from "./group-create-form.context";
import { executeValidations } from "@validations/exec-validations.validator";
import { isRequired, maxLength } from "@validations/basic";
import { ClassflowGetService, ClassflowPostService, ClassflowPutService, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEditor } from "@tiptap/react";
import StarterKit from '@tiptap/starter-kit';
import { RichTextEditor } from '@mantine/tiptap';
import { TextAlign } from '@tiptap/extension-text-align';
import { notifications } from "@mantine/notifications";
import CatalogTitle from "@features/ui/CatalogTitle";
import { OptionType, TransferList } from "@features/ui/transfer-list.component";
import { GroupItem } from "src/types/group";
import { MemberItem } from "@features/class-members/class-members-list.context";
import AvatarClassflow from "@features/ui/avatar.component";


interface GroupMember extends MemberItem {
    GroupDetails: GroupDetails
}

export default function GroupForm() {
    const navigate = useNavigate();
    const { groupId, classId } = useParams();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const form = useGroupForm({
        initialValues: {
            id: groupId ? Number(groupId) : undefined,
            name: ""
        },
        validate: {
            name: (value) => executeValidations<string | undefined>(value, [
                {
                    validator: isRequired,
                    message: "Campo requerido"
                }
            ])
        }
    })

    //0: not selected 1: selected
    const [groupTransferList, setGroupTransferList] = useState<[GroupMember[], GroupMember[]]>([[], []]);

    function DefaultItem({ item }: { item: GroupMember }) {
        return <Group>
            <div>
                <AvatarClassflow img={item.profilePic} />
            </div>
            <div>
                <Text>{item.name}</Text>
                <Text fz="sm" c="dimmed">{item.email}</Text>
            </div>
        </Group>

    }

    useEffect(() => {
        getMembers();
        if (groupId) {
            getMembers();
            return;
        }
    }, [])

    useEffect(() => {
        console.log({
            all: groupTransferList[0],
            selected: groupTransferList[1],
        });
    }, [groupTransferList])

    const getMembers = async () => {
        const onError = () => {
            alert("algo a salido mal");
        }

        const onSuccess = ({ data: { data }, status }: ResponseClassflow<MemberItem[]>) => {

            if (groupId)
                getGroupDetails(data)
            else {
                let newData: GroupMember[] = data.map((m) => ({
                    ...m, GroupDetails: {
                        groupRole: "member",
                        status: "active",
                        user: {
                            ...m
                        }
                    }
                }))
                setGroupTransferList([[...newData], []])
            }
        }
        const onSend = () => {
            setLoading(true);
        }
        const onFinally = () => {
            setLoading(false);
        }
        let url = "/classes/members";
        let get = new ClassflowGetService<null, MemberItem[], string>(url, {});
        get.onSend = onSend;
        get.onError = onError;
        get.onSuccess = onSuccess;
        get.onFinally = onFinally;
        await classflowAPI.exec(get);
    }
    const getGroupDetails = async (classMembers: MemberItem[]) => {
        const onError = () => { }
        const onSuccess = ({ data: { data } }: ResponseClassflow<GroupClassflow>) => {
            let newList: [GroupMember[], GroupMember[]] = [[], []];
            let { GroupDetails, ...resto } = data;
            classMembers.forEach((classMember) => {
                let user = GroupDetails.find(({ user }) => user?.id === classMember.id)
                if (user && user.user) {
                    let { user: userData, ...resto } = user;
                    newList[1].push({
                        ...userData,
                        GroupDetails: resto
                    })
                } else {
                    newList[0].push({
                        ...classMember,
                        GroupDetails: {
                            groupRole: "member",
                            status: "active",
                            user: {
                                ...classMember
                            }
                        }
                    })
                }
            })
            form.setValues(resto)
            setGroupTransferList(newList);
        }
        const onSend = () => { setLoadingData(true) }
        const onFinally = () => { setLoadingData(false) }
        let get = new ClassflowGetService<{}, GroupClassflow, string>(`/groups/${groupId}`, {});
        get.onSend = onSend;
        get.onError = onError;
        get.onSuccess = onSuccess;
        get.onFinally = onFinally;
        await classflowAPI.exec(get);
    }
    const handleSubmit = async () => {
        const onError = () => { }
        const onSuccess = (data: ResponseClassflow<string>) => {
            console.log("TOKEN", data);
            navigate("../");
        }
        const onSend = () => { setLoading(true) }
        const onFinally = () => { setLoading(false) }
        let hasErrors = form.validate().hasErrors;
        if (groupTransferList[1].length < 2) {
            notifications.show({
                message: "Agrega por lo menos 2 integrantes al grupo",
                color: "orange"
            })
            return;
        }
        let groupDetails = groupTransferList[1].map((member) => ({ userId: member.id, groupRole: "MEMBER" }))
        if (hasErrors)
            return;
        let body = { ...form.values, id: Number(form.values.id), GroupDetails: groupDetails }
        let url = "";
        let operation;
        if (groupId) {
            url = "/groups/edit"
            operation = new ClassflowPutService<{
                name: string,
                GroupDetails: GroupDetails[],
            }, string, string>(url, {}, body);
        }
        else{
            url = "/groups/create";
            operation = new ClassflowPostService<{
                name: string,
                GroupDetails: GroupDetails[],
            }, string, string>(url, {}, body);
        }
        operation.onSend = onSend;
        operation.onError = onError;
        operation.onSuccess = onSuccess;
        operation.onFinally = onFinally;
        await classflowAPI.exec(operation);
    }
    if (loadingData) {
        return <Text>Loading...</Text>
    }

    return <GroupFormProvider form={form}>
        <form onSubmit={form.onSubmit(handleSubmit, (errors) => console.log(errors))}>
            <Stack>
                <CatalogTitle title={groupId ? "Editar equipo" : "Crear equipo"} />

                <TextInput
                    label="Nombre"
                    placeholder="Nombre del equipo"
                    {...form.getInputProps("name")}
                />
                <InputLabel>Miembros</InputLabel>
                <TransferList
                    Item={DefaultItem}
                    setTransferList={setGroupTransferList}
                    transferList={groupTransferList}
                    AllListTile={<Text>Todos</Text>}
                    SelectedListTile={<Text>Equipo</Text>}
                />
                <div style={{
                    alignSelf: "end"
                }}>
                    <Button onClick={handleSubmit} loading={loading}>Guardar</Button>
                </div>
            </Stack>
        </form>
    </GroupFormProvider >

}