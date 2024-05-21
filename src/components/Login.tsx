import { useEffect, type FC } from 'react'
import { HiLockClosed } from 'react-icons/hi'
import { api } from '@/utils/api'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { schemaLogin } from '@/models/userSchemaValidation'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { notifyError } from '@/models/toastifyUse'
import { useRouter } from 'next/router'
import { Box, Button, Checkbox, FormControl, FormHelperText, Input, Container, Flex } from '@chakra-ui/react'

const Login: FC = () => {

    const router = useRouter()


    const redirect = () => router.push('/dashboard')


    const { mutate: login, } = api.admin.login.useMutation({
        onSuccess: () => {
            setTimeout(redirect, 3000)

        },
        onError(erro) {
            notifyError(erro.message)
        }
    })


    type FormDataProps = z.infer<typeof schemaLogin>

    const { handleSubmit, register, formState: { errors, }, setValue } = useForm<FormDataProps>({
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
        <section className='flex min-h-[90vh] items-center justify-center py-12 sm:px-6 lg:px-8'>
            <Container className='px-7  transition ease-in-out duration-700'
                py={"12"}
                px={"7"}
                borderRadius={"6"}
                _hover={{
                    boxShadow: "0 20px 50px 5px rgba(0,0,0,0.2)",
                    backgroundColor: "white"
                }}  >
                <div>
                    <img
                        className='mx-auto h-12 w-auto'
                        src='https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg'
                        alt='Workflow'
                    />
                    <h2 className='mt-6 text-center text-3xl font-bold text-gray-900'>Faça o login na sua conta</h2>
                    <p className='mt-2 text-center text-sm text-gray-600'>
                        Ou{' '}
                        <Link href='/register' className='font-medium text-indigo-600 hover:text-indigo-500'>
                            cadastrar uma nova conta
                        </Link>
                    </p>
                </div>
                <form className='mt-8 space-y-6' onSubmit={handleSubmit(handleSubmitForm)}>

                    <FormControl >
                        <Flex direction={"column"} alignItems={"center"} gap={"2"}>

                            <div className='w-[288px]'>

                                <Input
                                    id='email-address'
                                    type='email'
                                    className='relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                                    {...register('email')}
                                    placeholder='Endereço de E-mail'
                                />

                                {errors.email && <FormHelperText color={"red.400"} marginLeft={"12px"} > {errors.email.message} </FormHelperText>}
                            </div>






                            <div className='w-[288px]'>
                                <Input
                                    id='password'
                                    type='password'

                                    {...register('password')}

                                    autoComplete='current-password'
                                    className='relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                                    placeholder='Senha'
                                />
                                {errors.password && <FormHelperText
                                    color={"red.400"} marginLeft={"12px"}
                                > {errors.password.message}
                                </FormHelperText>}
                            </div>

                        </Flex>
                    </FormControl>






                    <div className='flex items-center justify-between'>
                        <Box className='flex items-center justify-center'>
                            <Checkbox
                                id='remember-me'

                                {...register('role')}
                                type='checkbox'
                                className=' rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                            >
                                Lembrar de mim
                            </Checkbox>

                        </Box>

                        <div className='text-sm'>
                            <Link href='/forgotPassword' className='font-medium text-indigo-600 hover:text-indigo-500'>
                                Esqueceu a senha?
                            </Link>
                        </div>
                    </div>

                    <div>
                        <Button
                            type='submit'

                            className='group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                            <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                                <HiLockClosed
                                    className='h-5 w-5 text-indigo-500 group-hover:text-indigo-400'
                                    aria-hidden='true'
                                />
                            </span>
                            Sign in
                        </Button>
                    </div>
                </form>
            </Container>
        </section>
    )
}

export default Login