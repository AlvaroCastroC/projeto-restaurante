import { notifyError, notifySuccess } from "@/models/toastifyUse";
import { api } from "@/utils/api";
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, ButtonGroup } from "@chakra-ui/react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { format } from "date-fns";
import React, { FC } from "react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons"
import { ptBR } from "date-fns/locale/pt-BR";

interface ModalProps {
    clientName: string
    email: string
    bookingDate: Date | null
    phone: string
    service: string
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void

}

interface CreateClientBooking {
    clientName: string
    email: string
    bookingDate: Date | null
    phone: string
    service: string

}




const Modal: FC<ModalProps> = ({ isOpen, setIsOpen, clientName, email, bookingDate, phone, service }) => {
    const reload = () => location.reload()

    const { data: dataClient, refetch } = api.booking.bookingQuery.useQuery()
    const cancelRef = React.useRef<HTMLButtonElement>(null)

    const handleSubmitBooking = ({ bookingDate, email, clientName, phone, service }: CreateClientBooking) => {
        setIsOpen(!isOpen)
        if (bookingDate !== null) {
            bookingCreate({
                bookingDate,
                clientName,
                email,
                phone,
                service,
            })

        }


    }

    const { mutate: bookingCreate, } = api.booking.bookingCreate.useMutation({
        onSuccess: (e) => {
            notifySuccess(e!.message)
            // router.push('/menu')
            setTimeout(refetch, 3000)


        },

        onError(erro) {
            notifyError(erro.message)

        },
    })

    if (isOpen) {
        if (dataClient === undefined) return

        return dataClient.find(e => e.bookingDate.getDate() >= bookingDate!.getDate()) ?
            (
                <AlertDialog
                    isOpen={isOpen}
                    onClose={() => true}
                    closeOnEsc={false}
                    leastDestructiveRef={cancelRef}
                >

                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                Remarcar agendamento
                            </AlertDialogHeader>

                            <AlertDialogBody>

                                <p className="text-[1.1rem] font-semibold" >Nome do cliente: <span className="text-[1rem] font-normal">{clientName}</span></p>
                                <p className="text-[1.1rem] font-semibold">Endereço de e-mail: <span className="text-[1rem] font-normal">{email}</span></p>
                                <p className="text-[1.1rem] font-semibold">Serviço: <span className="text-[1rem] font-normal">{service}</span></p>
                                {bookingDate !== null && <p className="text-[1.1rem] font-semibold">Horário agendado: <span className="text-[1rem] font-normal">{format(bookingDate, "d 'de' MMMM 'ás' HH:mm", { locale: ptBR })}</span></p>}

                            </AlertDialogBody>

                            <AlertDialogFooter className="flex flex-col items-center mt-4">

                                <p className="text-base font-semibold mb-6">Você tem certeza que quer remarcar o horário?</p>

                                <ButtonGroup gap='4'>

                                    <Button type="button" ref={cancelRef} rightIcon={<CloseIcon />}
                                        _hover={{ color: "red", bg: "white" }}
                                        _active={{ color: "white", bg: "red" }}
                                        variant='ghost' size="sm" onClick={() => setIsOpen(false)}>Cancelar mudança
                                    </Button>

                                    <Button rightIcon={<CheckIcon />}
                                        _hover={{ color: "green", bg: "white" }}
                                        _active={{ color: "white", bg: "green" }}
                                        variant='ghost' size="sm" onClick={() => handleSubmitBooking({ bookingDate, clientName, email, phone, service })}>Remarcar o horário
                                    </Button>

                                </ButtonGroup>


                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>

            ) : (

                <AlertDialog isOpen={isOpen}
                    onClose={() => true}
                    closeOnEsc={false}
                    leastDestructiveRef={cancelRef}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent >
                            <AlertDialogHeader >
                                Agendar serviço
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                <p className="text-[1.1rem] font-semibold" >Nome do cliente: <span className="text-[1rem] font-normal">{clientName}</span></p>
                                <p className="text-[1.1rem] font-semibold">Endereço de e-mail: <span className="text-[1rem] font-normal">{email}</span></p>
                                <p className="text-[1.1rem] font-semibold">Serviço: <span className="text-[1rem] font-normal">{service}</span></p>
                                {bookingDate !== null && <p className="text-[1.1rem] font-semibold">Horário agendado: <span className="text-[1rem] font-normal">{format(bookingDate, "d 'de' MMMM 'ás' HH:mm", { locale: ptBR })}</span></p>}
                            </AlertDialogBody>
                            <AlertDialogFooter className="flex flex-col items-center mt-4">

                                <p className="text-base font-semibold mb-6">Agendar para este dia?</p>

                                <ButtonGroup gap='4'>
                                    <Button type="button" ref={cancelRef} rightIcon={<CloseIcon />}
                                        _hover={{ color: "red", bgColor: "white" }}
                                        _active={{ color: "white", bgColor: "red" }}
                                        variant='ghost' size="sm" onClick={() => setIsOpen(false)}>Cancelar agendamneto</Button>

                                    <Button rightIcon={<CheckIcon />}
                                        _hover={{ color: "green", bg: "white" }}
                                        _active={{ color: "white", bg: "green" }}
                                        variant='ghost' size="sm" onClick={() => handleSubmitBooking({ bookingDate, clientName, email, phone, service })}>Agendar horário</Button>

                                </ButtonGroup>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>


            )


    }
}


export default Modal;