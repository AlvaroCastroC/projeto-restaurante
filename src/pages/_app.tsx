import { type AppType } from "next/app";
import { Inter } from "next/font/google";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import "@/styles/header.css";
import "@/styles/card.css";
import "@/styles/Calendar.css"

import Header from "@/components/H_F_/Header";
import Footer from "@/components/H_F_/Footer";



const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <main className={`font-sans ${inter.variable} `}>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </main>
  );
};

export default api.withTRPC(MyApp);
