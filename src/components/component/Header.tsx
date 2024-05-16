import { CalendarIcon, HamburgerIcon, } from "@chakra-ui/icons"
import { GrLogin, } from "react-icons/gr";
import { RiHome2Line, RiMoonLine, RiSunLine } from "react-icons/ri";
import { Button, FormControl, FormLabel, Menu, MenuButton, MenuItem, MenuList, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Switch, useBoolean, useColorMode } from "@chakra-ui/react"
import Link from "next/link"

function Header() {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <header className=" w-[100%]">
            <div className="MAX-CONTAINER h-24 flex items-center justify-between ">
                <div className="flex justify-center gap-1">
                    <img src="" alt="Logo" title="Logo" />
                    Nome da loja
                </div>

                <nav className="flex items-center gap-3 ">
                    <Link href="/sobre" className="text-[1.3rem] px-1 transition ease-in duration-400	  hover:border-blue-500 hover:border-b-2 "> Sobre nós </Link>

                    <Popover trigger="hover" >
                        <PopoverTrigger>
                            <Button bg="none" _hover={{ bg: "none", color: "blue" }}>Serviços</Button>
                        </PopoverTrigger>
                        <PopoverContent w="100% " p="15px">
                            <PopoverArrow />
                            <PopoverBody className="flex flex-col items w-full gap-3">
                                < Link href="/servico1" className="text-[1rem] hover:text-[rgba(7,65,173,1)] " > Serviços 1</Link >
                                <Link href="/servico2" className="text-[1rem] hover:text-[rgba(7,65,173,1)] ">Serviços 2</Link>
                                <Link href="/servico3" className="text-[1rem] hover:text-[rgba(7,65,173,1)] ">Serviços 3</Link>
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>

                    <Link href="/contato" className="text-[1.3rem] px-1 transition ease-in duration-400 hover:border-blue-500 hover:border-b-2">Contato</Link>


                </nav>
                <Menu >
                    <MenuButton
                        as={Button}
                        aria-label='Options'
                        rightIcon={<HamburgerIcon />}
                        variant='none'
                        _hover={{ bgColor: "#Abaa", }}
                        _active={{ bgColor: "blue" }}
                    >
                        Menu
                    </MenuButton>

                    <MenuList>

                        <MenuItem as={Link} href="/login" icon={<GrLogin />}  >
                            Login
                        </MenuItem>
                        <MenuItem as={Link} href='/agendamento' icon={<CalendarIcon />} >
                            Agendar horário
                        </MenuItem>
                        <MenuItem as={Link} href="/" icon={<RiHome2Line />} >
                            Home
                        </MenuItem>
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

