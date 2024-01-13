import * as yup from "yup";
import { toast } from "react-toastify";

export const authschema = yup.object().shape({
    name: yup.string().required("Ez mező kötelező!").min(3, "A mezőnek tartalmaznia kell legalább 3 karaktert"),
})


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