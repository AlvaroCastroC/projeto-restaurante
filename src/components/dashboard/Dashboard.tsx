
import { Avatar, Container, HStack, VStack } from "@chakra-ui/react";

import Head from "next/head";
import { FC, useEffect, useState } from "react";
import PopOverCreateService from "./PopOver/PopOverCreateService";

import { CalendarIcon, EditIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Button, Collapse, Divider, Flex, IconButton, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverHeader, PopoverTrigger, useDisclosure } from "@chakra-ui/react";
import { FaScissors } from "react-icons/fa6";
import { IoPerson } from "react-icons/io5";
import Link from "next/link";
import TableClient from "./TableClients";
import { api } from "@/utils/api";
import { capitalize } from "@/utils/helper";

import { FiLogOut } from "react-icons/fi";
import { useRouter } from "next/router";
import { destroyCookie } from "nookies";


interface dashBoardProps {
}




const Dashboard: FC<dashBoardProps> = () => {
    const router = useRouter()
    const redirect = () => router.push('/')

    const { isOpen, onToggle } = useDisclosure()
    const [option, setOption] = useState<string>("Tabela")
    const [userData, setUSer] = useState<string>()
    const { data: user } = api.user.userQuery.useQuery({
        email: userData!
    })



    const Option = () => {
        switch (option) {
            case "Tabela":
                return <TableClient />
            case "Serviços":
                return <PopOverCreateService />
            case "Abertura":
                return
            default:
                return ""
        }
    }

    useEffect(() => {
        const getDataStorage = sessionStorage.getItem('user-data')
        if (getDataStorage !== undefined) {

            setUSer(sessionStorage.getItem('user-data')?.toString())

        }

    }, [])

    return (
        <div>
            <Head>
                <title>Salão | Dashboard</title>
            </Head>

            <section className="MAX-CONTAINER">
                <Container maxW='100%' justifyContent={"space-around"} >



                    <HStack alignItems={"flex-start"} >
                        {/*    SideBar     */}
                        <Flex
                            direction={"column"}
                            bg={"white"}
                            boxShadow='lg'
                            alignItems={"center"}
                            justifyItems={"center"}
                            gap={4}
                            p={2}
                            rounded={10}
                            minHeight={"500px"}

                        >
                            {isOpen ?
                                <Button variant="unstyled" rightIcon={<HamburgerIcon />} onClick={onToggle}
                                >
                                    Dashboard
                                </Button>

                                :

                                <IconButton bg="unstyled" aria-label='' onClick={onToggle} icon={<HamburgerIcon />} />
                            }

                            {
                                isOpen ? <Flex direction={"column"} alignItems={"center"}>

                                    <Avatar bg='red.500' src='https://bit.ly/broken-link' size='lg' />
                                    <p>{capitalize(user!.role)} {" "}{user?.firstName}</p>

                                    <Button leftIcon={<EditIcon />} variant={"link"}>Editar perfil</Button>
                                </Flex>
                                    :
                                    <Avatar bg='red.500' src='https://bit.ly/broken-link' size='sm' />

                            }


                            <Divider mt={3} mb={3} />

                            <Collapse
                                in={isOpen}
                                startingHeight={"100%"}
                                endingHeight={"100%"}


                            >
                                <Flex direction={"column"} alignItems={"flex-start"} width={isOpen ? "100%" : ""} padding={2} gap={2}>

                                    {/* Abertura  */}
                                    {isOpen ?
                                        <Button bg={"unstyled"} as={Link} href="/dashboard/opening" leftIcon={<CalendarIcon />}>
                                            Opening
                                        </Button> :
                                        <Popover trigger="hover" placement="right">
                                            <PopoverTrigger>
                                                <IconButton bg="unstyled" as={Link} href="/dashboard/opening" aria-label='' icon={<CalendarIcon />} />
                                            </PopoverTrigger>
                                            <PopoverContent maxWidth={"250px"} p={2} color='white' bg='blue.800' borderColor='blue.800'>
                                                <PopoverArrow bg='blue.800' />

                                                <PopoverHeader fontWeight='bold' >Abertura</PopoverHeader>
                                                <PopoverBody>Acesse seus horários de abertura, e configure o dias de fechamento.</PopoverBody>
                                            </PopoverContent>
                                        </Popover>}

                                    {/* Tabela de clientes  */}
                                    {isOpen ?
                                        <Button bg={"unstyled"} leftIcon={<IoPerson />} onClick={() => setOption("Tabela")}>
                                            Tabela de clientes
                                        </Button> :
                                        <Popover trigger="hover" placement="right">
                                            <PopoverTrigger>
                                                <IconButton bg="unstyled" aria-label='' icon={<IoPerson />} onClick={() => setOption("Tabela")} />
                                            </PopoverTrigger>
                                            <PopoverContent maxWidth={"250px"} p={2} color='white' bg='blue.800' borderColor='blue.800'>
                                                <PopoverArrow bg='blue.800' />

                                                <PopoverHeader fontWeight='bold' >Tabela de clientes</PopoverHeader>
                                                <PopoverBody>Veja os clientes que reservaram em sua loja, visualize e apague.</PopoverBody>
                                            </PopoverContent>
                                        </Popover>}

                                    {/* Tabela de serviços  */}
                                    {isOpen ?
                                        <Button bg={"unstyled"} leftIcon={<FaScissors />} onClick={() => setOption("Serviços")}>
                                            Serviços
                                        </Button> :
                                        <Popover trigger="hover" placement="right">
                                            <PopoverTrigger>
                                                <IconButton bg="unstyled" aria-label='' icon={<FaScissors />} onClick={() => setOption("Serviços")} />
                                            </PopoverTrigger>
                                            <PopoverContent maxWidth={"250px"} p={2} color='white' bg='blue.800' borderColor='blue.800'>
                                                <PopoverArrow bg='blue.800' />

                                                <PopoverHeader fontWeight='bold' >Serviços</PopoverHeader>
                                                <PopoverBody>Veja todos os seus serviços listados, edite-os caso necessário.</PopoverBody>
                                            </PopoverContent>
                                        </Popover>}



                                </Flex>
                            </Collapse>

                            <Divider mt={3} mb={3} />



                            <Flex direction={"column"} alignItems={"flex-start"} width={isOpen ? "100%" : ""} padding={2} gap={2}>
                                {isOpen ?
                                    <Button bg={"unstyled"} rightIcon={<FiLogOut />}
                                        onClick={() => {
                                            redirect()
                                            destroyCookie(null, 'user-Token-admin')
                                        }}
                                    >
                                        Sair
                                    </Button>

                                    :

                                    <Popover trigger="hover" placement="right">
                                        <PopoverTrigger>
                                            <IconButton bg="unstyled" aria-label='LogOut' icon={<FiLogOut />} onClick={() => {
                                                redirect()
                                                destroyCookie(null, 'user-Token-admin')
                                            }} />
                                        </PopoverTrigger>
                                        <PopoverContent maxWidth={"250px"} p={2} color='white' bg='blue.800' borderColor=' blue.800' width={"100%"}>
                                            <PopoverArrow bg='blue.800' />

                                            <PopoverHeader fontWeight='bold' border='0' >Sair do dashboard?</PopoverHeader>

                                        </PopoverContent>
                                    </Popover>
                                }
                            </Flex>
                        </Flex>

                        <VStack
                            bg={"white"}
                            width={"100%"}
                            minHeight={"500px"}
                            justify={"center"}
                            gap={4}
                            p={2}
                            rounded={10}
                            boxShadow='lg'
                        >


                            {
                                Option()
                            }
                        </VStack>
                    </HStack>


                </Container>

            </section>
        </div >
    )
}


export default Dashboard

