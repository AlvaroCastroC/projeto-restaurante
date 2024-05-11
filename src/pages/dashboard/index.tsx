import Head from "next/head";
import { FC } from "react";

interface dashBoardProps { }

const dashboard: FC<dashBoardProps> = ({ }) => {
    return (
        <section>
            <Head>
                <title>Salão | Dashboard</title>
            </Head>
            dashboard
        </section>
    )
}

export default dashboard