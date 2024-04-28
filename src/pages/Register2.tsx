import { Formik, Form, Field, ErrorMessage } from "formik"
import Link from "next/link";

import * as yup from "yup";

import InputMask from "react-input-mask"
import { useState } from "react";
import { api } from "@/utils/api";



const reg = ({ }) => {

    const [dataRegisterAdmin, setDataRegisteradmin] = useState({
        name: " ",
        phone: "",
        email: "",
        password: "",
        keywords: [],
    })




    const { mutateAsync: createUserAdmin } = api.admin.registerUser.useMutation()

    const registerUser = async (e: any) => {

        await createUserAdmin({
            name: e.name,
            phone: e.phone,
            email: e.email,
            password: e.password,
            keywords: []
        })

        refetch()

    }



    const validationRegister = yup.object().shape({
        name:
            yup.string().required("Este campo é obrigratorio"),
        email:
            yup.string().email("Tipo de email inválido").required("Este campo é obrigratorio"),
        password:
            yup.string().min(5, "senha deve conter 5 caracteres").required("Este campo é obrigatorio"),
        confirmPassword:
            yup.string().oneOf([yup.ref("password")], "A senha precisa ser igual"),
        phone: yup.string().required("Digite números reais")
    })



    const { data: menuItems, refetch } = api.getAdmin.getAllData.useQuery(undefined, { refetchOnMount: false })


    const [filter, setFilter] = useState<string | undefined>(undefined)

    const filteredMenuItems = menuItems?.filter((menuItem) => {
        if (!filter) return true
        return menuItem.keywords.includes(filter)
    })


    return (
        <div className='flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
            <div className='w-full max-w-md space-y-8'>
                <div>
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
                <Formik
                    initialValues={{}}
                    validationSchema={validationRegister}
                    onSubmit={registerUser}
                >
                    <Form className='mt-8 space-y-6'>

                        <div className='-space-y-px rounded-md shadow-sm'>
                            <p className='pb-1 text-sm text-red-600'></p>
                            <div>

                                <Field
                                    name='name'

                                    className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                                    placeholder='Email address'
                                />

                                <ErrorMessage
                                    component="span"
                                    name="name" />

                            </div>
                            <div>

                                <Field
                                    name='email'

                                    className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                                    placeholder='Email address'
                                />

                                <ErrorMessage
                                    component="span"
                                    name="email" />



                                <Field name="phone" render=
                                    {({ field }: any) => (
                                        <InputMask
                                            {...field}
                                            mask=" +55 (99) 99999-9999"
                                            placeholder="Digite seu número de telefone"
                                            className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'

                                        />
                                    )}
                                />

                                <ErrorMessage
                                    component="span"
                                    name="phone" />



                            </div>
                            <div>

                                <Field
                                    name='password'

                                    className='relative block w-full appearance-none rounded-none  border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                                    placeholder='Password'
                                />
                                <ErrorMessage
                                    component="span"
                                    name="password" />

                                <Field
                                    name='confirmPassword'

                                    className='relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                                    placeholder='Confirm password'
                                />

                                <ErrorMessage
                                    component="span"
                                    name="confirmPassword" />
                            </div>
                        </div>
                        <button
                            type='submit'
                            onClick={
                                registerUser

                            }

                            className='group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                            <span className='absolute inset-y-0 left-0 flex items-center pl-3'>

                            </span>
                            Sign up
                        </button>
                    </Form>

                </Formik>

            </div>

            <div>
                {menuItems?.map((item) => (
                    <div key={item.id}>
                        <p>{item.name}</p>
                        <p>{item.email}</p>
                        <p>{item.password}</p>
                        <p>{item.keywords}</p>
                    </div>
                ))}
                {filteredMenuItems?.map((item) => (
                    <p>{item.keywords}</p>
                ))}
            </div>


        </div>
    )
}





export default reg

