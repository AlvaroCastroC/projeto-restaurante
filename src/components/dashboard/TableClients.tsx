import { notifyError, notifySuccess } from "@/models/toastifyUse"
import { api } from "@/utils/api"
import { AddIcon, DeleteIcon } from "@chakra-ui/icons"
import { Button, FormControl, IconButton, Input, Popover, PopoverContent, PopoverTrigger, Table, TableContainer, Tbody, Td, Th, Thead, Tr, VStack } from "@chakra-ui/react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale/pt-BR"
import { FC, useState } from "react"
import { AnimatePresence, motion } from 'framer-motion'

interface TableClientProp {
    isVisible: boolean
}
const TableClient: FC<TableClientProp> = ({ isVisible }) => {

    const [deleteSubmit, setDeleteSubmit] = useState<boolean>(false)
    const [Search, setSearch] = useState<string>('')


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

    const { mutate: serviceDelete } = api.dashboard.serviceDelelete.useMutation({
        onSuccess: (e) => {
            // router.push('/menu')
            notifySuccess(e!.message)
            setTimeout(refetch, 2000)
            setTimeout(setDeleteSubmit, 2000)
        },

        onError(erro) {
            notifyError(erro.message)

        },
    })
    return (
        <VStack>
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <h2>Todos os clientes com horários reservados</h2>

                        <FormControl>
                            <Input bg={"white"} border={"1px"} onChange={(prev) => setSearch(prev.target.value)} placeholder="Pesquise um cliente" />
                        </FormControl>

                        {
                            dashboard?.find(e => e.services.length >= 1) ? (
                                <TableContainer maxWidth={"100%"} bg={"white"} mt={10}>
                                    <Table variant='simple' colorScheme='teal' size={"sm"}>

                                        <Thead >
                                            <Tr>
                                                <Th fontSize={"14"}>Clientes</Th>
                                                <Th fontSize={"14"}>Endereço de e-mail</Th>
                                                <Th fontSize={"14"}>Número de celular</Th>
                                                <Th fontSize={"14"}>Serviço</Th>
                                                <Th></Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {dashboard?.filter(f => { return Search.toLowerCase() === "" ? f : f.clientName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(Search) || f.clientName.toLowerCase().includes(Search) }).map((e, index) => {
                                                if (e.services.length >= 1) {
                                                    return (
                                                        <Tr key={`number-${index}`} alignItems={"center"} >
                                                            <Td> {e.clientName}</Td>
                                                            <Td > {e.email}</Td>
                                                            <Td > {e.phone}</Td>
                                                            <Td>

                                                                <Popover
                                                                    placement='bottom'
                                                                    trigger="hover"

                                                                >
                                                                    <PopoverTrigger>
                                                                        <IconButton size='sm' icon={<AddIcon />} aria-label={""} />
                                                                    </PopoverTrigger>
                                                                    <PopoverContent p={5} width={"100%"}>
                                                                        <TableContainer maxWidth={"100%"}>
                                                                            <Table>
                                                                                <Thead>
                                                                                    <Th>Serviço</Th>
                                                                                    <Th>Preço</Th>
                                                                                    <Th>Nome do colaborador</Th>
                                                                                    <Th></Th>
                                                                                </Thead>
                                                                                <Tbody>
                                                                                    {e?.services.map((s) =>
                                                                                        <Tr className="capitalize">
                                                                                            <Td>{s.service}</Td>
                                                                                            <Td>{format(s.bookingDate, "d 'de' MMMM 'ás' HH:mm", { locale: ptBR })}</Td>
                                                                                            <Td>{s.employees.name!}</Td>
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
                                                                                    )}
                                                                                </Tbody>
                                                                            </Table>
                                                                        </TableContainer>

                                                                    </PopoverContent>
                                                                </Popover>
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
                                                    )
                                                }
                                            }
                                            )}

                                        </Tbody>

                                    </Table>
                                </TableContainer>
                            ) : (
                                <h2 className="font-semibold text-3xl text-red-700"> Nenhum Cliente fez agendamento hoje</h2>
                            )
                        }
                    </motion.div>
                )}
            </AnimatePresence>


        </VStack>
    )
}

export default TableClient;