import { FC } from "react";
import Login from "@/components/Login";
import Head from "next/head";
import { parseCookies, } from 'nookies';
import { NextPageContext } from "next";

interface loginProps {
    cookieClient: boolean
}


const login: FC<loginProps> = ({ cookieClient }) => {


    return (
        <section>
            <Head>
                <title>Salão | Login</title>
            </Head>

            <Login cookiesClient={cookieClient} />
        </section>
    )

}

export async function getServerSideProps(ctx: NextPageContext) {
    await new Promise((resolve) => {
        setTimeout(resolve, 1000)
    })

    const cookies = parseCookies(ctx)
    if (cookies['user-Token-client']) {

        return { props: { cookieClient: true } }
    } else {

        return { props: { cookieClient: false } }
    }
}

export default login;
