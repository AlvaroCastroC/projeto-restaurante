import { type FC, useState, } from "react";
import { format, formatISO, isBefore, parse } from "date-fns";
import { INTERVALO, NUMERO_FUNCIONARIO, now } from "@/constants/config";
import { Day } from '@prisma/client';
import type { DateTime } from 'src/utils/types';
import { capitalize, getOpeningTimes, roundToNearestMinutes } from "@/utils/helper";
import { ptBR } from "date-fns/locale/pt-BR";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { HiOutlineLogin } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaFormClient } from "@/models/userSchemaValidation";
import { z } from "zod";
import InputMask from "react-input-mask";
import { AnimatePresence, motion } from "framer-motion";
import Modal from "./Modal";
import { CalendarIcon, DeleteIcon } from "@chakra-ui/icons";
import { Button, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, DrawerFooter, useDisclosure, Avatar, Stack, Tbody, Table, TableCaption, TableContainer, Td, Th, Thead, Tr, ScaleFade, Select, IconButton } from "@chakra-ui/react";
import { api } from "@/utils/api";
import { notifyError } from "@/models/toastifyUse";

const DynamicCalendar = dynamic(() => import('react-calendar'), { ssr: false })


interface CalendarProps {
    days: Day[]
    closedDays: string[]
}

interface clientProps {
    name: string
    email: string
    phone: string
    service: string
}

const clientPropsConst = {
    email: "",
    name: "",
    phone: "",
    service: "",
}

const dateType = {
    justDate: null,
    dateTime: null,
}

const CalendarComponent: FC<CalendarProps> = ({ days, closedDays, }, { isVisible }) => {


    const rounded = roundToNearestMinutes(now, INTERVALO)
    const today = days.find((d) => d.dayOfWeek === now.getDay());

    if (today !== undefined) {
        const closing = parse(today?.closeTime, 'kk:mm', now)
        const tooLate = !isBefore(rounded, closing)
        if (tooLate) closedDays.push(formatISO(new Date().setHours(0, 0, 0, 0)))

    }

    const { isOpen, onClose, onOpen } = useDisclosure()
    const [deleteSubmit, setDeleteSubmit] = useState<boolean>(false)

    const [date, setDate] = useState<DateTime>(dateType)
    const [value, setValue] = useState<clientProps>(clientPropsConst)
    const [openTimeCalendar, setOpenTimeCalendar] = useState<boolean>(false)
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false)



    const notifyWarning = () => toast.warning("Por favor, nos envie o formulário primeiro para prosseguir!", {
        position: "top-center"
    });


    const { data: dataClient, refetch } = api.booking.bookingQuery.useQuery()
    const { data: services } = api.booking.allServiceQuery.useQuery()

    const client = dataClient?.find(e => e.email === value.email)


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


    const handleSubmitBooking = (time: any) => {
        setIsOpenModal(true)
        setDate((prev) => ({ ...prev, dateTime: time }))
    }

    const handleFormSubmit = (data: FormDataProps) => {
        const { email, name, phone, service } = data

        if (data) {

            setValue({
                email,
                name,
                phone,
                service,
            })
            setOpenTimeCalendar(true)

            return true
        }

    }




    const times = date.justDate && getOpeningTimes(date.justDate, days,)
    // Retorna os horários disponíveis
    const returnHoursAvailabe = (time: string | Date, i: number) => {


        if (!!dataClient) {
            var countBooking = dataClient.filter(x => x.service.find(e => format(e.bookingDate, "d MMMM HH:mm") === format(time, "d MMMM HH:mm"))).length

            const existeBooking = dataClient.find((d) => d.service.find(e => format(e.bookingDate, "d MMMM HH:mm") === format(time, "d MMMM HH:mm")))


            return existeBooking && countBooking >= NUMERO_FUNCIONARIO ?
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


    }


    type FormDataProps = z.infer<typeof schemaFormClient>

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormDataProps>({
        mode: "all",
        reValidateMode: "onChange",
        resolver: zodResolver(schemaFormClient)
    })



    return (
        <section className="relative MAX-CONTAINER flex min-h-[90vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8-10 ">
            {
                !openTimeCalendar ? (
                    <div className="absolute top-0 -left-4">
                        <Button leftIcon={<HiOutlineLogin />} colorScheme='teal' onClick={onOpen}>
                            Cadastrar
                        </Button>
                        <Drawer
                            isOpen={isOpen}
                            placement='left'
                            initialFocusRef={undefined}
                            onClose={onClose}
                            size={"md"}
                        >
                            <DrawerOverlay />

                            <DrawerContent className="drawerContent">
                                <ScaleFade initialScale={0.9} in={isOpen}>
                                    <DrawerCloseButton />
                                    <DrawerHeader className="mt-11">

                                        <img
                                            className='mx-auto h-12 w-auto'
                                            src='https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg'
                                            alt='Workflow'
                                        />


                                    </DrawerHeader>

                                    <DrawerBody >
                                        <Stack flex={"flex"} justifyItems={"center"} alignItems={"center"} >
                                            <div>
                                                <h2 className='mt-6 text-center text-3xl font-bold '>Digite os dados necessários</h2>
                                                <p className='mt-2 text-center text-sm '>
                                                    Preencha os campos abaixo
                                                </p>
                                            </div>
                                        </Stack>
                                        <form className='mt-8 space-y-6' onSubmit={handleSubmit(handleFormSubmit)} >
                                            <div className="flex flex-col gap-6">
                                                <input
                                                    {...register("name")}
                                                    type="text"
                                                    placeholder="Nome completo"
                                                    className='relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2  focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                                                />
                                                {errors.name &&
                                                    <motion.span
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}

                                                        className="span-form">{errors.name.message}
                                                    </motion.span>
                                                }
                                                <input
                                                    {...register("email")}
                                                    type="text"
                                                    placeholder="E-mail exemple@email.com"
                                                    className='relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2  focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                                                />
                                                {errors.email &&
                                                    <motion.span
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="span-form">{errors.email.message}
                                                    </motion.span>
                                                }
                                                <InputMask
                                                    className='relative block w-full appearance-none rounded-md  border border-gray-300 px-3 py-2 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'

                                                    placeholder='Digite seu número de celular'

                                                    mask="99 99999-9999"
                                                    maskPlaceholder={null}
                                                    {...register('phone')}
                                                />
                                                {errors.phone &&
                                                    <motion.span
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="span-form">{errors.phone.message}
                                                    </motion.span>
                                                }
                                                <Select placeholder='Selecione um dos serviços'
                                                    {...register("service")}
                                                    required
                                                >
                                                    {
                                                        services?.map((s, index) => (
                                                            <option key={index} value={s.name}
                                                            >
                                                                {capitalize(s.name)}
                                                                <span> R${s.price.toFixed(2).replace(".", ",")}
                                                                </span>
                                                            </option>
                                                        ))
                                                    }
                                                </Select>
                                                {errors.service &&
                                                    <motion.span
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="span-form">{errors.service.message}
                                                    </motion.span>
                                                }
                                            </div>
                                            <DrawerFooter gap="3">

                                                <Button colorScheme="red" onClick={onClose}>
                                                    Cancelar
                                                </Button>

                                                <Button colorScheme="green" type="submit"
                                                >Salvar</Button>


                                            </DrawerFooter>

                                        </form>

                                    </DrawerBody>

                                </ScaleFade>

                            </DrawerContent>

                        </Drawer>
                    </div>
                ) : (
                    <div className="absolute top-0 -left-4">

                        <Button leftIcon={<CalendarIcon />} colorScheme='teal' onClick={onOpen}>
                            Verificar horários
                        </Button>
                        <Drawer
                            isOpen={isOpen}
                            placement='left'
                            initialFocusRef={undefined}
                            onClose={onClose}
                            size={"md"}
                        >
                            <DrawerOverlay />
                            <DrawerContent className="drawerContent">
                                <DrawerCloseButton />
                                <ScaleFade initialScale={0.9} in={isOpen}>
                                    <DrawerHeader >
                                        <div className="flex justify-center ">
                                            <Avatar size="xl" name={`${value.name}`} src='https://bit.ly/broken-link' />

                                        </div>
                                    </DrawerHeader>

                                    <DrawerBody >
                                        <Stack flex={"flex"} justifyItems={"center"} alignItems={"center"} marginBottom={"10"}>
                                            <div>
                                                <h2 className='mt-6 text-center text-3xl font-bold '>Ola, {value.name.split(" ", 1)}</h2>
                                                <p>Dê uma olhada no seus horários:</p>
                                            </div>
                                        </Stack>
                                        <Stack>
                                            <TableContainer>
                                                <Table variant='striped' colorScheme='teal' size='sm'>
                                                    {!dataClient?.find(e => e.email === value.email) && <TableCaption>Sem horários agendados</TableCaption>}
                                                    {dataClient?.find(e => e.email === value.email) && <TableCaption>Horários agendados</TableCaption>}
                                                    <Thead >
                                                        <Tr><Th></Th>
                                                            <Th>Dia</Th>
                                                            <Th>Mês</Th>
                                                            <Th>Hora</Th>
                                                            <Th>tipo de serviço</Th>
                                                            <Th>Valor do serviço</Th>
                                                        </Tr>
                                                    </Thead>
                                                    <Tbody>

                                                        {
                                                            client && client?.service.map((e) => (
                                                                <Tr >
                                                                    <Td>
                                                                        <Button variant="unstyled" size={"sm"} isDisabled={deleteSubmit}
                                                                            onClick={() => {
                                                                                bookingDelete({ id: e.id })
                                                                                setDeleteSubmit(true)
                                                                            }}>
                                                                            {
                                                                                <IconButton size={"sm"} variant={"unstyled"} aria-label='Deletar horário' icon={<DeleteIcon />} />
                                                                            }
                                                                        </Button>
                                                                    </Td>
                                                                    <Td>{format(e.bookingDate.toString(), "d")}</Td>
                                                                    <Td className="capitalize">{format(e.bookingDate.toString(), "MMMM", { locale: ptBR })}</Td>
                                                                    <Td >{format(e.bookingDate.toString(), "HH:mm")} </Td>
                                                                    <Td >{capitalize(e.name)} </Td>
                                                                    <Td >R$ {e.price.toFixed(2).replace(".", ",")} </Td>

                                                                </Tr>
                                                            ))
                                                        }

                                                    </Tbody>

                                                </Table>
                                            </TableContainer>
                                        </Stack>

                                    </DrawerBody>
                                    <DrawerFooter gap={"6px"}>
                                        <Button colorScheme="red" onClick={onClose}>
                                            Fechar
                                        </Button>
                                        <Button onClick={() => {
                                            setOpenTimeCalendar(false)
                                            setValue(clientPropsConst)
                                            reset()


                                        }}>
                                            Fazer um novo cadastro
                                        </Button>
                                    </DrawerFooter>
                                </ScaleFade>

                            </DrawerContent>
                        </Drawer>


                    </div>
                )
            }

            <div className="flex justify-center gap-10 md1:flex-wrap">
                <AnimatePresence initial={true}>


                    <motion.div className="flex flex-col items-center "
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h2 className="text-2xl mb-10">Agende seu hórario aqui conosco</h2>
                        <DynamicCalendar
                            minDate={now}
                            className='REACT-CALENDAR p-6'
                            view='month'
                            tileDisabled={({ date }) => closedDays.includes(formatISO(date),)}
                            onClickDay={(date) => openTimeCalendar ? setDate((prev) => ({ ...prev, justDate: date })) : notifyWarning()}
                        />
                    </motion.div>


                    {
                        !isVisible && date.justDate && openTimeCalendar &&
                        <motion.div className='flex flex-col items-center '
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2 className="text-2xl mb-10">Escolha o seu melhor horário</h2>

                            <div className="flex flex-col justify-center  items-center w-[450px] rounded-[15px] border border-[#d0d0d1]  min-h-[20rem]] bg-white flex-wrap  hover:shadow-[0_20px_50px_-5px_rgba(0,0,0,0.2)] transition ease-in-out duration-700 py-9 px-5 gap-6 text-[#000]" >
                                <h3 className="capitalize text-[1.rem]">Reservas disponíveis para o dia {format(date.justDate, "d 'de' MMMM", { locale: ptBR })}</h3>

                                <div className="flex flex-wrap justify-center gap-4  w-full">
                                    {times?.map((time, i) => (
                                        returnHoursAvailabe(time, i)

                                    ))}
                                </div>
                            </div>


                        </motion.div>

                    }
                </AnimatePresence>

            </div>




            <Modal isOpen={isOpenModal} setIsOpen={setIsOpenModal} clientName={value.name} email={value.email} bookingDate={date.dateTime} phone={value.phone} service={value.service}
            />

        </section >
    )




}

export default CalendarComponent;




