import { FC } from "react";
import Login from "@/components/Login";
import Head from "next/head";



const login: FC = () => {


    return (
        <section>
            <Head>
                <title>Salão | Login</title>
            </Head>

            <Login />
        </section>
    )

}

export async function getServerSideProps() {
    await new Promise((resolve) => {
        setTimeout(resolve, 1000)
    })

    return { props: {} }

}

export default login;
