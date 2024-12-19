"use client"



import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { NotificantionError } from "./utils";
import { notifyError, notifySuccess } from "@/models/toastifyUse";
import { schemaLogin } from "@/models/userSchemaValidation";
import { api } from "@/utils/api";



export function Login() {

  return (
    <div className="w-full max-w-md mr-auto  min-h-screen flex flex-col items-center justify-center bg-slate-400 px-10">

      <h2>Login</h2>

      <Form />

    </div>
  );
}

function Form() {


  const { mutate: login, isPending } = api.userLogin.useMutation({
    onSuccess: async (success) => {

      notifySuccess({ message: success!.message, specification: "top-left" })
      setTimeout(() => {
        location.reload()
      }, 3000)
    },
    onError(error) {
      notifyError({ message: error!.message, specification: "top-left" })

    }
  });

  type FormDataProps = z.infer<typeof schemaLogin>


  const { handleSubmit, register, formState: { errors, } } = useForm<FormDataProps>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: zodResolver(schemaLogin),

  })


  const handleSubmitForm = async (data: FormDataProps) => {
    const { email, password } = data
    login({
      email,
      password,
    })



    return true
  }



  return (
    <form
      onSubmit={handleSubmit(handleSubmitForm)}
      className="flex flex-col gap-5 "
    >

      <div>

        <input
          type="email"
          placeholder="E-mail"
          {...register('email')}
          className="w-full rounded-full px-4 py-2 text-black"
        />

        {errors.email && NotificantionError(errors.email.message!)}
      </div>

      <div>
        <input
          type="password"
          placeholder="Senha"
          {...register('password')}
          className="w-full rounded-full px-4 py-2 text-black"
        />

        {errors.password && NotificantionError(errors.password.message!)}
      </div>

      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={isPending}
      >
        {isPending ? "Entrando..." : "Entrar"}
      </button>
    </form>


  )
}
