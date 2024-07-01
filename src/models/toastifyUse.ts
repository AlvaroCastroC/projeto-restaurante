import { toast } from "react-toastify";

export const notifyError = (message: string) => {
    toast.error(message, {
        position: "top-right",
    });

}


export const notifySuccess = (message: string | undefined) => {
    toast.success(message, {
        position: "top-center",
    });

}

export const notifyWarning = (message: string | undefined) => {
    toast.warning(message, {
        position: "top-center",
    });

}

export const notifyPromise = (tipo: string, message: string, success: boolean) => {
    const resolveOrReject = new Promise((resolve, reject) => success ? setTimeout(resolve, 2000) : setTimeout(reject, 2000))

    if (tipo === "create") {
        toast.promise(
            resolveOrReject,
            {
                pending: 'Criando serviço.',
                success: message,
                error: message,

            },
            {
                autoClose: 1000,
            }
        )
    } else if (tipo === "deleteAll") {
        toast.promise(
            resolveOrReject,
            {
                pending: 'Excuindo, aguarde alguns segundos.',
                success: message,
                error: message,

            },
            {
                autoClose: 1000
            }

        )
    } else {
        toast.promise(
            resolveOrReject,
            {
                pending: 'Aguarde.',
                success: message,
                error: message,

            },
            {
                autoClose: 1000
            }
        )
    }
}