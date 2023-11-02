import { createFormContext } from "@mantine/form"
import { JSONContent } from "@tiptap/react";
export interface NoticeFormValues {
    title: string,
    content: JSONContent[] | null
    id?: number
    creatorId?: number
}

export const [NoticeFormProvider, useNoticeFormContext, useNoticeForm] = createFormContext<NoticeFormValues>();