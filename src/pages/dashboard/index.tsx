import { notifyError, notifySuccess } from "@/models/toastifyUse";
import { api } from "@/utils/api";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";

import { Box, Button, Container, FormControl, FormLabel, IconButton, Input, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, Table, TableContainer, Tbody, Td, Th, Thead, Tr, VStack } from "@chakra-ui/react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

import Head from "next/head";
import Link from "next/link";
import { FC, useRef, useState } from "react";
import { toast } from "react-toastify";

interface dashBoardProps { }



const dashboard: FC<dashBoardProps> = ({ }) => {
    const [deleteSubmit, setDeleteSubmit] = useState<boolean>(false)
    const { data: dashboard, refetch } = api.dashboard.bookingQuery.useQuery()

    const { mutate: bookingDelete } = api.dashboard.bookingDelete.useMutation({
        onSuccess: () => {
            // router.push('/menu')
            setTimeout(refetch, 2000)
            setTimeout(setDeleteSubmit, 2000)
        },

        onError(erro) {
            notifyError(erro.message)

        },
    })

    const notifySucessDelete = () => toast.success("Serviço do cliente não encontrado", {
        position: "top-right",
    })
    const { mutate: serviceDelete } = api.dashboard.serviceDelelete.useMutation({
        onSuccess: (e) => {
            // router.push('/menu')
            setTimeout(notifySucessDelete, 2000)
            setTimeout(refetch, 2000)
        },

        onError(erro) {
            notifyError(erro.message)

        },
    })

    const firstFieldRef = useRef<HTMLInputElement>(null)
    const [openPopoverId, setOpenPopoverId] = useState<number | string | null>(null);


    const PopOver = (id: string) => {
        const client = dashboard?.find(d => d.service.find(s => s.clientid === id))
        return (
            <Box >
                <Popover isLazy placement='bottom' trigger={"hover"} >
                    <PopoverTrigger>
                        <IconButton aria-label='Serviços' cursor={"initial"} icon={<AddIcon />} />
                    </PopoverTrigger>
                    <PopoverContent w={"max-content"}>
                        <TableContainer>
                            <Table variant='unstyled' bgColor={"white"} colorScheme='teal'>

                                <PopoverArrow bg='blackAlpha.800' />

                                <Thead>
                                    <Tr>
                                        <Th>Tipo</Th>
                                        <Th>Horário</Th>
                                        <Th></Th>
                                        <Th></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {client?.service.map((s) =>
                                        <Tr className="capitalize">
                                            <Td>{s.name}</Td>
                                            <Td>{format(s.bookingDate, "d 'de' MMMM 'ás' HH:mm", { locale: ptBR })}</Td>
                                            <Td>
                                                <Popover
                                                    isOpen={openPopoverId === s.id}
                                                    initialFocusRef={firstFieldRef}
                                                    onOpen={() => setOpenPopoverId(s.id)}
                                                    onClose={() => setOpenPopoverId(null)}
                                                    placement='bottom'
                                                    closeOnBlur={false}
                                                >
                                                    <PopoverTrigger>
                                                        <IconButton size='sm' icon={<EditIcon />} aria-label={""} />
                                                    </PopoverTrigger>
                                                    <PopoverContent p={5} >
                                                        <PopoverCloseButton />

                                                        <PopoverBody >
                                                            <FormControl>
                                                                <FormLabel htmlFor={`service-${s.id}`}>Tipo do serviço</FormLabel>
                                                                <Input id={`service-${s.id}`} placeholder="Ex.: Corte" />
                                                                <FormLabel htmlFor={`service-${s.id}`}>Horário</FormLabel>
                                                                <Input id={`service-${s.id}`} placeholder="Ex.: ás 12:30 " />
                                                            </FormControl>
                                                        </PopoverBody>
                                                    </PopoverContent>
                                                </Popover>
                                            </Td>
                                            <Td>
                                                <Button colorScheme="red" isDisabled={deleteSubmit}
                                                    onClick={() => {
                                                        serviceDelete({ id: s.id })

                                                    }}>
                                                    {
                                                        <IconButton size={"sm"} variant={"unstyled"} aria-label='Deletar horário' icon={<DeleteIcon />} />
                                                    }
                                                </Button>

                                            </Td>
                                        </Tr>


                                    )
                                    }
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </PopoverContent>
                </Popover>
            </Box >
        )

    }


    return (
        <div>
            <Head>
                <title>Salão | Dashboard</title>
            </Head>

            <section className="MAX-CONTAINER">
                <Container maxW='100%' >
                    <Box>
                        <Link href="/dashboard/opening">Abertura</Link>
                    </Box>


                    <VStack spacing={10}>

                        <h2>Clientes com horários reservados</h2>

                        <TableContainer maxWidth={"100%"}>
                            <Table variant='simple' colorScheme='teal' >

                                <Thead >
                                    <Tr>
                                        <Th>Cliente</Th>
                                        <Th>Endereço de e-mail</Th>
                                        <Th>Número de celular</Th>
                                        <Th></Th>
                                        <Th></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {
                                        dashboard?.map((e, index) => (
                                            <>
                                                <Tr key={`number-${index}`} alignItems={"center"} >
                                                    <Td> {e.clientName}</Td>
                                                    <Td > {e.email}</Td>
                                                    <Td > {e.phone}</Td>
                                                    <Td>
                                                        {
                                                            PopOver(e.id)
                                                        }

                                                    </Td>


                                                    <Td>
                                                        <Button colorScheme="red" isDisabled={deleteSubmit}
                                                            onClick={() => {
                                                                bookingDelete({ id: e.id })
                                                                setDeleteSubmit(true)
                                                            }}>
                                                            {
                                                                <IconButton size={"sm"} variant={"unstyled"} aria-label='Deletar horário' icon={<DeleteIcon />} />
                                                            }
                                                        </Button>
                                                    </Td>

                                                </Tr>


                                            </>
                                        ))
                                    }

                                </Tbody>

                            </Table>
                        </TableContainer>
                    </VStack>


                </Container>

            </section>
        </div>
    )
}

export default dashboard