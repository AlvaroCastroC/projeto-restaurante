import { MAX_FILE_SIZE } from "@/constants/config"
import { notifySuccess, notifyError } from "@/models/toastifyUse"
import { api } from "@/utils/api"
import { DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { Popover, PopoverTrigger, PopoverContent, PopoverCloseButton, PopoverBody, Button, Flex, FormControl, Input, useDisclosure, IconButton } from "@chakra-ui/react"
import Image from "next/image"
import { ChangeEvent, FC, useEffect, useRef, useState } from "react"
interface PopOverUpdadtProps {
    id: string
    refetch: () => any
    oldKey: string
    firstName: string
    secondName: string

}


interface Input {
    firstName: string | undefined
    secondName: string | undefined
    file: undefined | File
}

const initialInput = {
    firstName: undefined,
    secondName: undefined,
    file: undefined,
}

const PopOverUpdateUser: FC<PopOverUpdadtProps> = ({ id, oldKey, firstName, secondName, refetch }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialFocusRef = useRef<HTMLButtonElement>(null)


    const [error, setError] = useState<string>('')
    const [preview, setPreview] = useState<string>('')
    const [input, setInput] = useState<Input>(initialInput)


    const { mutateAsync: createPresignedUrl } = api.imagePressigned.createPresignedUrl.useMutation()
    const { mutate: deleteImage } = api.imagePressigned.deleteImage.useMutation({
        onSuccess: (success) => {
            notifySuccess(success!.message)
            setTimeout(refetch, 3000)
        },
        onError: (error) => {
            notifyError(error.message)
        }
    })
    const { mutate: updateUser } = api.createUser.updateUser.useMutation({
        onSuccess: (success) => {
            notifySuccess(success!.message)
            setTimeout(() => {
                refetch()
                setInput(initialInput)
                setPreview('')
            }, 3000)

        },
        onError: (error) => {
            notifyError(error.message)

        }
    })

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) {
            throw new Error('No file selected')
        }
        if (e.target.files?.[0].size > MAX_FILE_SIZE) {
            throw new Error('file size is too big')
        }

        setInput((prev) => ({ ...prev, file: e.target.files![0] }))



    }




    useEffect(() => {
        if (!input.file) return
        const objectUrl = URL.createObjectURL(input.file)
        setPreview(objectUrl)

        return () => URL.revokeObjectURL(objectUrl)
    }, [input.file])



    const handleImageUpload = async () => {
        const { file } = input
        if (!file) return


        const { fields, key, url } = await createPresignedUrl({ fileType: file.type, oldKey })


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

    const handleDeleteImage = async () => {
        if (oldKey === null) throw new Error('A key da imagem não existe')
        deleteImage({ id, imageKey: oldKey })
    }


    const handleSubmit = async () => {
        const key = await handleImageUpload()
        if (!key) return setError('No key')

        updateUser({
            id,
            imageKey: key,
            firstName: input.firstName === undefined ? firstName : input.firstName,
            secondName: input.secondName === undefined ? secondName : input.secondName,
        })


    }

    return (
        <Popover
            isOpen={isOpen}
            initialFocusRef={initialFocusRef}
            onOpen={onOpen}
            onClose={onClose}
            placement='right'
            closeOnBlur={false}
        >
            <PopoverTrigger>
                <Button leftIcon={<EditIcon />}>Editar Perfil</Button>
            </PopoverTrigger>
            <PopoverContent p={5} minHeight={"300px"}>
                <PopoverCloseButton />
                <PopoverBody >
                    <FormControl >
                        <Flex direction={"column"} gap={2}>

                            <IconButton icon={<DeleteIcon />} aria-label="" onClick={handleDeleteImage} />
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
                                    name='file'
                                    id='file'
                                    onChange={handleFileSelect}
                                    accept='image/jpeg image/png image/jpg'
                                    type='file'
                                    className='sr-only'
                                />
                                {error && <p className='text-xs text-red-600'>{error}</p>}
                            </label>


                            <Input
                                name='firstName'
                                className='h-12 rounded-sm border-none bg-gray-200'
                                type='text'
                                placeholder='Digite seu primeiro nome'
                                onChange={(e) => setInput((prev) => ({ ...prev, firstName: e.target.value }))}
                                value={input.firstName}
                            />

                            <Input
                                name='secondName'
                                className='h-12 rounded-sm border-none bg-gray-200'
                                type='text'
                                placeholder='Digite seu sobrenome'
                                onChange={(e) => setInput((prev) => ({ ...prev, secondName: e.target.value }))}
                                value={input.secondName}
                            />

                            <Button
                                _hover={{ color: "white", bg: "green" }}
                                _active={{ color: "green", bg: "white" }}

                                disabled={!input.file}
                                onClick={handleSubmit}>
                                Atualizar perfil
                            </Button>
                        </Flex>



                    </FormControl>

                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}

export default PopOverUpdateUser;