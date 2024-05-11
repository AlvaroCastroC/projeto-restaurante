import { schemaForgotPassword } from "@/models/userSchemaValidation"
import { api } from "@/utils/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { FC, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from 'react-toastify'
import InputMask from "react-input-mask"
import Link from "next/link"
import { notifyError } from "@/models/toastifyUse"
import { ImBlocked } from "react-icons/im";
import { Collapse, useDisclosure } from '@chakra-ui/react'
import ResetPassword from "./ResetPassword"


interface updateProps { }
const UpdateUser: FC<updateProps> = () => {


    type FormDataProps = z.infer<typeof schemaForgotPassword>

    const { handleSubmit, register, formState: { errors } } = useForm<FormDataProps>({
        mode: 'all',
        reValidateMode: 'onChange',
        resolver: zodResolver(schemaForgotPassword),

    })

    const notifySucces = async () => {
        toast.success("Sucesso, aguarde alguns segundos para atualizar sua senha.", {
            position: "top-right",
        });

    }


    const { mutate: forgotPassword, isSuccess } = api.admin.forgotPassword.useMutation({
        onSuccess: () => {
            setTimeout(onToggle, 3000)
            notifySucces()

        },
        onError(erro) {
            notifyError(erro.message)
        }
    })

    const handleSubmitForm = async (data: FormDataProps) => {
        const { email, phone } = data

        forgotPassword({
            email,
            phone: phone.replace(/\D/g, ""),
        })

        setDesative(true)
    }

    const { isOpen, onToggle, } = useDisclosure()

    const [desative, setDesative] = useState(false)

    return (
        <section className='flex min-h-[110vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>

            <div className='w-full max-w-md space-y-8 hover:shadow-[0_20px_50px_-5px_rgba(0,0,0,0.2)]  py-12 px-7 rounded-md transition ease-in-out duration-700'>
                <div>
                    <img
                        className='mx-auto h-12 w-auto'
                        src='https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg'
                        alt='Workflow'
                    />
                    <h2 className='mt-6 text-center text-3xl font-bold text-gray-900'>Atualize seu cadastro</h2>
                    <p className='mt-2 text-center text-sm text-gray-600'>
                        Ou{' '}
                        <Link href='/login' className='font-medium text-indigo-600 hover:text-indigo-500'>
                            retome a página de logIn
                        </Link>
                    </p>
                </div>
                <form onSubmit={handleSubmit(handleSubmitForm)} className="flex flex-col gap-5">
                    <div>
                        <input
                            id='email-address'
                            type='email'

                            {...register('email')}

                            className='relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                            placeholder='Enderaço de e-mail'
                        />

                        {errors.email && <span className="span-form">{errors.email.message}</span>}


                        <InputMask
                            className='relative block w-full appearance-none  rounded-md  border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'

                            placeholder='Digite seu número de celular'

                            mask="99 99999-9999"
                            maskPlaceholder={null}
                            {...register('phone')}
                        />

                        {errors.phone && <span className="span-form">{errors.phone.message}</span>}
                    </div>
                    <div>
                        <button
                            type='submit'
                            disabled={isSuccess && desative}
                            className='group relative flex w-full justify-center rounded-md border border-transparent disabled:bg-indigo-600 bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>

                            {desative && isSuccess ? <ImBlocked /> : "Enviar"}
                        </button>
                    </div>
                </form>

                <Collapse
                    in={isOpen}

                    transition={{ exit: { delay: 0.5 }, enter: { duration: 0.5 } }}
                >

                    <ResetPassword />


                </Collapse>

            </div>

        </section>
    )
}


export default UpdateUser;