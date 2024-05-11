import { schemaResetPassword } from "@/models/userSchemaValidation"
import { api } from "@/utils/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { FC } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from 'react-toastify'
import { notifyError } from "@/models/toastifyUse"
import { useRouter } from "next/router"




interface updateProps { }
const ResetPassword: FC<updateProps> = () => {


    const router = useRouter()


    const redirect = () => router.push('/dashboard')


    type FormDataProps = z.infer<typeof schemaResetPassword>

    const { handleSubmit, register, formState: { errors } } = useForm<FormDataProps>({
        mode: 'all',
        reValidateMode: 'onChange',
        resolver: zodResolver(schemaResetPassword),

    })

    const notifySucces = async () => {
        toast.success("Atualizção da senha feita com sucesso!", {
            position: "top-right",
        });

    }


    const { mutate: resetPassword } = api.admin.resetPassword.useMutation({
        onSuccess: () => {
            setTimeout(redirect, 3000)
            notifySucces()

        },
        onError(erro) {
            if (erro.data?.httpStatus ===
                401) {
                location.reload()
            }
            notifyError(erro.message)
        }
    })

    const handleSubmitForm = async (data: FormDataProps) => {
        const { email, password, token } = data

        resetPassword({
            email, password, token

        })
    }


    return (
        <div >
            <form onSubmit={handleSubmit(handleSubmitForm)} className="flex flex-col gap-5">
                <div>
                    <div>
                        <input
                            id='token'
                            type='text'

                            {...register('token')}

                            className='relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                            placeholder='Digite seu token'
                        />
                        {errors.token && <span className="span-form">{errors.token.message}</span>}

                    </div>

                    <div>
                        <input
                            id='email'
                            type='email'

                            {...register('email')}

                            className='relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                            placeholder='Enderaço de e-mail'
                        />

                        {errors.email && <span className="span-form">{errors.email.message}</span>}



                    </div>

                    <div>
                        <input
                            id='password'
                            type='password'

                            {...register('password')}

                            className='relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                            placeholder='Digite sua senha nova'
                        />

                        {errors.password && <span className="span-form">{errors.password.message}</span>}

                        <input
                            id='ConfirmPassword'
                            type='Password'

                            {...register('confirmPassword')}

                            className='relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                            placeholder='Confirme sua senha'
                        />

                        {errors.confirmPassword && <span className="span-form">{errors.confirmPassword.message}</span>}

                    </div>
                </div>
                <div>
                    <button
                        type='submit'

                        className='group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>

                        Alterar
                    </button>
                </div>
            </form>

        </div>
    )
}

export default ResetPassword;