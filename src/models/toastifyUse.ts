import { toast } from "react-toastify";

export const notifyError = (message: string) => {
    toast.warning(message, {
        position: "top-right",
    });

}


export const notifySuccess = (e: string | undefined) => {
    toast.success(e, {
        position: "top-center",
    });

}