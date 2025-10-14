import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { InputViaje } from "./InputViaje"
import { useState } from "react"

interface PlaneaViajeProps {
    onGuardarViaje: (viaje: { nombre: string; descripcion: string }) => void
}

export function PlaneaViaje({ onGuardarViaje }: PlaneaViajeProps) {
    const [open, setOpen] = useState(false)

    const handleGuardar = (viaje: { nombre: string; descripcion: string }) => {
        onGuardarViaje(viaje)
        setOpen(false)
    }
    return (
        <div className="text-blue-800 hover:text-blue-500">
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild >
                    <Button variant="ghost" className=" text-blue-800 hover:text-blue-500"> + Planear un viaje </Button>
                </AlertDialogTrigger>
                < AlertDialogContent className="sm:max-w-[425px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            <h2 className="text-2xl font-bold text-gray-900">Planea un nuevo viaje</h2>
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            <p className="text-gray-600 text-sm mb-4">
                                Guarda las opciones que te gusten y planea tu viaje
                            </p>
                            <InputViaje onGuardar={handleGuardar} onCancelar={() => setOpen(false)} />
                            <div className="flex justify-end mt-4" />
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
