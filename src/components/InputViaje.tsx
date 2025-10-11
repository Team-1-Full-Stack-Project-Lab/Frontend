import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import {
    AlertDialogCancel,
    AlertDialogFooter
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface InputViajeProps {
    onGuardar: (viaje: { nombre: string; descripcion: string }) => void
    onCancelar: () => void
}

export function InputViaje({ onGuardar }: InputViajeProps) {
    const [nombre, setNombre] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const handleGuardar = () => {
        if (nombre.trim() === "") return
        onGuardar({ nombre, descripcion })
        setNombre("")
        setDescripcion("")
    }
    return (
        <div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                    <Label htmlFor="nombre" className="text-gray-800 font-medium mb-2">
                        Nombre del viaje
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Nombre del viaje"
                        className="rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="flex flex-col gap-1 mb-2">
                    <Label htmlFor="descripcion" className="text-gray-800 font-medium mb-2">
                        Descripción
                    </Label>
                    <Textarea
                        id="descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Agrega una descripción"
                        className="rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
                    />
                </div>
            </div>
            < AlertDialogFooter >
                <AlertDialogCancel className="mt-2 bg-[#a7183c] hover:bg-[#e9c5ce] text-white px-6 rounded-full">
                    Cancelar
                </AlertDialogCancel>
                <Button
                    onClick={handleGuardar}
                    disabled={nombre.trim() === ""}
                    className={`mt-2 bg-[#006CE4] px-6 rounded-full ${nombre.trim() === ""
                        ? "bg-[#a8c7fa] text-white cursor-not-allowed"
                        : "bg-[#006CE4] hover:bg-[#0055b8] text-white "
                        }`}>
                    Guardar
                </Button>
            </AlertDialogFooter>
        </div>
    )
}