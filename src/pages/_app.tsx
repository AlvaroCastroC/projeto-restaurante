import { type AppType } from "next/app"

import { api } from "@/utils/api"

import Header from "@/components/component/Header"
import Footer from "@/components/component/Footer"
import { ToastContainer } from "react-toastify"

import { ChakraProvider } from '@chakra-ui/react'
import { Router } from "next/router"
import NProgress from "nprogress"

import "@/styles/globals.css"
import "@/styles/card.css"
import "@/styles/Calendar.css"
import "react-toastify/dist/ReactToastify.css"
import "@/styles/nprogress.css"
import { theme } from "@/styles/theme"

NProgress.configure({
  showSpinner: false,
  minimum: 0.5

})

Router.events.on("routeChangeStart", () => {
  NProgress.start();
})

Router.events.on("routeChangeComplete", () => {
  NProgress.done();
})

Router.events.on("routeChangeError", () => {
  NProgress.done();
})



const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <main >

        <Header />
        <ToastContainer pauseOnFocusLoss={false} autoClose={2500} limit={1} pauseOnHover={false} />
        <Component {...pageProps} />
        <Footer />
      </main>

    </ChakraProvider>
  );
};

export default api.withTRPC(MyApp);
