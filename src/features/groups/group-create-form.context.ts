import { MemberItem } from "@features/class-members/class-members-list.context";
import { createFormContext } from "@mantine/form"
import { JSONContent } from "@tiptap/react";
import { UserItem } from "src/types/user";
export interface GroupFormValues {
    id?: number
    name: string
}

export interface GroupDetails  {
    joinedAt?: Date
    groupRole: GroupRoles
    status: Status
    user?: MemberItem
}

export interface GroupClassflow extends Required<GroupFormValues>{
    GroupDetails: GroupDetails[]
}


type GroupRoles = "member" | "mod" | "prof"
type Status = "active" | "banned"



export const [GroupFormProvider, useGroupFormContext, useGroupForm] = createFormContext<GroupFormValues>();