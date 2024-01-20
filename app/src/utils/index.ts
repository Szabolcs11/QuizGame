import * as yup from "yup";
import { toast } from "react-toastify";

export const authschema = yup.object().shape({
    name: yup.string().required("Ez mező kötelező!").min(3, "A mezőnek tartalmaznia kell legalább 3 karaktert"),
})

export const createLobbySchema = yup.object().shape({
    name: yup.string().required("Ez mező kötelező!").min(1, "A mezőnek tartalmaznia kell legalább 5 karaktert"),
})

export const addQuestionSchema = yup.object().shape({
    question: yup.string().required("Ez mező kötelező!").min(5, "A mezőnek tartalmaznia kell legalább 5 karaktert"),
    answera: yup.string().required("Ez mező kötelező!").min(1, "A mezőnek tartalmaznia kell legalább 1 karaktert"),
    answerb: yup.string().required("Ez mező kötelező!").min(1, "A mezőnek tartalmaznia kell legalább 1 karaktert"),
    answerc: yup.string().required("Ez mező kötelező!").min(1, "A mezőnek tartalmaznia kell legalább 1 karaktert"),
    answerd: yup.string().required("Ez mező kötelező!").min(1, "A mezőnek tartalmaznia kell legalább 1 karaktert"),
    questiontype: yup.string().required("Ez mező kötelező!"),
    correctanswer: yup.string().required("Ez mező kötelező!"),
});

const toastTypes = {
    Success: toast.success,
    Error: toast.error,
    Warning: toast.warning,
    Info: toast.info
}

type ToastType = 'Success' | 'Error' | 'Warning' | 'Info';

export const showToast = (type: ToastType, message: string) => {
    const toaster = toastTypes[type];
    toaster(message)
}