import { FC } from "react";
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import Link from "next/link";
import { api } from "@/utils/api";
import { toast } from "react-toastify";
import { schemaRegister } from "@/models/userSchemaValidation";
import InputMask from "react-input-mask"
import { notifyError } from "@/models/toastifyUse";
import { useRouter } from "next/router";

const register: FC = () => {
    const router = useRouter()


    const redirect = () => router.push('/dashboard')

    const notifySuccess = () => {
        toast.success("Cadastro feito com sucesso!", {
            position: "top-center"
        });

    }

    type FormDataProps = z.infer<typeof schemaRegister>

    const { handleSubmit, register, formState: { errors } } = useForm<FormDataProps>({
        mode: 'all',
        reValidateMode: 'onChange',
        resolver: zodResolver(schemaRegister),

    })


    const { mutate: registerUser } = api.admin.registerUser.useMutation({
        onSuccess: () => {
            notifySuccess()
            setTimeout(redirect, 3000)
        },

        onError(erro) {
            notifyError(erro.message)
        },
    })


    const handleSubmitForm = (data: FormDataProps) => {
        const { firstName, secondName, email, phone, password, role } = data

        registerUser({
            email,
            firstName,
            secondName,
            phone: phone.replace(/\D/g, ""),
            password,
            role,



        })
    }


    return (

        <section className='flex min-h-[90vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
            <div className='w-full max-w-md min-h-[70vh]  space-y-8 hover:shadow-[0_20px_50px_-5px_rgba(0,0,0,0.2)]  py-12 px-7 rounded-md transition ease-in-out duration-700'>
                <div>

                    <img
                        className='mx-auto h-12 w-auto'
                        src='https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg'
                        alt='Workflow'
                    />
                    <h2 className='mt-6 text-center text-3xl font-bold text-gray-900'>Cadastre sua nova conta</h2>
                    <p className='mt-2 text-center text-sm text-gray-600'>
                        Ou{' '}
                        <Link href='/login' className='font-medium text-indigo-600 hover:text-indigo-500'>
                            faça o login
                        </Link>
                    </p>

                </div>
                <form className='mt-8 space-y-6' onSubmit={handleSubmit(handleSubmitForm)} >

                    <input type='hidden' name='remember' defaultValue='true' />

                    <div className='-space-y-px rounded-md shadow-sm  '>

                        <p className='pb-1 text-sm text-red-600'></p>

                        <div className="flex">

                            <label htmlFor='name' className='sr-only'>
                                Digite seu primeiro nome
                            </label>
                            <input
                                id='name'

                                type="text"

                                {...register('firstName')}

                                className='relative block w-full appearance-none rounded-md rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                                placeholder='Digite seu nome'
                            />
                            {errors.firstName && <span className="span-form">{errors.firstName.message}</span>}

                            <label htmlFor='name' className='sr-only'>
                                Digite seu sobrenome
                            </label>
                            <input
                                id='name'

                                type="text"

                                {...register('secondName')}

                                className='relative block w-full appearance-none rounded-md rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                                placeholder='Digite seu nome'
                            />
                            {errors.secondName && <span className="span-form">{errors.secondName.message}</span>}
                        </div>

                        <div>
                            <label htmlFor='email-address' className='sr-only'>
                                Enderaço de e-mail
                            </label>
                            <input
                                id='email-address'
                                type='text'
                                {...register('email')}

                                autoComplete='email'
                                className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                                placeholder='Digite seu email'
                            />

                            {errors.email && <span className="span-form">{errors.email.message}</span>}
                        </div>

                        <div>
                            <label htmlFor='phone' className='sr-only'>
                                Informe seu Número
                            </label>
                            <InputMask
                                className='relative block w-full appearance-none rounded-md  border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'

                                placeholder='Digite seu número de celular'

                                mask="99 99999-9999"
                                maskPlaceholder={null}
                                {...register('phone')}
                            />
                            {errors.phone && <span className="span-form">{errors.phone.message}</span>}

                        </div>


                        <div className="flex">
                            <div >
                                <label htmlFor='password' className='sr-only'>
                                    Senha
                                </label>
                                <input
                                    id='password'
                                    type='password'
                                    {...register('password')}

                                    autoComplete='current-password'

                                    className='relative block w-full appearance-none rounded-md rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                                    placeholder='Senha de 6 digitos'
                                />
                                {errors.password && <span className="span-form">{errors.password.message}</span>}

                            </div>

                            <div>

                                <label htmlFor='confirmPassword' className='sr-only'>
                                    Confirme sua senha
                                </label>
                                <input
                                    id='confirmPassword'
                                    type='password'

                                    {...register('confirmPassword')}

                                    className='relative block w-full appearance-none rounded-md rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                                    placeholder='Confirme sua senha'
                                />

                                {errors.confirmPassword && <span className="span-form">{errors.confirmPassword.message}</span>}

                            </div>
                        </div>

                        <div>
                            <label htmlFor='role' className='sr-only'>
                                Informe o código
                            </label>
                            <input
                                id='role'
                                type='text'
                                {...register('role')}
                                className='relative block w-full appearance-none rounded-md rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                                placeholder='Digite o codigo de válidação'
                            />

                            {errors.role && <p className="span-form">{errors.role?.message}</p>}

                        </div>
                    </div>

                    <div>
                        <button
                            type='submit'

                            className='group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>

                            Sign in
                        </button>
                    </div>
                </form>

            </div>
        </section>

    )

}
export default register;