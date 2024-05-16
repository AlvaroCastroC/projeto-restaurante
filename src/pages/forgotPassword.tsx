import ForgotPassword from "@/components/ForgotPassword";
import Head from "next/head";
import { FC } from "react";

interface userProps { }


const forgotPassword: FC<userProps> = () => {
    return (
        <section>
            <Head>
                <title>Salão | Atualização de registro</title>
            </Head>
            <ForgotPassword />
        </section>
    )
}


export async function getServerSideProps() {
    await new Promise((resolve) => {
        setTimeout(resolve, 1000)
    })

    return { props: {} }

}

export default forgotPassword