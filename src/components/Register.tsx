import { FC } from "react";
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { toast } from "react-toastify";
import { schemaRegister } from "@/utils/validationUser";


const register: FC = () => {

    const router = useRouter()

    const redirect = () => router.push('/dashboard')

    const notifySuccess = () => {
        toast.success("Cadastro feito com sucesso!", {
            position: "top-center"
        });

    }

    const notifyError = (message: string) => {
        toast.warning(message, {
            position: "top-right",
        });

    }

    type FormDataProps = z.infer<typeof schemaRegister>

    const { handleSubmit, register, formState: { errors } } = useForm<FormDataProps>({
        mode: 'all',
        reValidateMode: 'onChange',
        resolver: zodResolver(schemaRegister),

    })


    const { mutate: createUserAdmin } = api.admin.registerUser.useMutation({
        onSuccess: () => {
            notifySuccess()
            setTimeout(redirect, 3000)
        },

        onError(erro) {
            notifyError(erro.message)
        },
    })


    const handleSubmitForm = (data: FormDataProps) => {

        createUserAdmin({
            name: data.name,
            email: data.email,
            password: data.password,
        })

    }


    return (

        <section className='flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
            <div className='w-full max-w-md space-y-8'>
                <div>
                    {/* If this was a real login screen, you'd want a next/image here */}
                    <img
                        className='mx-auto h-12 w-auto'
                        src='https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg'
                        alt='Workflow'
                    />
                    <h2 className='mt-6 text-center text-3xl font-bold text-gray-900'>Sign up to your new account</h2>
                    <p className='mt-2 text-center text-sm text-gray-600'>
                        Or{' '}
                        <Link href='/login' className='font-medium text-indigo-600 hover:text-indigo-500'>
                            sign in to your account
                        </Link>
                    </p>

                </div>
                <form className='mt-8 space-y-6' onSubmit={handleSubmit(handleSubmitForm)} >
                    <input type='hidden' name='remember' defaultValue='true' />
                    <div className='-space-y-px rounded-md shadow-sm'>
                        <p className='pb-1 text-sm text-red-600'></p>
                        <div>

                            <label htmlFor='name' className='sr-only'>
                                Digite seu nome
                            </label>
                            <input
                                id='name'

                                type="text"

                                {...register('name')}

                                className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                                placeholder='Digite seu nome'
                            />
                            {errors.name && <span>{errors.name.message}</span>}

                            <label htmlFor='email-address' className='sr-only'>
                                Enderaço de e-mail
                            </label>
                            <input
                                id='email-address'
                                type='text'
                                {...register('email')}

                                autoComplete='email'
                                className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                                placeholder='Digite seu email'
                            />

                            {errors.email && <span>{errors.email.message}</span>}


                        </div>


                        <div>
                            <label htmlFor='password' className='sr-only'>
                                Senha
                            </label>
                            <input
                                id='password'
                                type='password'
                                {...register('password')}

                                autoComplete='current-password'
                                className='relative block w-full appearance-none rounded-none  border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                                placeholder='Senha de 6 digitos'
                            />
                            {errors.password && <span>{errors.password.message}</span>}


                            <label htmlFor='confirmPassword' className='sr-only'>
                                Confirme sua senha
                            </label>
                            <input
                                id='confirmPassword'
                                type='password'
                                {...register('confirmPassword')}
                                className='relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                                placeholder='Confirme sua senha'
                            />

                            {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}

                        </div>

                        <div>
                            <label htmlFor='role' className='sr-only'>
                                Informe o admin
                            </label>
                            <input
                                id='role'
                                type='text'
                                {...register('role')}
                                className='relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                                placeholder='Digite o codigo de permissão'
                            />

                            {errors.role && <p>{errors.role?.message}</p>}

                        </div>
                    </div>

                    <div>
                        <button
                            type='submit'



                            className='group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                            <span className='absolute inset-y-0 left-0 flex items-center pl-3'>




                            </span>
                            Sign in
                        </button>
                    </div>
                </form>

            </div>
        </section>

    )

}
export default register;