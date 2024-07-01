import { type FC, useState, useEffect, ChangeEventHandler, ChangeEvent, } from "react";
import { format, formatDistance, formatISO, isBefore, parse } from "date-fns";
import { INTERVALO, NUMERO_FUNCIONARIO, now } from "@/constants/config";
import { day } from '@prisma/client';
import type { DateTime } from 'src/utils/types';
import { capitalize, getOpeningTimes, roundToNearestMinutes } from "@/utils/helper";
import { ptBR } from "date-fns/locale/pt-BR";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaFormClient } from "@/models/userSchemaValidation";
import { z } from "zod";
import { motion } from "framer-motion";
import Modal from "./Modal";
import { CalendarIcon, DeleteIcon } from "@chakra-ui/icons";
import { Button, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, DrawerFooter, useDisclosure, Avatar, Stack, Tbody, Table, TableCaption, TableContainer, Td, Th, Thead, Tr, ScaleFade, Select, IconButton, Collapse, Box, VStack, Container, Heading, HStack, Flex, Text, Popover, PopoverArrow, PopoverContent, PopoverHeader, PopoverTrigger, Divider, AbsoluteCenter, Center, Tab, TabList, TabPanel, TabPanels, Tabs, CardBody, Card, Image, Badge, Tag, CardFooter } from "@chakra-ui/react";
import { api } from "@/utils/api";
import { notifyError } from "@/models/toastifyUse";
import { useRouter } from "next/router";

const DynamicCalendar = dynamic(() => import('react-calendar'), { ssr: false })


interface CalendarProps {
    days: day[]
    closedDays: string[]
}

interface clientService {
    service: string | undefined
    idEmployee: number
}
const clientService = {
    service: '',
    idEmployee: 0
}



const dateType = {
    justDate: null,
    dateTime: null,
}

const CalendarComponent: FC<CalendarProps> = ({ days, closedDays, }) => {

    const { isOpen, onToggle } = useDisclosure()
    const [deleteSubmit, setDeleteSubmit] = useState<boolean>(false)

    const [date, setDate] = useState<DateTime>(dateType)
    const [value, setValue] = useState<clientService>(clientService)
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false)



    const colors = ['green', 'purple'];





    const rounded = roundToNearestMinutes(now, INTERVALO)
    const today = days.find((d) => d.dayOfWeek === now.getDay());

    if (today !== undefined) {
        const closing = parse(today?.closeTime, 'kk:mm', now)
        const tooLate = !isBefore(rounded, closing)
        if (tooLate) closedDays.push(formatISO(new Date().setHours(0, 0, 0, 0)))

    }



    const { data: employees } = api.employees.getEmployees.useQuery()
    // Buscará informações na tabela se existe serviços agendados
    const { data: dataClient, refetch } = api.booking.bookingQuery.useQuery()
    // Buscará todos os serviços
    const { data: services } = api.booking.allServiceQuery.useQuery()
    // Deletará o agendamento de acordo com o usuario
    const { mutate: bookingDelete } = api.booking.serviceDelelete.useMutation({
        onSuccess: () => {
            // router.push('/menu')
            setTimeout(refetch, 2000)
            setTimeout(setDeleteSubmit, 2000)
        },

        onError(erro) {
            notifyError(erro.message)

        },
    })
    // Buscará a conta do usuario
    const { data: user } = api.user.userClient.useQuery()
    if (user === undefined && dataClient === undefined) return

    //Verifica se existe algum agendamento de acordo com o usuario


    const handleSubmitBooking = (time: any) => {
        setIsOpenModal(true)
        setDate((prev) => ({ ...prev, dateTime: time }))
    }



    const times = date.justDate && getOpeningTimes(date.justDate, days,)

    // Retorna os horários disponíveis
    const returnHoursAvailabe = (time: string | Date, i: number) => {


        const exist = employees?.find(e => e.id === value.idEmployee && e.services.find(v => {
            return format(v.bookingDate, "d MMMM HH:mm") === format(time, "d MMMM HH:mm") ?
                true : false
        }))
        return exist ?
            (



                <div className='w-[60px] flex justify-center items-center rounded-md bg-red-400 p-2 cursor-not-allowed transition ease-in-out duration-300 ' key={`time-${i}`}>
                    <button disabled type='button' className="cursor-not-allowed">
                        {format(time, "kk:mm")}
                    </button>

                </div>


            )

            :

            (


                <div className='w-[60px] flex justify-center items-center rounded-md hover:shadow-[inset_-2px_3px_4px_1px_rgba(0,0,0,0.5)] hover:bg-[#cdf9ff23] hover:text-[0.95rem] p-2 cursor-pointer transition ease-in-out duration-300 ' key={`time-${i}`}>
                    <button onClick={() => { handleSubmitBooking(time) }} type='button'>
                        {format(time, "kk:mm")}
                    </button>

                </div>

            )


    }

    const returnFilter = () => {

        if (!value?.service) {
            return employees?.filter(f =>
                f.category.find(e => e.name)
            )
        } else {
            return employees?.filter(f =>
                f.category.find(e => e.name === value?.service)
            )
        }
    }

    return (
        <section className="MAX-CONTAINER flex min-h-[90vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8-10 ">

            <Box w={'100%'}>

                <Heading as='h1' size='lg'>Consulte os seus horários.</Heading>
                {
                    user!.map((item) => {
                        if (item === undefined) return
                        return (
                            <VStack my={50}>


                                <Flex direction={'row'} align={'center'} w={'100%'} justify={'flex-start'} justifyContent={'space-between'}>
                                    <HStack minH={'max-content'}>

                                        <VStack spacing={6} w={'100%'} position='relative'>
                                            {user && !dataClient && <Heading as='h3' size='md'>Parece que você não fez nenhum agendamento.</Heading>}
                                            {user && dataClient && <Heading as='h3' size='md'>Cheque todos os seus horários listados.</Heading>}

                                            <TableContainer>
                                                <Table variant='striped' colorScheme='teal' size='sm'>

                                                    <Thead >
                                                        <Tr>
                                                            <Th></Th>
                                                            <Th>Dia</Th>
                                                            <Th>Mês</Th>
                                                            <Th>Horário</Th>
                                                            <Th>Funcionario</Th>
                                                            <Th>tipo de serviço</Th>
                                                            <Th>Valor do serviço</Th>
                                                        </Tr>
                                                    </Thead>
                                                    <Tbody>

                                                        {
                                                            dataClient && dataClient?.services.map((e) => (
                                                                <Tr >
                                                                    <Td>

                                                                        <Popover trigger="hover" placement="right">
                                                                            <PopoverTrigger>
                                                                                <Button variant="unstyled" size={"sm"} isDisabled={deleteSubmit}
                                                                                    onClick={() => {
                                                                                        bookingDelete({ id: e.id })
                                                                                        setDeleteSubmit(true)
                                                                                    }}>
                                                                                    {
                                                                                        <IconButton size={"sm"} variant={"unstyled"} aria-label='Deletar horário' icon={<DeleteIcon />} />
                                                                                    }
                                                                                </Button>
                                                                            </PopoverTrigger>
                                                                            <PopoverContent maxWidth={"250px"} p={2} color='white' bg='blue.800' borderColor=' blue.800' width={"100%"}>
                                                                                <PopoverArrow bg='blue.800' />

                                                                                <PopoverHeader fontWeight='bold' border='0' >Apagar agendamento?</PopoverHeader>

                                                                            </PopoverContent>
                                                                        </Popover>


                                                                    </Td>
                                                                    <Td>{format(e.bookingDate.toString(), "d")}</Td>
                                                                    <Td className="capitalize">{format(e.bookingDate.toString(), "MMMM", { locale: ptBR })}</Td>
                                                                    <Td >{format(e.bookingDate.toString(), "HH:mm")} </Td>
                                                                    <Td>{e.employees.name}</Td>
                                                                    <Td >{capitalize(e.service)} </Td>
                                                                    <Td >R$ {e.price.toFixed(2).replace(".", ",")} </Td>

                                                                </Tr>
                                                            ))
                                                        }

                                                    </Tbody>
                                                </Table>
                                            </TableContainer>
                                        </VStack>
                                    </HStack>
                                </Flex>
                            </VStack>

                        )

                    })
                }


                <Heading as='h1' size='lg'>Faça o seu agendamento.</Heading>

                <VStack my={50} >
                    <HStack>
                        <Heading minW={'max-content'} size={'md'}>Selecione um dos nossos serviços:</Heading>
                        <Select placeholder='Serviços'
                            onChange={e => setValue((prev) => ({ ...prev, service: e.target.value }))}
                            value={value?.service}
                            onClick={() => { isOpen && onToggle() }}
                            css={{
                                border: '1px solid #000',
                                backgroundColor: 'white',

                            }}

                        >
                            {
                                services?.map((s: { service: string, price: number }, index: number) => (
                                    <option key={index} value={s.service}
                                    >
                                        {capitalize(s.service)}
                                        <span> R${s.price.toFixed(2).replace(".", ",")}
                                        </span>
                                    </option>
                                ))
                            }
                        </Select>
                    </HStack>

                    <Flex direction={'row'} gap={5} my={5}>

                        {
                            returnFilter()?.map(item =>
                                item.active &&
                                <Card
                                    direction={{ base: 'column', sm: 'row' }}
                                    overflow='hidden'
                                    variant='outline'
                                    key={item.id}
                                >
                                    <Image
                                        objectFit='cover'
                                        maxW={{ base: '100%', sm: '200px' }}
                                        src={item.url}
                                        alt={`Funcionáiro: ${item.name}`}
                                    />

                                    <Stack>
                                        <CardBody minW={'350px'} p={4}>
                                            <Heading size='md'>{item.name}</Heading>
                                            <Text mt={6}>Especializações</Text>
                                            <Flex gap={2} mt={2}>
                                                {
                                                    item.category.map((e, index) => (
                                                        <Badge colorScheme={colors[index % colors.length]} key={e.id}>{e.name}</Badge>
                                                    ))
                                                }
                                            </Flex>
                                            <Text py='2'>
                                                Trabalhando conosco há  <Tag>{formatDistance(item.initTime, new Date(), { locale: ptBR })}</Tag>
                                            </Text>


                                        </CardBody>

                                        <CardFooter>
                                            {
                                                (value?.service) ?
                                                    <Button leftIcon={<CalendarIcon />} variant='solid' colorScheme='blue' onClick={() => {

                                                        !isOpen && onToggle()
                                                        setValue((prev) => ({ ...prev, idEmployee: item.id }))
                                                    }}
                                                    >
                                                        Verificar horários disponíveis:
                                                    </Button>
                                                    : <Text
                                                    >
                                                        Escolha a opção de serviço primeiro.
                                                    </Text>
                                            }

                                        </CardFooter>
                                    </Stack>
                                </Card>

                            )

                        }
                    </Flex>

                </VStack>


                <VStack w={'100%'}>
                    <Collapse in={isOpen} animateOpacity >
                        <Box
                            p='40px'
                            mt='4'

                            rounded='md'
                            shadow='md'
                        >

                            <div className="flex justify-center gap-10 md1:flex-wrap">


                                <motion.div className="CALENDAR-BOOKING flex flex-col items-center "
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <DynamicCalendar
                                        minDate={now}
                                        className='REACT-CALENDAR p-6'
                                        view='month'
                                        tileDisabled={({ date }) => closedDays.includes(formatISO(date),)}
                                        onClickDay={(date) => setDate((prev) => ({ ...prev, justDate: date }))}
                                    />
                                </motion.div>


                                {
                                    date.justDate && user &&
                                    <motion.div className='flex flex-col items-center '
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >

                                        <div className="flex flex-col justify-center  items-center w-[450px] rounded-[15px] border border-[#d0d0d1]  min-h-[20rem]] bg-white flex-wrap  hover:shadow-[0_20px_50px_-5px_rgba(0,0,0,0.2)] transition ease-in-out duration-700 py-9 px-5 gap-6 text-[#000]" >
                                            <h3 className="capitalize text-[1.rem]">Reservas disponíveis para o dia {<Tag variant='subtle' colorScheme='cyan'>{format(date.justDate, "d 'de' MMMM", { locale: ptBR })}</Tag>}</h3>

                                            <div className="flex flex-wrap justify-center gap-4  w-full">
                                                {times?.map((time, i) => (
                                                    returnHoursAvailabe(time, i)

                                                ))}
                                            </div>
                                        </div>


                                    </motion.div>

                                }

                            </div>
                        </Box>
                    </Collapse>
                    {
                        user && user.map((u) => (
                            u && value?.service ? <Modal isOpen={isOpenModal} setIsOpen={setIsOpenModal} clientName={u.firstName + " " + u.secondName} phone={u.phone} email={u.email} bookingDate={date.dateTime} service={value?.service} idEmployee={value.idEmployee}
                            /> : 'ola'
                        ))
                    }


                </VStack>

            </Box>




        </section >
    )




}

export default CalendarComponent;




