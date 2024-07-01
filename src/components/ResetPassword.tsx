import { schemaResetPassword } from "@/models/userSchemaValidation"
import { api } from "@/utils/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { FC } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from 'react-toastify'
import { notifyError } from "@/models/toastifyUse"
import { useRouter } from "next/router"
import { Flex, FormControl, FormLabel, Input, } from "@chakra-ui/react"




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


    const { mutate: resetPassword } = api.createUser.resetPassword.useMutation({
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
                <FormControl minWidth={"500px"}>
                    <div>
                        <FormLabel htmlFor="token">Token de verificação</FormLabel>
                        <Input
                            id='token'
                            type='text'

                            {...register('token')}

                            className='relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                            placeholder='Ex.: KsxDss'
                        />
                        {errors.token && <span className="span-form">{errors.token.message}</span>}

                    </div>

                    <div>
                        <FormLabel htmlFor="email-address">Digite seu novo e-mail</FormLabel>
                        <Input
                            id='email-address'
                            type='email'

                            {...register('email')}

                            className='relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                            placeholder='exemple@email.com'
                        />

                        {errors.email && <span className="span-form">{errors.email.message}</span>}



                    </div>

                    <Flex gap={2} >
                        <Flex direction={"column"} width={"100%"}>
                            <FormLabel htmlFor="password">Digite sua nova senha</FormLabel>
                            <Input
                                id='password'
                                type='password'

                                {...register('password')}

                                placeholder="******"
                            />

                            {errors.password && <span className="span-form">{errors.password.message}</span>}
                        </Flex>

                        <Flex direction={"column"} width={"100%"}>
                            <FormLabel htmlFor="ConfirmPassword">Confirme sua nova senha</FormLabel>
                            <Input
                                id='ConfirmPassword'
                                type='Password'

                                {...register('confirmPassword')}


                                placeholder='******'
                            />

                            {errors.confirmPassword && <span className="span-form">{errors.confirmPassword.message}</span>}

                        </Flex>
                    </Flex>
                </FormControl>
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