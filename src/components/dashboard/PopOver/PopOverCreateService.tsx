import { AddIcon, DeleteIcon } from "@chakra-ui/icons"
import { Button, ButtonGroup, Flex, FormControl, FormHelperText, FormLabel, HStack, IconButton, Input, Popover, PopoverContent, PopoverTrigger, Table, TableContainer, Tbody, Td, Th, Thead, Tr, VStack, useDisclosure } from "@chakra-ui/react"
import { FC, useRef } from "react"
import { schemaService } from "@/models/userSchemaValidation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/utils/api"
import { notifyError, notifyPromise } from "@/models/toastifyUse"
import { capitalize } from "@/utils/helper"
import { z } from "zod"
import PopOverUpdateService from "./PopOverUpdateService"
import { motion, AnimatePresence } from "framer-motion"


interface CreateServiceProps {
    isVisible: boolean
}

const ContentCreateService: FC<CreateServiceProps> = ({ isVisible }) => {


    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialFocusRef = useRef<HTMLButtonElement>(null)

    const { data: allService, refetch } = api.dashboard.allServiceQuery.useQuery()




    const { mutate: allServiceDelete } = api.dashboard.allServiceDelelete.useMutation({
        onSuccess: (e) => {
            // router.push('/menu')
            notifyPromise("deleteAll", e.message, e.success)
            setTimeout(refetch, 2000)
        },

        onError(erro) {
            notifyError(erro.message)

        },
    })
    const { mutate: allServiceCreate, } = api.dashboard.allServiceCreate.useMutation({
        onSuccess: (e) => {
            notifyPromise("create", e.message, e.success)
            setTimeout(refetch, 3000)
        },

        onError(erro) {
            notifyError(erro.message)

        },

    })

    type FormDataProps = z.infer<typeof schemaService>

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormDataProps>({
        mode: "all",
        reValidateMode: 'onChange',
        resolver: zodResolver(schemaService)

    })


    const handleSubmitForm = async (data: FormDataProps) => {
        const { service, price } = data


        allServiceCreate({
            service,
            price: JSON.parse(price.replace(",", "."))
        })


    }


    return (

        <VStack>
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <HStack>
                            <h2>Todos serviços, e suas precificações da sua loja</h2>

                        </HStack>

                        <TableContainer maxWidth={"100%"} minWidth={"500px"} bg={"white"}>
                            <Flex justifyContent={"space-between"} p={2}>

                                <Popover
                                    isOpen={isOpen}
                                    initialFocusRef={initialFocusRef}
                                    onOpen={onOpen}
                                    onClose={onClose}
                                    placement='right'
                                    closeOnBlur={false}
                                >

                                    <PopoverTrigger >
                                        <Button size={"sm"} colorScheme="green" rightIcon={<AddIcon />}>Adicionar serviços</Button>
                                    </PopoverTrigger>


                                    <PopoverContent p={5} >
                                        <form onSubmit={handleSubmit(handleSubmitForm)}>
                                            <FormControl>
                                                <FormLabel htmlFor="service">Serviço</FormLabel>
                                                <Input type="text" id="service" {...register("service")} placeholder="Ex.: Corte de cabelo" />
                                                {errors.service && <FormHelperText>{errors.service?.message}</FormHelperText>}


                                                <FormLabel htmlFor="price">Preço</FormLabel>
                                                <Input id="price" {...register("price")} placeholder="Ex.: R$ 55,20" />
                                                {errors.price && <FormHelperText>{errors.price?.message}</FormHelperText>}
                                            </FormControl>
                                            <ButtonGroup spacing={2} mt={4}>
                                                <Button type="submit" colorScheme="green" onClick={() => {
                                                    !errors && onClose()
                                                }}>Criar</Button>
                                                <Button onClick={() => {
                                                    setTimeout(reset, 500)
                                                    onClose()
                                                }}>Cancelar</Button>
                                            </ButtonGroup>
                                        </form>
                                    </PopoverContent>
                                </Popover>

                                <Button size={"sm"} colorScheme="red" rightIcon={<DeleteIcon />} onClick={() => {
                                    allServiceDelete({ optional: "all" })
                                }} > Excluir todos os serviços
                                </Button>

                            </Flex>


                            <Table variant='simple' colorScheme='teal' size={"md"}>

                                <Thead >
                                    <Tr>
                                        <Th fontSize={"14"}>Tipo de Serviços</Th>
                                        <Th fontSize={"14"}>Precificação</Th>
                                        <Th></Th>
                                        <Th></Th>

                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {
                                        allService?.map((e, index) => (
                                            <Tr key={`number-${index}`} alignItems={"center"} >
                                                <Td> {capitalize(e.service)}</Td>
                                                <Td >R$ {e.price.toFixed(2).replace('.', ',')}</Td>
                                                <Td>
                                                    {
                                                        <PopOverUpdateService id={e.id} refetch={refetch} />
                                                    }
                                                </Td>
                                                <Td>
                                                    <IconButton size={"sm"} colorScheme="red" aria-label='Apagar serviço' icon={<DeleteIcon />} onClick={() => {
                                                        allServiceDelete({ optional: "one", id: e.id })
                                                    }} />
                                                </Td>
                                            </Tr>




                                        ))
                                    }

                                </Tbody>

                            </Table>
                        </TableContainer>

                    </motion.div>
                )}
            </AnimatePresence>


        </VStack>

    )
}

export default ContentCreateService;