
import { Avatar, Container, HStack, VStack } from "@chakra-ui/react";

import Head from "next/head";
import React, { FC, ReactElement, useState } from "react";
import PopOverCreateService from "./PopOver/PopOverCreateService";
import { HiMiniUsers } from "react-icons/hi2";
import Register from "@/components/Register";
import { CalendarIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Button, Collapse, Divider, Flex, IconButton, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverHeader, PopoverTrigger, useDisclosure } from "@chakra-ui/react";
import { FaScissors } from "react-icons/fa6";
import { IoPerson } from "react-icons/io5";
import TableClient from "./TableClients";
import { api } from "@/utils/api";
import { capitalize } from "@/utils/helper";

import { MdManageAccounts } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { useRouter } from "next/router";
import { destroyCookie } from "nookies";

import { day } from "@prisma/client";
import Opening from "./Opening";
import AccountEdit from "./AccountEdit";
import PopOverUpdateUser from "./PopOver/PopOverUpdateUser";
import TableEmployees from "./TableEmployees";



interface dashBoardProps {
    days: day[]
}

interface PopOverReturnElement {
    option: string
    component: ReactElement
    title: string
    content: string
}


const Dashboard: FC<dashBoardProps> = ({ days }) => {
    const router = useRouter()
    const redirect = () => router.push('/')

    const { isOpen, onToggle } = useDisclosure()
    const [option, setOption] = useState<string>("Tabela")


    // tRPC
    const { data: user, refetch } = api.user.userAdmin.useQuery()


    const Option = () => {
        switch (option) {
            case "Tabela":
                return user ? <TableClient isVisible={true} /> : <p>Atualize sua conta</p>
            case "Serviços":
                return user ? <PopOverCreateService isVisible={true} /> : <p>Atualize sua conta</p>
            case "Abertura":
                return user ? <Opening days={days} /> : <p>Atualize sua conta</p>
            case "Conta":
                return user ? <AccountEdit isVisible={true} /> : <Register role="admin" />
            case "Funcionarios":
                return user ? <TableEmployees /> : <p>Atualize sua conta</p>
            default:
                return <p>Atualize sua conta</p>
        }
    }

    const PopoverReturn = ({ option, component, title, content }: PopOverReturnElement) => {
        if (isOpen) {
            return <Button size={"md"} bg={"unstyled"} leftIcon={component} onClick={() => setOption(option)}>
                {title}
            </Button>
        } else {

            return <Popover trigger="hover" placement="right">
                <PopoverTrigger>
                    <IconButton bg="unstyled" aria-label='' size={"md"} icon={component} onClick={() => setOption(option)} />
                </PopoverTrigger>
                <PopoverContent maxWidth={"250px"} p={2} color='white' bg='blue.800' borderColor='blue.800'>
                    <PopoverArrow bg='blue.800' />

                    <PopoverHeader fontWeight='bold' >{title}</PopoverHeader>
                    <PopoverBody>{content}</PopoverBody>
                </PopoverContent>
            </Popover>
        }
    }

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
                                user ? user?.map(item => {
                                    if (item !== undefined) {
                                        if (isOpen) {

                                            return <Flex direction={"column"} alignItems={"center"}>


                                                <Avatar bg='red.500' name={item.firstName + item.secondName} size='lg' src={item.url} />
                                                <p>{capitalize(item.role)} {" "}{capitalize(item.firstName)}</p>
                                                <p>{item.email}</p>
                                                <PopOverUpdateUser id={item.id} firstName={item.firstName} secondName={item.secondName} oldKey={item.imageKey} refetch={refetch} />


                                            </Flex>



                                        }
                                        else {
                                            return <Avatar bg='red.500' size='md' src={item.url} />


                                        }
                                    }
                                }) : isOpen ? (



                                    <Flex direction={"column"} alignItems={"center"}>


                                        <Avatar bg='red.500' name={'admin'} size='lg' />
                                        <p>{capitalize("admin")} {" "}{capitalize("Admin")}</p>

                                    </Flex>

                                )


                                    : (
                                        <Avatar bg='red.500' size='md' />


                                    )


                            }


                            <Divider mt={3} mb={3} />

                            <Collapse
                                in={isOpen}
                                startingHeight={"100%"}
                                endingHeight={"100%"}


                            >
                                <Flex direction={"column"} alignItems={"flex-start"} width={isOpen ? "100%" : ""} padding={2} gap={2}>

                                    {/* Abertura  */}

                                    {
                                        PopoverReturn({
                                            option: "Abertura", component: <CalendarIcon />, title: "Abertura da loja", content: "Acesse seus horários de abertura, e configure o dias de fechamento."
                                        })
                                    }


                                    {/* Tabela de clientes  */}

                                    {
                                        PopoverReturn({
                                            option: "Tabela", component: <IoPerson />, title: "Tabela de clientes", content: "Veja os clientes que reservaram em sua loja, visualize e apague."
                                        })
                                    }

                                    {/* Tabela de serviços  */}

                                    {

                                        PopoverReturn({
                                            option: "Serviços", component: <FaScissors />, title: "Serviços", content: "Veja todos os seus serviços listados, edite-os caso necessário."
                                        })
                                    }

                                    {/* Tabela de funcionarios  */}

                                    {

                                        PopoverReturn({
                                            option: "Funcionarios", component: <HiMiniUsers />, title: "Tabela de funcionários", content: "Gerencia a quantidade de funcionários que há na sua empresa, e especifique suas habilidades."
                                        })
                                    }



                                    <Divider mt={3} mb={3} />

                                    {/* Editar conta */}

                                    {

                                        PopoverReturn({
                                            option: "Conta", component: <MdManageAccounts />, title: "Atualizar conta", content: "Atualize sua conta, caso queria trocar de senha, ou email."
                                        })
                                    }

                                    {/* Sair da conta */}

                                    {isOpen ?
                                        <Button bg={"unstyled"} leftIcon={<FiLogOut />}
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
                            </Collapse>

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

