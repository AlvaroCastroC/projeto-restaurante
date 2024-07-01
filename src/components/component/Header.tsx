import { CalendarIcon, HamburgerIcon, } from "@chakra-ui/icons"
import { GrLogin, } from "react-icons/gr";
import { FiLogOut } from "react-icons/fi";

import { RiHome2Line, RiMoonLine, RiSunLine } from "react-icons/ri";
import { Avatar, Box, Button, Divider, Flex, FormControl, FormLabel, HStack, Heading, IconButton, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Switch, Text, VStack, useBoolean, useColorMode } from "@chakra-ui/react"
import Link from "next/link"
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { destroyCookie } from "nookies";


function Header() {
    const { colorMode, toggleColorMode } = useColorMode();
    const router = useRouter()

    const redirect = () => router.push('/login')


    const { data: user } = api.user.userClient.useQuery()
    return (
        <header className=" w-[100%]">
            <div className="MAX-CONTAINER h-20 flex items-center justify-between ">
                <div className="flex justify-center gap-1">
                    {/* <img src="" alt="Logo" title="Logo" /> */}
                    <Heading as='h4' size={'md'}>MARIA BONITA</Heading>
                </div>

                <nav className="flex items-center gap-14 ">
                    <Link href="/sobre" className="text-[1.3rem] "> Sobre nós </Link>

                    <Link href="/serviços" className="text-[1.3rem] "> Serviços</Link>

                    <Link href="/contato" className="text-[1.3rem] ">Contato</Link>


                </nav>
                <Menu>
                    <MenuButton
                        as={IconButton}
                        aria-label=''
                        icon={<HamburgerIcon />}
                        variant='none'
                        _hover={{ bgColor: "#Abaa", }}
                        _active={{ bgColor: "#Abaa" }}
                        fontSize={25}
                    />

                    <MenuList p={2} zIndex={2}>

                        {
                            user &&
                            <>
                                <Box p={2} mt={4}>
                                    {
                                        user.map((item) => {
                                            if (item === undefined) return
                                            return (
                                                <Flex direction={'row'} align={'center'} justify={'flex-start'} gap={2}>
                                                    <Avatar size={'sm'} src={item.imageKey} name={item.firstName} />

                                                    <VStack>
                                                        <Text fontSize={'sm'} lineHeight={0.5}>{item.firstName + " " + item.secondName}</Text>
                                                        <Text fontSize={'sm'} lineHeight={1}>{item.email}</Text>

                                                    </VStack>
                                                </Flex >
                                            )
                                        })
                                    }



                                </Box>
                                <MenuDivider my={4} />
                            </>
                        }
                        <MenuItem as={Link} href="/" icon={<RiHome2Line />} >
                            Página principal
                        </MenuItem>


                        <MenuItem as={Link} href='/booking' icon={<CalendarIcon />} >
                            Agendar horário
                        </MenuItem>
                        {
                            !user ? <MenuItem as={Link} href="/login" icon={<GrLogin />}  >
                                Log in
                            </MenuItem> : <MenuItem as={'button'} icon={<FiLogOut />} onClick={() => {
                                destroyCookie(null, 'user-Token-client')
                                setTimeout(() => {
                                    location.reload()
                                }, 1000)
                            }
                            } >
                                Log out
                            </MenuItem>
                        }
                        <MenuItem closeOnSelect={false} iconSpacing={"12px"}>
                            <FormControl display='flex' alignItems='center'>
                                <FormLabel mb='0'>
                                    {colorMode === 'dark' ? <RiMoonLine /> : <RiSunLine />}
                                </FormLabel>
                                <Switch onChange={toggleColorMode} />
                            </FormControl>
                        </MenuItem>
                    </MenuList>
                </Menu>

            </div >
        </header >
    )
}

export default Header

