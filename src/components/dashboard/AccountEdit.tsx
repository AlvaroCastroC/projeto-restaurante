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
import { Box, Button, Collapse, Container, Flex, FormControl, FormHelperText, FormLabel, Input, Spinner, Stack, useDisclosure } from '@chakra-ui/react'
import ResetPassword from "../ResetPassword"
import { AnimatePresence, motion } from "framer-motion"




interface updateProps {
    isVisible: boolean
}
const AccountEdit: FC<updateProps> = ({ isVisible }) => {


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


    const { mutate: forgotPassword, isSuccess } = api.createUser.forgotPassword.useMutation({
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
            role: 'admin'
        })

    }

    const { isOpen, onToggle, } = useDisclosure()


    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}>
                    <Container minWidth={"500px"}>


                        <Box>
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
                        </Box>
                        {
                            !isSuccess ? <form onSubmit={handleSubmit(handleSubmitForm)} >
                                <FormControl  >
                                    <Flex direction={"column"} gap={5}>
                                        <Flex direction={"column"} >
                                            <FormLabel htmlFor="email-address">Email</FormLabel>
                                            <Input

                                                id='email-address'
                                                type='email'

                                                {...register('email')}

                                                placeholder='Enderaço de e-mail'
                                            />

                                            {errors.email && <FormHelperText >{errors.email.message}</FormHelperText>}
                                        </Flex>

                                        <Flex direction={"column"} >
                                            <FormLabel htmlFor="phone-number">Número de telefone</FormLabel>
                                            <Input
                                                as={InputMask}
                                                id="phone-number"


                                                placeholder='Digite seu número de celular'

                                                mask="99 99999-9999"
                                                maskPlaceholder={null}
                                                {...register('phone')}
                                            />

                                            {errors.phone && <FormHelperText >{errors.phone.message}</FormHelperText>}
                                        </Flex>
                                    </Flex>
                                    <Box mt={2} >
                                        <Button
                                            type='submit'

                                            colorScheme="blue"
                                            width={"100%"}
                                        >

                                            Enviar
                                        </Button>
                                    </Box>
                                </FormControl>
                            </form>
                                :

                                <Collapse
                                    in={isOpen}

                                    transition={{ exit: { delay: 0.5 }, enter: { duration: 0.5 } }}
                                >

                                    <ResetPassword />


                                </Collapse>
                        }


                    </Container>
                </motion.div>
            )}
        </AnimatePresence>
    )
}


export default AccountEdit;