import { createFormContext } from "@mantine/form"
import { JSONContent } from "@tiptap/react";
import { UserItem } from "src/types/user";
export interface GroupFormValues {
    id?: number
    name: string
    GroupDetails: GroupDetails[]
}

export interface GroupDetails {
    user: UserItem
    joinedAt: Date
    groupRole: GroupRoles
    status: Status
}

type GroupRoles = "member" | "mod" | "prof"
type Status = "member" | "mod" | "prof"



export const [GroupFormProvider, useGroupFormContext, useGroupForm] = createFormContext<GroupFormValues>();