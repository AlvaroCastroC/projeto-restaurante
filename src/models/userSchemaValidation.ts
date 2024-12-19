import { z } from "zod";

const regexNameValidation = /^\p{L}[\p{L}\s]*$/u;



// Validará os campos do login
export const schemaLogin = z.object({
    email: z.string().email("Insira um e-mail válido."),
    password: z.string().min(6, "A senha precisa ter mais de 5 caracteres."),

})


// Validará os campos do cadastro de user
export const schemaRegister = z.object({
    firstName: z.string().min(3, "Informe seu primeiro nome").regex(regexNameValidation, { message: "O nome não pode conter números" }),
    secondName: z.string().min(6, "Informe seu sobrenome completo").regex(regexNameValidation, { message: "O nome não pode conter números" }),
    email: z.string().email("Insira um e-mail válido."),
    password: z.string().min(6, "A senha precisa ter mais de 5 caracteres."),
    confirmPassword: z.string(),
}).refine((fields) => fields.password == fields.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não são parecidas'
})