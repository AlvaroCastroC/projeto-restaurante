import CalendarComponent from "@/components/Calendar";
import { db } from "@/server/db";
import { formatISO } from "date-fns";
import { type NextPage } from "next";
import { Day } from '@prisma/client'
import Head from "next/head";

interface calendarProps {
    days: Day[]
    closedDays: string[]
}

const Agendamento: NextPage<calendarProps> = ({ days, closedDays, }) => {



    return (
        <section className="w-[100%]">
            <Head>
                <title>Salão | Agendamento</title>
            </Head>

            <main className="MAX-CONTAINER min-h-[70%] m-auto">
                <CalendarComponent days={days} closedDays={closedDays} />
            </main>
        </section>
    )
}

export async function getServerSideProps() {

    const days = await db.day.findMany()
    const closedDays = (await db.closedDay.findMany()).map((d) => formatISO(d.date))
    return { props: { days, closedDays, } }

}

export default Agendamento;