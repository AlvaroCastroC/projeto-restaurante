import Register from "@/components/Register";
import Head from "next/head";
import { FC } from "react";

interface registerProps { }


const register: FC<registerProps> = () => {
    return (
        <section>
            <Head>
                <title>Salão | Register</title>
            </Head>
            <Register />
        </section>
    )
}

export async function getServerSideProps() {
    await new Promise((resolve) => {
        setTimeout(resolve, 1000)
    })

    return { props: {} }

}

export default register;