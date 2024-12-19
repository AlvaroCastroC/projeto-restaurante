import { type AppType } from "next/app"
import '@/styles/globals.css'
import { api } from "@/utils/api"

import { Flip, ToastContainer, } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Header from "./_components/Header";
import { Providers } from "./providers"




const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <main className="light">

      <Providers>
        <ToastContainer pauseOnFocusLoss={false} autoClose={2500} limit={1} pauseOnHover={false} transition={Flip} />

        <Header />
        <Component {...pageProps} />
      </Providers>

    </main>
  );
};

export default api.withTRPC(MyApp);
