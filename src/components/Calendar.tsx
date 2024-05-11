import { type FC, useEffect, useState } from "react";
import { format, formatISO, isBefore, parse } from "date-fns";
import { INTERVALO, now } from "@/constants/config";
import { useRouter } from "next/router";
import { Client, Day } from '@prisma/client'
import type { DateTime } from 'src/utils/types'
import { getOpeningTimes, roundToNearestMinutes } from "@/utils/helper";
import { ptBR } from "date-fns/locale/pt-BR"
import dynamic from "next/dynamic";
import { notifyError } from "@/models/toastifyUse";
import { toast } from "react-toastify";
import { api } from "@/utils/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaFormClient } from "@/models/userSchemaValidation";
import { z } from "zod";
import InputMask from "react-input-mask";
import { AnimatePresence, motion } from "framer-motion";

const DynamicCalendar = dynamic(() => import('react-calendar'), { ssr: false })


interface CalendarProps {
    days: Day[]
    closedDays: string[]
    booking: Client[]
}

interface clientProps {
    name: string
    email: string
    phone: string
}

const CalendarComponent: FC<CalendarProps> = ({ days, closedDays, booking }, { isVisible }) => {
    const router = useRouter()
    const reload = () => location.reload()


    const rounded = roundToNearestMinutes(now, INTERVALO)
    const today = days.find((d) => d.dayOfWeek === now.getDay());

    if (today !== undefined) {
        const closing = parse(today?.closeTime, 'kk:mm', now)
        const tooLate = !isBefore(rounded, closing)
        if (tooLate) closedDays.push(formatISO(new Date().setHours(0, 0, 0, 0)))

    }

    const [date, setDate] = useState<DateTime>({
        justDate: null,
        dateTime: null,
    })

    const [value, setValue] = useState<clientProps>({
        email: "",
        name: "",
        phone: "",
    })


    const [open, setOpen] = useState<boolean>(false)


    const notifySubmitSuccess = () => {
        toast.success("Cadastro feito com sucesso!", {
            position: "top-center"
        });

    }

    const notifyWarning = () => {
        toast.warning("Por favor, nos envie o formulário primeiro para prosseguir!", {
            position: "top-center"
        });

    }

    const notifyUpdateSuccess = () => {
        toast.success("Horário remarcado com sucesso.", {
            position: "top-center"
        });

    }

    const { mutate: bookingCreate, } = api.booking.bookingCreate.useMutation({
        onSuccess: () => {
            notifySubmitSuccess()
            // router.push('/menu')
            setTimeout(reload, 3000)
        },

        onError(erro) {
            notifyError(erro.message)
        },
    })


    // Enviará as informações para o banco de dados 
    const handleSubmitBooking = (time: any) => {
        let value
        const getDataStorage = localStorage.getItem('remember-client')
        if (getDataStorage) {

            value = JSON.parse(getDataStorage)

        }

        bookingCreate({
            bookingDate: format(time, "d MMMM HH:mm", { locale: ptBR }),
            clientName: value.name,
            email: value.email,
            phone: value.phone,
        })

        setDate((prev) => ({ ...prev, dateTime: time }))

    }

    const handleFormSubmit = (data: FormDataProps) => {
        const { email, name, phone } = data

        localStorage.setItem("remember-client", JSON.stringify({ name, email, phone }))
        setValue({
            email,
            name,
            phone,
        })
        setOpen(true)
        return true

    }



    const { mutate: bookingUpdate } = api.booking.bookingUpdate.useMutation({
        onSuccess: () => {
            notifyUpdateSuccess()
            // router.push('/menu')
            // setTimeout(reload, 1500)
        },

        onError(erro) {
            notifyError(erro.message)
            setTimeout(reload, 3000)
        },
    })


    // Atualizará as informações para o banco de dados 
    const handleUpdateBooking = (time: any, email: string) => {

        bookingUpdate({

            bookingDate: format(time, "d MMMM kk:mm", { locale: ptBR }),
            email,

        })
        setDate((prev) => ({ ...prev, dateTime: time }))

    }


    const times = date.justDate && getOpeningTimes(date.justDate, days)

    // Retorna os horários disponíveis
    const returnHoursAvailabe = (time: any, i: number) => {

        return booking.find(e => e.bookingDate === format(time, "d MMMM kk:mm", { locale: ptBR })) ?
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
                    <button onClick={() => handleSubmitBooking(time)} type='button'>
                        {format(time, "kk:mm")}
                    </button>

                </div>

            )

    }

    // Retorna os horários disponíveis para trocar
    const returnHoursChangeAvailable = (time: any, i: number) => {

        return booking.find(e => e.bookingDate === format(time, "d MMMM kk:mm", { locale: ptBR })) ?
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
                    <button onClick={() => handleUpdateBooking(time, value.email)} type='button'>
                        {format(time, "kk:mm")}
                    </button>

                </div>

            )

    }


    type FormDataProps = z.infer<typeof schemaFormClient>

    const { register, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        mode: "all",
        reValidateMode: "onChange",
        resolver: zodResolver(schemaFormClient)
    })



    return (
        <section className='MAX-CONTAINER flex flex-col min-h-[90vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 '>

            <div className="flex gap-10 ">
                <AnimatePresence initial={true}>
                    {!isVisible && !open ?

                        <motion.div
                            className='w-full max-w-md space-y-8 hover:shadow-[0_20px_50px_-5px_rgba(0,0,0,0.2)]  py-12 px-7 rounded-md transition ease-in-out duration-700'
                            initial={{ opacity: 0, }}
                            animate={{ opacity: 1, }}
                            exit={{ opacity: 0, }}

                        >
                            <div>
                                <img
                                    className='mx-auto h-12 w-auto'
                                    src='https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg'
                                    alt='Workflow'
                                />
                                <h2 className='mt-6 text-center text-3xl font-bold text-gray-900'>Digite os dados necessários</h2>
                                <p className='mt-2 text-center text-sm text-gray-600'>
                                    Preencha os campos abaixo
                                </p>
                            </div>
                            <form className='mt-8 space-y-6' onSubmit={handleSubmit(handleFormSubmit)} >
                                <div className="flex flex-col gap-6">
                                    <input
                                        {...register("name")}
                                        type="text"
                                        placeholder="Nome completo"
                                        className='relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
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
                                        className='relative block w-full appearance-none  rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
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
                                        className='relative block w-full appearance-none rounded-md  border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'

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
                                </div>

                                <button
                                    type="submit"
                                    className='group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'

                                >enviar</button>
                            </form>
                        </motion.div>
                        : ""
                    }
                </AnimatePresence>
                <motion.div className="flex flex-col items-center "
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}

                >
                    <h2 className="text-2xl mb-10">Agende seu hórario aqui conosco</h2>
                    <DynamicCalendar
                        minDate={now}
                        className='REACT-CALENDAR p-6'
                        view='month'
                        tileDisabled={({ date }) => closedDays.includes(formatISO(date),)}
                        onClickDay={(date) => open ? setDate((prev) => ({ ...prev, justDate: date })) : notifyWarning()}
                    />
                </motion.div>


                {
                    !isVisible && date.justDate && open && !(booking.find(e => e.email === value.email)) ? (
                        <motion.div className='flex flex-col items-center '
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <h2 className="text-2xl mb-10">Escolha o seu melhor horário</h2>

                            <div className="flex flex-col justify-center  items-center w-[450px] rounded-[15px] border border-[#d0d0d1]  min-h-[20rem]] bg-white flex-wrap  hover:shadow-[0_20px_50px_-5px_rgba(0,0,0,0.2)] transition ease-in-out duration-700 py-9 px-5 gap-6" >
                                <h3 className="capitalize text-[1.rem]">Reservas disponíveis para o dia {format(date.justDate, "d 'de' MMMM", { locale: ptBR })}</h3>

                                <div className="flex flex-wrap justify-center gap-4  w-full">
                                    {times?.map((time, i) => (
                                        returnHoursAvailabe(time, i)

                                    ))}
                                </div>
                            </div>


                        </motion.div>
                    ) :

                        !isVisible && date.justDate && open ?
                            (
                                <motion.div className='flex flex-col items-center '
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <h2 className="text-2xl mb-10">Escolha o seu melhor horário</h2>

                                    <div className="flex flex-col justify-center  items-center w-[450px] rounded-[15px] border border-[#d0d0d1]  min-h-[20rem]] bg-white flex-wrap  hover:shadow-[0_20px_50px_-5px_rgba(0,0,0,0.2)] transition ease-in-out duration-700 py-9 px-5 gap-6" >
                                        <h3 className="capitalize text-[1.1rem]">Remarcar horário para o dia {format(date.justDate, "d 'de' MMMM", { locale: ptBR })}</h3>

                                        <div className="flex flex-wrap justify-center gap-4  w-full">

                                            {times?.map((time, i) => (

                                                returnHoursChangeAvailable(time, i)

                                            ))}
                                        </div>
                                    </div>


                                </motion.div>
                            )
                            : ""
                }


            </div>

        </section>
    )

}

export default CalendarComponent;




