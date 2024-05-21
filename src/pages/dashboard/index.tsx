import { notifyError } from "@/models/toastifyUse";
import { api } from "@/utils/api";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

import { Box, Button, Container, IconButton, Popover, PopoverContent, PopoverTrigger, Table, TableContainer, Tbody, Td, Th, Thead, Tr, VStack } from "@chakra-ui/react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

import Head from "next/head";
import Link from "next/link";
import { FC, useState } from "react";

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
                            <Table variant='simple' colorScheme='teal'>
                                <Thead>
                                    <Tr>
                                        <Th>Tipo</Th>
                                        <Th>Horário</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {client?.service.map(s =>
                                        <Tr className="capitalize">
                                            <Td>{s.name}</Td>
                                            <Td>{format(s.bookingDate, "d 'de' MMMM 'ás' HH:mm", { locale: ptBR })}</Td>
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


                    <VStack>

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