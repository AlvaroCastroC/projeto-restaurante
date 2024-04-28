// import { api } from "@/utils/api";
// import Link from "next/link";
// import { ChangeEvent, FC, useState } from "react";

// interface registerProps {

// }




// const Register: FC<registerProps> = ({ }) => {

//     const [dataRegisterAdmin, setDataRegisteradmin] = useState({
//         name: " ",
//         phone: "",
//         email: "",
//         password: "",
//         repeatPassword: "",
//         keywords: [""],
//     })

//     const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target


//         setDataRegisteradmin((prev) => ({ ...prev, [name]: value }))


//     }


//     const { mutateAsync: createUserAdmin } = api.admin.registerUser.useMutation()

//     return (

//         <div className='flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
//             <div className='w-full max-w-md space-y-8'>
//                 <div>
//                     {/* If this was a real login screen, you'd want a next/image here */}
//                     <img
//                         className='mx-auto h-12 w-auto'
//                         src='https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg'
//                         alt='Workflow'
//                     />
//                     <h2 className='mt-6 text-center text-3xl font-bold text-gray-900'>Sign up to your new account</h2>
//                     <p className='mt-2 text-center text-sm text-gray-600'>
//                         Or{' '}
//                         <Link href='/login' className='font-medium text-indigo-600 hover:text-indigo-500'>
//                             sign in to your account
//                         </Link>
//                     </p>

//                 </div>
//                 <form className='mt-8 space-y-6'>
//                     <input type='hidden' name='remember' defaultValue='true' />
//                     <div className='-space-y-px rounded-md shadow-sm'>
//                         <p className='pb-1 text-sm text-red-600'></p>
//                         <div>
//                             <label htmlFor='email-address' className='sr-only'>
//                                 Email address
//                             </label>
//                             <input
//                                 id='email-address'
//                                 name='email'
//                                 type='email'

//                                 value={dataRegisterAdmin.email}
//                                 onChange={handleChange}

//                                 autoComplete='email'
//                                 required
//                                 className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
//                                 placeholder='Email address'
//                             />


//                             <label htmlFor='tel' className='sr-only'>
//                                 Enter your phone
//                             </label>
//                             <IMaskInput
//                                 id='tel'
//                                 name='phone'
//                                 type='tel'
//                                 mask='+{55} (00) 00000-0000'
//                                 placeholder='Tel: (xx) xxxxx-xxxx'
//                                 required

//                                 value={dataRegisterAdmin.phone}
//                                 onChange={handleChange}

//                                 className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
//                             />


//                         </div>
//                         <div>
//                             <label htmlFor='password' className='sr-only'>
//                                 Password
//                             </label>
//                             <input
//                                 id='password'
//                                 name='password'
//                                 type='password'

//                                 value={dataRegisterAdmin.password}
//                                 onChange={handleChange}

//                                 autoComplete='current-password'
//                                 required
//                                 className='relative block w-full appearance-none rounded-none  border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
//                                 placeholder='Password'
//                             />

//                             <label htmlFor='repeatPassword' className='sr-only'>
//                                 Password
//                             </label>
//                             <input
//                                 id='repeatPassword'
//                                 name='repeatPassword'
//                                 type='password'

//                                 value={dataRegisterAdmin.repeatPassword}
//                                 onChange={handleChange}

//                                 autoComplete='current-password'
//                                 required
//                                 className='relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
//                                 placeholder='Confirm password'
//                             />
//                         </div>
//                     </div>



//                     <div>
//                         <button
//                             type='submit'
//                             onClick={(e) => {
//                                 e.preventDefault()
//                                 // createUserAdmin(dataRegisterAdmin)
//                             }}

//                             className='group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
//                             <span className='absolute inset-y-0 left-0 flex items-center pl-3'>




//                             </span>
//                             Sign in
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>

//     )
// }

// export default Register;