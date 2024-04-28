import { FC, useState } from "react";
import ReactCalendar from "react-calendar";
import { add, format } from "date-fns";
import { ARBERTURA_CLINICA, FECHAMENTO_CLINICA, INTERVALO } from "@/constants/config";

interface calendarProps {

}

interface DateType {
    justDate: Date | null
    dateTime: Date | null
}


const CalendarComponent: FC<calendarProps> = ({ }) => {

    function refresh() { location.reload() }


    const [date, setDate] = useState<DateType>({
        justDate: null,
        dateTime: null,
    })

    const getTimes = () => {
        if (!date.justDate) return

        const { justDate } = date

        const beginning = add(justDate, { hours: ARBERTURA_CLINICA })
        const end = add(justDate, { hours: FECHAMENTO_CLINICA })
        const interval = INTERVALO // in minutes

        const times = []

        for (let i = beginning; i <= end; i = add(i, { minutes: interval })) {
            times.push(i)
        }
        return times
    }

    const times = getTimes()

    console.log(date.dateTime)

    return (
        <div className="REACT-CALENDAR p-2 flex flex-row justify-center my-11 gap-20 md1:flex-col md1:items-center">

            <div>
                <h2 className="text-2xl mb-10">Agende seu hórario aqui conosco</h2>
                <ReactCalendar minDate={new Date()} view="month" onClickDay={(date) => setDate((prev) => ({ ...prev, justDate: date }))} locale="pt-BR" />
            </div>


            {date?.justDate ? (

                <div >

                    <h3 className="text-2xl mb-10">Escolha um horário</h3>
                    <div className="flex items-center justify-center gap-4 flex-wrap max-w-[400px] rounded-2xl bg-white h-[20rem] shadow-sm shadow-gray-400 p-5  ">

                        {times?.map((time, i) => (
                            <div key={`time-${i}`} className=" rounded-lg bg-[#f0f0f0] py-2 px-4 hover:bg-[#edf6ff]">
                                <button type="button" onClick={() => setDate((prev) => ({ ...prev, dateTime: time }))}>
                                    {format(time, "kk:mm")}
                                </button>
                            </div>
                        ))}


                    </div>
                    <button className="bg-gray-300 p-2 rounded-md hover:bg-slate-200 mt-3 " type='button' onClick={refresh}> {`<-`}Voltar</button>
                </div>
            ) : (


                <div>
                    <h2 className="text-2xl mb-10">Ou entre em contato</h2>
                    <form action="" method="">
                        <div className="min-w-[400px] rounded-2xl bg-white h-[20rem] shadow-sm shadow-gray-400 p-5">
                            <div className="flex gap-10">

                                <div className="flex flex-col">
                                    <label>Nome completo</label>
                                    <input type="text" placeholder="Digite aqui" />
                                </div>

                                <div className="flex flex-col">
                                    <label>Email</label>
                                    <input type="email" placeholder="Digite aqui" />
                                </div>
                            </div>
                            <div className="flex flex-col">

                                <label>Telefone</label>
                                <input type="tel" placeholder="Digite aqui" />
                            </div>

                            <div className="flex flex-col">
                                <label>Área de Texto</label>
                                <input type="textarea" placeholder="Digite aqui" />
                            </div>
                        </div>
                    </form>
                </div>
            )
            }
        </div>
    )

}

export default CalendarComponent;