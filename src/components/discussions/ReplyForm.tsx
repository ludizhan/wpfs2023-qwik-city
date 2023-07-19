import { component$, $ } from '@builder.io/qwik';
import { z } from "@builder.io/qwik-city";
import {
    useForm,
    zodForm$,
    formAction$,
    SubmitHandler,
} from '@modular-forms/qwik';
import { useFormLoader } from "~/routes/discussions/[id]/index";


const formSchema = z.object({
    comment: z
        .string()
        .trim()
        .min(1, 'Please enter a valid comment.'),
});

export declare type ReplyFormType = z.infer<typeof formSchema>;

export const useFormAction = formAction$<ReplyFormType>((values) => {
    // Runs on server
}, zodForm$(formSchema));

export default component$(() => {
    const [replyForm, { Form, Field }] = useForm<ReplyFormType>({
        loader: useFormLoader(),
        action: useFormAction(),
        validate: zodForm$(formSchema),
    });

    const handleSubmit: SubmitHandler<ReplyFormType> = $((values: any, _event: any) => {
        // Runs on client
        // TODO: handle submit for comments
        console.log(values);
    });

    return (
        <Form onSubmit$={handleSubmit}>
            <Field name="comment" type='string'>
                {(field, props) => (
                    <div>
                        <input {...props} type="comment" value={field.value} id='comment-div'/>
                        {field.error && <div>{field.error}</div>}
                    </div>
                )}
            </Field>
            <button type="submit">Comment</button>
        </Form>);
});