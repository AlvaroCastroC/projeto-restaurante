import { notifySuccess, notifyError, notifyWarning, notifyPromise } from "@/models/toastifyUse"
import { schemaService } from "@/models/userSchemaValidation"
import { api } from "@/utils/api"
import { EditIcon } from "@chakra-ui/icons"
import { Popover, PopoverTrigger, IconButton, PopoverContent, PopoverCloseButton, PopoverBody, Button, ButtonGroup, Flex, FormControl, FormLabel, Input, FormHelperText } from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { FC, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

interface PopOverUpdadtProps {
    id: string
    refetch: any
}



const PopOverUpdateService: FC<PopOverUpdadtProps> = ({ id, refetch }) => {

    const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

    type FormDataProps = z.infer<typeof schemaService>

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormDataProps>({
        mode: "all",
        reValidateMode: 'onChange',
        resolver: zodResolver(schemaService)

    })

    const handleSubmiUpdatetForm = async (data: FormDataProps,) => {
        const { service, price, id } = data



        if (id !== undefined) [
            allServiceUpdate({
                id,
                service,
                price: JSON.parse(price.replace(",", "."))
            }),
            setTimeout(refetch, 3000),
            setTimeout(reset, 1000)
        ]

    }


    const { mutate: allServiceUpdate } = api.dashboard.allServiceUpdate.useMutation({
        onSuccess: (e) => {
            // router.push('/menu')
            notifyPromise("", e.message, e.success)


        },

        onError(erro) {
            notifyError(erro.message)

        },
    })


    return (
        <Popover
            isOpen={openPopoverId === id}
            onOpen={() => setOpenPopoverId(id)}
            onClose={() => setOpenPopoverId(null)}
            placement='top'
            closeOnBlur={false}
        >
            <PopoverTrigger>
                <IconButton size='sm' icon={<EditIcon />} aria-label={""} />
            </PopoverTrigger>
            <PopoverContent p={5} >
                <PopoverCloseButton />
                <PopoverBody >
                    <h4>Atualize o serviços que deseja</h4>
                    <form onSubmit={handleSubmit(handleSubmiUpdatetForm)}>
                        <FormControl >
                            <Flex direction={"column"} gap={2}>
                                <Input type="hidden"  {...register("id")} value={id} />

                                <FormLabel htmlFor={`service-${id}`}>Nome do serviço</FormLabel>
                                <Input id={`service-${id}`} {...register("service")} placeholder="Ex.: Corte de cabelo" />
                                {errors.service && <FormHelperText>{errors.service?.message}</FormHelperText>}

                                <FormLabel htmlFor={`price-${id}`}>Precificação do serviço</FormLabel>
                                <Input id={`price-${id}`} {...register("price")} placeholder="Ex.: R$ 55,20" />
                                {errors.price && <FormHelperText>{errors.price?.message}</FormHelperText>}
                            </Flex>



                        </FormControl>

                        <ButtonGroup spacing={2} mt={4}>
                            <Button type="submit" onClick={() => {

                                !errors && setOpenPopoverId(null)
                            }}>Atualizar</Button>
                            <Button onClick={() => {
                                setOpenPopoverId(null)
                                setTimeout(reset, 1000)
                            }}>Cancelar</Button>
                        </ButtonGroup>
                    </form>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}

export default PopOverUpdateService;