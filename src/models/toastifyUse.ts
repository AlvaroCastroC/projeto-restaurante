import { toast, ToastPosition } from "react-toastify";

interface NotifyProps {
    message: string,
    specification: ToastPosition
}


export const notifyError = ({ message, specification }: NotifyProps) => {
    toast.error(message, {
        position: specification,
    });

}

export const notifySuccess = ({ message, specification }: NotifyProps) => {
    toast.success(message, {
        position: specification,
    });

}