import { z } from "zod"

const regexPhoneValidation = /^\(?[1-9]{2}\)? 9[0-9]{4}\-?[0-9]{4}$/;

const regexNameValidation = /^\p{L}[\p{L}\s]*$/u;


// Validará os campos do cadastro de user
export const schemaRegister = z.object({
    firstName: z.string().min(3, "Informe seu primeiro nome").regex(regexNameValidation, { message: "O nome não pode conter números" }),
    secondName: z.string().min(6, "Informe seu sobrenome completo").regex(regexNameValidation, { message: "O nome não pode conter números" }),
    email: z.string().email("Insira um e-mail válido."),
    phone: z.string().regex(regexPhoneValidation, { message: "Número de celular inválido" }),
    password: z.string().min(6, "A senha precisa ter mais de 5 caracteres."),
    confirmPassword: z.string(),
    role: z.string(),
}).refine((fields) => fields.password == fields.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não são parecidas'
})



// Validará os campos do login
export const schemaLogin = z.object({
    email: z.string().email("Insira um e-mail válido."),
    password: z.string().min(6, "A senha precisa ter mais de 5 caracteres."),
    role: z.boolean()
})



// Validará os campos de esqueceu a senha
export const schemaForgotPassword = z.object({
    email: z.string().email("Insira um e-mail válido."),
    phone: z.string().regex(regexPhoneValidation, { message: "Número de celular inválido!" })
})



// Validará os campos de resetar a senha
export const schemaResetPassword = z.object({
    email: z.string().email("Insira um e-mail válido."),
    password: z.string().min(6, "A senha precisa ter mais de 5 caracteres."),
    confirmPassword: z.string(),
    token: z.string().max(6, { message: "Tamanho requerido" })
}).refine((fields) => fields.password == fields.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não são parecidas'
})

export const schemaFormClient = z.object({
    email: z.string().email("Insira um e-mail válido."),
    name: z.string().min(3, "Informe seu nome completo").regex(regexNameValidation, { message: "O nome não pode conter números" }),
    phone: z.string().regex(regexPhoneValidation, { message: "Número de celular inválido!" }),
    service: z.string(),
})