import { notifyError, notifySuccess } from "@/models/toastifyUse";
import { api } from "@/utils/api";
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, ButtonGroup } from "@chakra-ui/react";
import { format } from "date-fns";
import React, { FC } from "react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons"
import { ptBR } from "date-fns/locale/pt-BR";
import { capitalize } from "@/utils/helper";

interface ModalProps {
    clientName: string
    email: string
    bookingDate: Date | null
    phone: string
    service: string
    idEmployee: number
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void

}

interface CreateClientBooking {
    clientName: string
    email: string
    bookingDate: Date | null
    phone: string
    service: string
    idEmployee: number
}




const Modal: FC<ModalProps> = ({ isOpen, setIsOpen, bookingDate, service, idEmployee }) => {

    const { data: dataClient, refetch } = api.booking.bookingQuery.useQuery()
    const { data: services } = api.booking.allServiceQuery.useQuery()
    const { data: employees } = api.employees.getEmployees.useQuery()


    const cancelRef = React.useRef<HTMLButtonElement>(null)

    const handleSubmitBooking = () => {

        const allServices = services?.find((s) => s.service === service)
        if (allServices === undefined) return

        setIsOpen(!isOpen)
        if (bookingDate !== null) {
            bookingCreate({
                bookingDate,
                clientName: dataClient!.clientName,
                email: dataClient!.email,
                phone: dataClient!.phone,
                service: allServices.service,
                price: allServices.price,
                idEmployee
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


        const existServiceClient = dataClient?.services.find(e => {
            if (format(e.bookingDate, "d MMMM HH:mm") === format(bookingDate!, "d MMMM HH:mm") || (e.service === service)) return true
            else return false
        })

        const emplo = employees?.find(e => e.id === idEmployee)
        return (
            <AlertDialog
                isOpen={isOpen}
                onClose={() => true}
                closeOnEsc={false}
                leastDestructiveRef={cancelRef}
            >

                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            {existServiceClient ? 'Remarcar agendamento ' : 'Agendar serviço'}
                        </AlertDialogHeader>

                        {
                            dataClient && <AlertDialogBody>

                                <p className="text-[1.1rem] font-semibold" >Nome do cliente:  <span className="text-[1rem] font-normal">{dataClient.clientName}</span>
                                </p>
                                <p className="text-[1.1rem] font-semibold">Endereço de e-mail: <span className="text-[1rem] font-normal">{dataClient.email}</span>
                                </p>
                                <p className="text-[1.1rem] font-semibold">Nome do funcionário: <span className="text-[1rem] font-normal">{emplo?.name}</span>
                                </p>
                                <p className="text-[1.1rem] font-semibold">Serviço: <span className="text-[1rem] font-normal">{
                                    services?.map(e => {
                                        if (e.service === service) return capitalize(e.service) + " R$" + e.price.toFixed(2).replace(".", ",")


                                    })
                                }</span>
                                </p>
                                {bookingDate !== null && <p className="text-[1.1rem] font-semibold">Horário agendado: <span className="text-[1rem] font-normal">{format(bookingDate, "d 'de' MMMM 'ás' HH:mm", { locale: ptBR })}</span>
                                </p>}

                            </AlertDialogBody>
                        }

                        <AlertDialogFooter className="flex flex-col items-center mt-4">

                            <p className="text-base font-semibold mb-6">{existServiceClient ? 'Você tem certeza que quer remarcar o horário?' : 'Agendar para este dia?'}</p>

                            <ButtonGroup gap='4'>

                                <Button type="button" ref={cancelRef} rightIcon={<CloseIcon />}
                                    _hover={{ color: "red", bg: "white" }}
                                    _active={{ color: "white", bg: "red" }}
                                    variant='ghost' size="sm" onClick={() => setIsOpen(false)}>{existServiceClient ? 'Cancelar mudança' : 'Cancelar agendamneto'}
                                </Button>

                                <Button rightIcon={<CheckIcon />}
                                    _hover={{ color: "green", bg: "white" }}
                                    _active={{ color: "white", bg: "green" }}
                                    variant='ghost' size="sm" onClick={() => handleSubmitBooking()}>{existServiceClient ? 'Remarcar o horário' : 'Agendar horário'}
                                </Button>

                            </ButtonGroup>


                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

        )

    }
}


export default Modal;