import { Button } from '@chakra-ui/react'
import TimeSelector from '@/components/TimeSelector'
import { Switch } from '@headlessui/react'
import type { Day } from '@prisma/client'
import { formatISO } from 'date-fns'
import { type FC, useState } from 'react'
import { Calendar } from 'react-calendar'
import { toast, ToastContainer } from 'react-toastify'
import { now } from 'src/constants/config'
import { capitalize, classNames, weekdayIndexToName } from 'src/utils/helper'
import { api } from '@/utils/api'
import { notifyError } from '@/models/toastifyUse'

interface OpeningProps {
    days: day[]
}

const Opening: FC<OpeningProps> = ({ days }) => {
    const [enabled, setEnabled] = useState<boolean>(false)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)


    const [openingHrs, setOpeningHrs] = useState([
        { name: 'domingo', openTime: days[0]!.openTime, closeTime: days[0]!.closeTime },
        { name: 'segunda-feira', openTime: days[1]!.openTime, closeTime: days[1]!.closeTime },
        { name: 'terça-feira', openTime: days[2]!.openTime, closeTime: days[2]!.closeTime },
        { name: 'quarta-feira', openTime: days[3]!.openTime, closeTime: days[3]!.closeTime },
        { name: 'quinta-feira', openTime: days[4]!.openTime, closeTime: days[4]!.closeTime },
        { name: 'sexta-feira', openTime: days[5]!.openTime, closeTime: days[5]!.closeTime },
        { name: 'sábado', openTime: days[6]!.openTime, closeTime: days[6]!.closeTime },
    ])
    // tRPC

    const notifySuccess = () => {
        toast.success("Hórario de abertura salva", {
            position: "top-center"
        });

    }


    const { mutate: saveOpeningHrs, isPending } = api.opening.changeOpeningHours.useMutation({
        onSuccess: () => notifySuccess(),
        onError: (e) => notifyError(e.message),
    })
    const { mutate: closeDay } = api.opening.closeDay.useMutation({ onSuccess: () => refetch() })
    const { mutate: openDay } = api.opening.openDay.useMutation({ onSuccess: () => refetch() })
    const { data: closedDays, refetch } = api.opening.getClosedDays.useQuery()

    const dayIsClosed = selectedDate && closedDays?.includes(formatISO(selectedDate))

    function _changeTime(day: Day) {
        return function (time: string, type: 'openTime' | 'closeTime') {
            const index = openingHrs.findIndex((x) => x.name === weekdayIndexToName(day.dayOfWeek))
            const newOpeningHrs = [...openingHrs]
            newOpeningHrs[index]![type] = time
            setOpeningHrs(newOpeningHrs)
        }
    }

    return (
        <div className='mx-auto max-w-xl min-h-[90vh]'>
            <ToastContainer pauseOnFocusLoss={false} autoClose={2500} limit={1} pauseOnHover={false} />
            <div className='mt-20 flex justify-center gap-6'>
                <p className={`${!enabled ? 'font-medium' : ''}`}>Hórario de abertura</p>
                <Switch
                    checked={enabled}
                    onChange={setEnabled}
                    className={classNames(
                        enabled ? 'bg-indigo-600' : 'bg-gray-200',
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                    )}>
                    <span className='sr-only'>Use setting</span>
                    <span
                        aria-hidden='true'
                        className={classNames(
                            enabled ? 'translate-x-5' : 'translate-x-0',
                            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                        )}
                    />
                </Switch>
                <p className={`${enabled ? 'font-medium' : ''}`}>Dias de abertura</p>
            </div>

            {!enabled ? (


                <div className='my-12 flex flex-col gap-8'>
                    {days.map((day) => {
                        const changeTime = _changeTime(day)
                        return (
                            <div className='grid grid-cols-3 place-items-center' key={day.id}>
                                <h3 className='font-semibold'>{capitalize(weekdayIndexToName(day.dayOfWeek)!)}</h3>
                                <div className='mx-4'>
                                    <TimeSelector
                                        type='openTime'
                                        changeTime={changeTime}
                                        selected={
                                            openingHrs[openingHrs.findIndex((x) => x.name === weekdayIndexToName(day.dayOfWeek))]
                                                ?.openTime
                                        }
                                    />
                                </div>

                                <div className='mx-4'>
                                    <TimeSelector
                                        type='closeTime'
                                        changeTime={changeTime}
                                        selected={
                                            openingHrs[openingHrs.findIndex((x) => x.name === weekdayIndexToName(day.dayOfWeek))]
                                                ?.closeTime
                                        }
                                    />
                                </div>
                            </div>
                        )
                    })}

                    <Button
                        onClick={() => {
                            const withId = openingHrs.map((day) => ({
                                ...day,
                                id: days[days.findIndex((d) => d.name === day.name)]!.id,
                            }))

                            saveOpeningHrs(withId)
                        }}
                        isLoading={isPending}
                        colorScheme='green'
                        variant='solid'>
                        Salvar horário
                    </Button>
                </div>
            ) : (
                <div className='mt-6 flex flex-col items-center gap-6'>
                    <Calendar
                        minDate={now}
                        className='REACT-CALENDAR p-2'
                        view='month'
                        onClickDay={(date) => setSelectedDate(date)}
                        tileClassName={({ date }) => {
                            return closedDays?.includes(formatISO(date)) ? 'closed-day' : null
                        }}
                    />

                    <Button
                        onClick={() => {
                            if (dayIsClosed) openDay({ date: selectedDate })
                            else if (selectedDate) closeDay({ date: selectedDate })
                        }}
                        disabled={!selectedDate}
                        isLoading={isPending}
                        colorScheme='green'
                        variant='solid'>
                        {dayIsClosed ? 'Abrir a loja neste dia' : 'Fechar a loja neste dia'}
                    </Button>
                </div>
            )}
        </div>
    )
}



export default Opening