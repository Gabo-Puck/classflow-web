import { OptionType } from "@features/ui/transfer-list.component";

export interface UserItem extends OptionType {
    lastname: string;
    profilePic: string;
    email: string
}