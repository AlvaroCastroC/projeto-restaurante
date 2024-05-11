import { Flex, SlideFade, useBoolean } from "@chakra-ui/react"
import Link from "next/link"


function Header() {
    const [flag, setFlag] = useBoolean()

    return (
        <header className=" w-[100%] bg-white">
            <div className="MAX-CONTAINER h-24 m-auto flex items-center justify-between px-6 ">
                <div className="flex justify-center gap-1">
                    <img src="" alt="Logo" title="Logo" />
                    <Link href="/" className="text-2xl  px-1">Nome da loja</Link >
                </div>

                <nav className="flex items-center gap-3 ">
                    <Link href="/sobre" className="text-[1.3rem] px-1 transition ease-in duration-400	  hover:border-blue-500 hover:border-b-2 "> Sobre nós </Link>

                    <div onMouseEnter={setFlag.on} onMouseLeave={setFlag.off} >

                        <p className="flex gap-2 p-1 items-center cursor-pointer w-full text-[1.3rem] transition ease-in duration-400 hover:border-blue-500 hover:border-b-2 ">Nossos serviços</p>
                        <SlideFade in={flag} offsetY='-4px' transition={{ exit: { delay: 0.5 }, enter: { duration: 0.5 } }}
                        >
                            <Flex position="absolute" p="15px" w="11rem"
                                direction="column" alignItems="center" className=" shadow-[0px_50px_50px_-35px_rgba(0,0,0,0.2)] gap-2 " bg="white">
                                <Link href="/servico1" className="text-[1rem] hover:text-[rgba(7,65,173,1)] ">Serviços 1</Link>
                                <Link href="/servico2" className="text-[1rem] hover:text-[rgba(7,65,173,1)] ">Serviços 2</Link>
                                <Link href="/servico3" className="text-[1rem] hover:text-[rgba(7,65,173,1)] ">Serviços 3</Link>
                            </Flex>
                        </SlideFade>
                    </div>


                    <Link href="/contato" className="text-[1.3rem] px-1 transition ease-in duration-400 hover:border-blue-500 hover:border-b-2">Contato</Link>
                    <Link href="/login" className="text-[1.3rem] px-1 transition ease-in duration-400 hover:border-blue-500 hover:border-b-2"> Login</Link>
                </nav>
            </div >
        </header >
    )
}

export default Header


