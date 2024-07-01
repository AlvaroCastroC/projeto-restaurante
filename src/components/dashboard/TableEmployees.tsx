import { MAX_FILE_SIZE } from "@/constants/config";
import { notifyWarning, notifySuccess } from "@/models/toastifyUse";
import { api } from "@/utils/api";
import { capitalize, selectOptions } from "@/utils/helper";
import { Categories } from "@/utils/types";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Badge, Card, Image as ImageChkra, CardBody, Divider, Flex, Heading, IconButton, Input, Popover, PopoverArrow, PopoverContent, PopoverHeader, PopoverTrigger, Stack, Text, VStack, FormLabel, Button, Tag, HStack, Box } from "@chakra-ui/react";
import { formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import dynamic from "next/dynamic";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { MultiValue } from "react-select";
import { parseCookies } from 'nookies'
import { verifyAuthAdmin } from "@/lib/auth";




const DynamicSelect = dynamic(() => import('react-select'), { ssr: false })
interface TableEmployeesProps { }

type Input = {
    name: string | undefined
    category: MultiValue<{ value: string, label: string }>
    initTime: string | undefined
    file: undefined | File
}

const initialInput = {
    name: undefined,
    category: [],
    initTime: undefined,
    file: undefined

}

const TableEmployees: FC<TableEmployeesProps> = ({ }) => {

    const colors = ['green', 'purple'];


    const [error, setError] = useState<string>('')
    const [input, setInput] = useState<Input>(initialInput)
    const [preview, setPreview] = useState<string>('')
    const { data: employees, refetch } = api.employees.getEmployees.useQuery()


    const { mutate: createEmployees } = api.dashboard.createEmployees.useMutation({
        onSuccess: (e) => {
            notifySuccess(e!.message)
            setTimeout(refetch, 3000)

            setInput(initialInput)
            setPreview('')
        }
    })
    const { mutateAsync: createPresignedUrl } = api.imagePressigned.createPresignedUrlEmployees.useMutation()
    const { mutateAsync: deleteEmployees } = api.imagePressigned.deleteEmployees.useMutation({
        onSuccess: (e) => {
            notifySuccess(e!.message)
            setTimeout(refetch, 3000)


        }
    })


    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) {
            return setError('No file selected')
        }
        if (e.target.files?.[0].size > MAX_FILE_SIZE) {
            return setError('file size is too big')
        }

        setInput((prev) => ({ ...prev, file: e.target.files![0] }))



    }



    const handleImageUpload = async () => {
        const { file } = input
        if (!file) return
        if (input.initTime === undefined) return
        if (input.name === undefined) return

        const { fields, key, url } = await createPresignedUrl({ fileType: file.type })


        const data = {
            ...fields, 'Content-Type': file.type,
            file
        }

        const formData = new FormData()

        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value as any)
        })

        await fetch(url, {
            method: 'POST',
            body: formData,
        })
        return key



    }




    const handleDeleteEmployees = async (id: number, imageKey: string) => {
        await deleteEmployees({
            id,
            imageKey
        })

        refetch()
    }

    const addEmployees = async () => {
        if (input.name === undefined) return notifyWarning('Nome não definido!')
        if (input.initTime === undefined) return notifyWarning('Tempo de jornada de trabalho não definido!')

        if (!input.category[0]) return notifyWarning('qualificações não definidas!')

        const key = await handleImageUpload()
        if (!key) return notifyWarning('Sem Key')


        createEmployees({

            category: input.category.map((c) => c.value as Exclude<Categories, "all">),
            initTime: input.initTime,
            name: input.name,
            imageKey: key,
        })


    }


    useEffect(() => {
        if (!input.file) return
        const objectUrl = URL.createObjectURL(input.file)
        setPreview(objectUrl)

        return () => URL.revokeObjectURL(objectUrl)
    }, [input.file])


    return (
        <section className="mt-[50px]">
            <Heading as={'h2'} size={'lg'}>Adicionar colaborador:</Heading>
            <VStack my={50} position={'relative'}>
                <HStack minW={'100%'}>
                    <Box w={'100%'}>
                        <FormLabel htmlFor="name">Nome completo</FormLabel>
                        <Input
                            id="name"
                            name="name"
                            type='text'
                            placeholder="Digite o nome do funcionário completo"
                            onChange={(e) => setInput((prev) => ({ ...prev, name: e.target.value }))}
                            value={input.name}
                        />
                    </Box>

                    <Box w={'100%'}>
                        <FormLabel htmlFor="initTime">Inicio da jornada de trabalho?</FormLabel>
                        <Input
                            id="initTime"
                            name="initTime"

                            type='date'
                            placeholder="O dia que o funcionário foi contratado"
                            onChange={(e) => setInput((prev) => ({ ...prev, initTime: e.target.value }))}
                            value={input.initTime}
                        />
                    </Box>
                    <Box w={'100%'}>
                        <FormLabel htmlFor="services">Quais qualificações?</FormLabel>
                        <DynamicSelect
                            id="services"
                            value={input.category}
                            placeholder='Tipos de serviços'

                            // @ts-ignore
                            onChange={(e) => setInput((prev) => ({ ...prev, category: e }))}
                            isMulti
                            options={selectOptions}
                        />
                    </Box>
                </HStack>


                <label
                    htmlFor='file'
                    className='relative p-[6px] cursor-pointer rounded-md border-[1px] bg-white hover:shadow-sm  text-zinc-400 focus-within:outline-none'>
                    <span className='sr-only'>File input</span>
                    <div className='h-full px-3'>
                        {preview ? (
                            <div className='relative h-36  w-36 m-auto'>
                                <Image alt='preview' style={{ objectFit: 'contain' }} fill src={preview} />
                            </div>
                        ) : (
                            <span>Selecionar imagem</span>
                        )}
                    </div>
                    <input
                        id='file'

                        name='file'
                        onChange={handleFileSelect}
                        accept='image/jpeg image/png image/jpg'
                        type='file'
                        className='sr-only'
                    />

                </label>

                <Button
                    disabled={!input.file || input.name === undefined || !input.initTime === undefined}
                    onClick={addEmployees}
                >
                    Adicionar funcionários
                </Button>

            </VStack>



            <Heading as={'h2'} size={'lg'}>Colaboradores contratados:</Heading>
            <Flex gap={5} my={10} mt={50}>
                {employees?.map((item) => (
                    <Card
                        direction={{ base: 'column', sm: 'row' }}
                        overflow='hidden'
                        variant='outline'
                        key={item.id}
                    >
                        <ImageChkra
                            objectFit='cover'
                            maxW={{ base: '100%', sm: '100px' }}
                            src={item.url}
                            alt={`Funcionáiro: ${item.name}`}
                        />
                        <Popover trigger="hover" placement="right">
                            <PopoverTrigger>
                                <IconButton variant={'unstyled'} _hover={{
                                    color: 'red'
                                }} aria-label="" icon={<DeleteIcon />} position={'absolute'} right={'0'} top={'0'} onClick={() => handleDeleteEmployees(item.id, item.imageKey)} />
                            </PopoverTrigger>
                            <PopoverContent maxWidth={"250px"} p={2} color='white' bg='teal.500' borderColor='teal.500' width={"100%"}>
                                <PopoverArrow bg='teal.500' />

                                <PopoverHeader fontWeight='bold' border='0' >Deletar funcionário?</PopoverHeader>

                            </PopoverContent>
                        </Popover>
                        <Stack>
                            <CardBody minW={'350px'} p={4}>
                                <Heading size='md'>{item.name}</Heading>
                                <Text mt={6}>Tipos de serviços prestados</Text>
                                <Flex gap={2} mt={2}>
                                    {
                                        item.category.map((e, index) => (
                                            <Badge colorScheme={colors[index % colors.length]} key={e.id}>{e.name}</Badge>
                                        ))
                                    }
                                </Flex>
                                <Text py='2'>
                                    Há  <span className="font-bold">{formatDistance(item.initTime, new Date(), { locale: ptBR })}</span>  de serviços prestados
                                </Text>


                            </CardBody>


                        </Stack>
                    </Card>
                ))}
            </Flex >
        </section>
    )
}


export default TableEmployees;

function notifyError(arg0: string) {
    throw new Error("Function not implemented.");
}
