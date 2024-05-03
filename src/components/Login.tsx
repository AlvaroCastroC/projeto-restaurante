import { useRouter } from 'next/router'
import { useEffect, useState, type FC } from 'react'
import { HiLockClosed } from 'react-icons/hi'
import { api } from '@/utils/api'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { schemaLogin } from '@/utils/validationUser'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const Login: FC = () => {
    const router = useRouter()

    const redirect = () => router.push('/dashboard')


    const notifyError = (message: string) => {
        toast.warning(message, {
            position: "top-right",
        });

    }

    const { mutate: login, } = api.admin.login.useMutation({
        onSuccess: () => {
            setTimeout(redirect, 3000)

        },
        onError(erro) {
            notifyError(erro.message)
        }
    })


    type FormDataProps = z.infer<typeof schemaLogin>

    const { handleSubmit, register, formState: { errors }, setValue } = useForm<FormDataProps>({
        mode: 'all',
        reValidateMode: 'onChange',
        resolver: zodResolver(schemaLogin),

    })


    const handleSubmitForm = async (data: FormDataProps) => {
        const { email, password, role } = data
        if (role) {

            if (typeof window !== "undefined") {
                localStorage.setItem("remember-user-login", JSON.stringify({ email, password }))
                login({
                    email,
                    password,
                })

                return true
            }
        }
        else {
            login({
                email,
                password,
            })

            return true
        }

    }

    useEffect(() => {
        let value
        const getDataStorage = localStorage.getItem('remember-user-login')
        if (getDataStorage) {

            value = JSON.parse(getDataStorage)
            setValue('email', value.email)
            setValue('password', value.password)
        }

    }, [])



    return (
        <div className='flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
            <div className='w-full max-w-md space-y-8'>
                <div>
                    {/* If this was a real login screen, you'd want a next/image here */}
                    <img
                        className='mx-auto h-12 w-auto'
                        src='https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg'
                        alt='Workflow'
                    />
                    <h2 className='mt-6 text-center text-3xl font-bold text-gray-900'>Sign in to your account</h2>
                    <p className='mt-2 text-center text-sm text-gray-600'>
                        Or{' '}
                        <Link href='/register' className='font-medium text-indigo-600 hover:text-indigo-500'>
                            sign up to your new account
                        </Link>
                    </p>
                </div>
                <form className='mt-8 space-y-6' onSubmit={handleSubmit(handleSubmitForm)}>

                    <input type='hidden' name='remember' defaultValue='true' />

                    <div className='-space-y-px rounded-md shadow-sm'>
                        <div>
                            <label htmlFor='email-address' className='sr-only'>
                                Email address
                            </label>

                            <input
                                id='email-address'
                                type='email'

                                {...register('email')}

                                className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                                placeholder='Email address'
                            />

                            {errors.email && <span>{errors.email.message}</span>}

                        </div>


                        <div>
                            <label htmlFor='password' className='sr-only'>
                                Password
                            </label>

                            <input
                                id='password'
                                type='password'

                                {...register('password')}

                                autoComplete='current-password'
                                className='relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                                placeholder='Password'
                            />

                            {errors.password && <span>{errors.password.message}</span>}
                        </div>
                    </div>

                    <div className='flex items-center justify-between'>
                        <div className='flex items-center'>
                            <input
                                id='remember-me'

                                {...register('role')}
                                type='checkbox'
                                className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                            />
                            <label htmlFor='remember-me' className='ml-2 block text-sm text-gray-900'>
                                Remember me
                            </label>
                        </div>

                        <div className='text-sm'>
                            <a href='#' className='font-medium text-indigo-600 hover:text-indigo-500'>
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type='submit'

                            className='group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                            <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                                <HiLockClosed
                                    className='h-5 w-5 text-indigo-500 group-hover:text-indigo-400'
                                    aria-hidden='true'
                                />

                            </span>
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login