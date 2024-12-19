"use client"



import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { NotificantionError } from "./utils";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";
import { notifyError, notifySuccess } from "@/models/toastifyUse";
import { schemaRegister } from "@/models/userSchemaValidation";


export function Register() {


    return (
        <div className="w-full max-w-md ml-auto min-h-screen flex flex-col items-center justify-center bg-slate-400 px-10">

            <h2>Register</h2>

            <Form />

        </div>
    );
}

function Form() {

    const router = useRouter()


    const redirect = () => router.push('/login')

    const { mutate: registe, isPending } = api.userRegister.useMutation({
        onSuccess: (success) => {
            notifySuccess({ message: success!.message, specification: "top-right" })
            setTimeout(redirect, 3000)
        },
        onError(error) {
            notifyError({ message: error!.message, specification: "top-right" })
        }
    });

    type FormDataProps = z.infer<typeof schemaRegister>


    const { handleSubmit, register, formState: { errors, } } = useForm<FormDataProps>({
        mode: 'all',
        reValidateMode: 'onChange',
        resolver: zodResolver(schemaRegister),

    })


    const handleSubmitForm = async (data: FormDataProps) => {
        const { firstName, secondName, email, password } = data
        registe({
            firstName,
            secondName,
            email,
            password,
        })



        return true
    }



    return (
        <form
            onSubmit={handleSubmit(handleSubmitForm)}
            className="flex flex-col gap-5"
        >

            <div className="flex  justify-center gap-4">

                <div>
                    <input
                        type="text"
                        placeholder="Digite seu nome."
                        {...register('firstName')}
                        className="w-full rounded-full px-4 py-2 text-black"
                    />

                    {errors.firstName && NotificantionError(errors.firstName.message!)}
                </div>

                <div>
                    <input
                        type="text"
                        placeholder="Digite seu sobrenome."
                        {...register('secondName')}
                        className="w-full rounded-full px-4 py-2 text-black"
                    />

                    {errors.secondName && NotificantionError(errors.secondName.message!)}
                </div>
            </div>


            <div>
                <input
                    type="email"
                    placeholder="Digite seu e-mail."
                    {...register('email')}
                    className="w-full rounded-full px-4 py-2 text-black"
                />

                {errors.email && NotificantionError(errors.email.message!)}
            </div>

            <div className="flex  justify-center gap-4">
                <div>
                    <input
                        type="password"
                        placeholder="Senha"
                        {...register('password')}
                        className="w-full rounded-full px-4 py-2 text-black"
                    />

                    {errors.password && NotificantionError(errors.password.message!)}
                </div>

                <div>
                    <input
                        type="password"
                        placeholder="Confirme sua senha"
                        {...register('confirmPassword')}
                        className="w-full rounded-full px-4 py-2 text-black"
                    />

                    {errors.confirmPassword && NotificantionError(errors.confirmPassword.message!)}
                </div>
            </div>

            <button
                type="submit"
                className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
                disabled={isPending}
            >
                {isPending ? "Cadastrando..." : "Cadastrar"}
            </button>
        </form>




    )
}

