import CalendarComponent from "@/components/Booking";
import { db } from "@/server/db";
import { formatISO } from "date-fns";
import { day } from '@prisma/client';
import Head from "next/head";
import { NextPage } from "next";

interface calendarProps {
    days: day[]
    closedDays: string[]
}

const Booking: NextPage<calendarProps> = ({ days, closedDays, }) => {



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
    const closedDays = (await db.closedday.findMany()).map((d) => formatISO(d.date))
    return { props: { days, closedDays, } }

}

export default Booking;