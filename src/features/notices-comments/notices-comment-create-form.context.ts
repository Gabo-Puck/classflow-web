import { createFormContext } from "@mantine/form"
import { JSONContent } from "@tiptap/react";
export interface NoticeFormValues {
    content: string
    id?: number
}

export const [NoticeCommentFormProvider, useNoticeCommentFormContext, useNoticeCommentForm] = createFormContext<NoticeFormValues>();