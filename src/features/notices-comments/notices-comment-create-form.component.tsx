import { Button, Stack, TextInput } from "@mantine/core";
import { NoticeCommentFormProvider, NoticeFormValues, useNoticeCommentForm } from "./notices-comment-create-form.context";
import { executeValidations } from "@validations/exec-validations.validator";
import { isRequired } from "@validations/basic";
import { ClassflowPostService, ResponseClassflow, classflowAPI } from "@services/classflow/classflow";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { NoticeCommentItem, useCommentNoticesDispatch } from "./notices-comment-comments-list.context";

interface NoticeCommentFormProps {
    noticeCommentId?: number,
}

export default function NoticeCommentForm({ noticeCommentId }: NoticeCommentFormProps) {
    const { noticeId } = useParams();
    const [loading, setLoading] = useState(false);
    const dispatch = useCommentNoticesDispatch();
    const form = useNoticeCommentForm({
        initialValues: {
            id: noticeCommentId ? Number(noticeCommentId) : undefined,
            content: ""
        },
        validate: {
            content: (value) => executeValidations<string | undefined>(value, [
                {
                    validator: isRequired,
                    message: "Campo requerido"
                }
            ]),
        }
    })

    const handleSubmit = async () => {
        const onError = () => { }
        const onSuccess = (data: ResponseClassflow<NoticeCommentItem>) => {
            console.log("TOKEN", data);
            if (dispatch) {
                dispatch({
                    type: "add",
                    payload: data.data.data
                })
            }
            form.reset();
        }
        const onSend = () => { setLoading(true) }
        const onFinally = () => { setLoading(false) }
        let hasErrors = form.validate().hasErrors;
        if (hasErrors)
            return;
        let body = { ...form.values, noticeId: Number(noticeId), id: Number(form.values.id) }
        let url = "";
        if (noticeCommentId)
            url = "/notices-comments/edit"
        else
            url = "/notices-comments/create";
        let post = new ClassflowPostService<NoticeFormValues, NoticeCommentItem, string>(url, {}, body);
        post.onSend = onSend;
        post.onError = onError;
        post.onSuccess = onSuccess;
        post.onFinally = onFinally;
        await classflowAPI.exec(post);
    }

    return <NoticeCommentFormProvider form={form}>
        <form onSubmit={form.onSubmit(handleSubmit, (errors) => console.log(errors))}>
            <Stack>
                <TextInput
                    label="Comentario"
                    placeholder="Un comentario..."
                    {...form.getInputProps("content")}
                />
                <div style={{
                    alignSelf: "end"
                }}>
                    <Button onClick={handleSubmit} loading={loading}>Guardar</Button>
                </div>
            </Stack>
        </form>
    </NoticeCommentFormProvider >

}