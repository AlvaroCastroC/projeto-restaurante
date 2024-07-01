import { day } from '@prisma/client';
import Head from "next/head";
import Dashboard from "@/components/dashboard/Dashboard";
import { NextPage } from 'next';
import { db } from '@/server/db';

interface dashboardProps {
    days: day[]
}

const dashboard: NextPage<dashboardProps> = ({ days }) => {



    return (
        <section className="w-[100%]">
            <Head>
                <title>Salão | Agendamento</title>
            </Head>

            <main className="MAX-CONTAINER min-h-[70%] m-auto">
                <Dashboard days={days} />
            </main>
        </section>
    )
}

export async function getServerSideProps() {
    const days = await db.day.findMany()

    if (!(days.length === 7)) throw new Error('Insert all days into database')

    return { props: { days } }
}

export default dashboard;