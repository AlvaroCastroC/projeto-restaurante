
import { useEffect, useState } from 'react';
import { SiInstagram } from 'react-icons/si';
import { Box, Button, Flex, Heading, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger } from "@chakra-ui/react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight, FaFacebookF } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa6";
import { ReactElement } from "react";

interface SliderProps {
    children: any
    autoSlide: boolean
    autoSlideInterval: number

}

export default function Slider({ children, autoSlide, autoSlideInterval }: SliderProps) {
    const [curr, setCurr] = useState(0)

    useEffect(() => {
        if (!autoSlide) return
        const slideInterval = setInterval(next, autoSlideInterval)
        return () => clearInterval(slideInterval)
    }, [])

    const prev = () => setCurr(curr => curr === 0 ? children.length - 1 : curr - 1)

    const next = () => setCurr(curr => curr === children.length - 1 ? 0 : curr + 1)

    const PopOverLinks = (name: string, element: ReactElement, link: string) => {
        return (
            <Popover trigger="hover" >
                <PopoverTrigger>
                    <Link href={link} target="_blank" className="text-[#0a1b25] " >{element}</Link>
                </PopoverTrigger>
                <PopoverContent width={'max-content'} m={2}>
                    <PopoverArrow />
                    <PopoverBody fontWeight={'bold'} color={'#0a1b25'}>
                        {name}
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        )
    }

    return (
        <div className='overflow-hidden relative max-h-[90vh]'>
            <div className='flex transition-transform ease-in-out duration-[5000ms]' style={{ transform: `translateX(-${curr * 100}%)` }}>{children}</div>
            <div className='absolute inset-0 flex items-end p-4 MAX-CONTAINER'>
                <Box position={'absolute'} right={0} top={0} zIndex={1} mr={6} mt={20}>
                    <Box borderRightWidth={'7px'} borderColor={'yellow.500'} padding={5}>
                        <Heading color={'#fff'} textShadow='1px 1px 3px #0a1b25' as='h1' size={'2xl'}>Salão de beleza e estética</Heading>
                        <Heading color={'#fff'} textShadow='1px 1px 3px #0a1b25' as='h3' size={'lg'} mt={8}>O melhor lugar pra você se sentir linda, e amada.</Heading>


                    </Box>

                    <div className="flex flex-col items-end mr-16">
                        <Heading color={'yellow.500'} as='h3' size={'lg'} mt={8} textShadow='1px 1px 3px #0a1b25'>Agende agora seu horário.</Heading>
                        <Button as={Link} href='/booking' w={'max-content'} mt={10} bg={'whiteAlpha.500'} color={'#0a1b25'} boxShadow={'lg'} _hover={{ bg: 'whiteAlpha.800' }}>Agendar horário</Button>
                    </div>
                </Box>
                <div className='flex items-center gap-6 mb-4'>
                    <button className='p-1 rounded-full  hover:bg-white/25' onClick={prev}>
                        <FaChevronLeft className='text-[#0a1b25]' size={15} />
                    </button>

                    <div className='flex items-center justify-center gap-2' >
                        {children.map((_: never, i: number) => (
                            <div className={`transition-all w-2 h-2 bg-[#0a1b25] rounded-full ${curr === i ? 'p-1' : 'bg-opacity-50'}`}> </div>
                        ))}
                    </div>

                    <button className='p-1 rounded-full   hover:bg-white/25' onClick={next}><FaChevronRight className='text-[#0a1b25]' size={15} />
                    </button>
                </div>
                <Flex position={'absolute'} bottom={0} right={0} flexDirection={'row'} alignItems={'center'} gap={6} py={2} px={4} bgColor={'whiteAlpha.500'} rounded={'lg'} m={9} boxShadow={'lg'}>
                    <Heading as={'h4'} size={'sm'} color={'black'} mr={5} textColor={'#0a1b25'}>Nossas redes:</Heading>

                    {/* Link do Facebook */}
                    {
                        PopOverLinks('Facebook', <FaFacebookF />, '#')
                    }

                    {/* Link do Instagram */}
                    {
                        PopOverLinks('Instagram', <SiInstagram />, '#')
                    }

                    {/* Link do Whatsapp */}
                    {
                        PopOverLinks('Whatsapp', <FaWhatsapp />, '#')
                    }


                </Flex>
            </div>


        </div>
    )
}