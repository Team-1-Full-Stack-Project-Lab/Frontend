import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { Link } from "react-router-dom"

export function CardComponent() {
    return (
        <div className="flex flex-col items-center w-full px-6">
            <Card className="w-full max-w-5xl bg-[#f2f6fa] border-none shadow-none rounded-2xl py-10 flex flex-col items-center text-center mb-6">
                <div className="flex flex-col items-center gap-4">
                    <div className="bg-[#dbe7f3] p-3 rounded-full">
                        <Calendar className="w-6 h-6 text-[#003580]" />
                    </div>
                    <p className="text-lg text-gray-800">
                        No tienes ningún viaje programado. ¿A dónde se te antoja ir?
                    </p>
                    <Link
                        to="/">
                        <Button className="mt-2 bg-[#006CE4] hover:bg-[#0055b8] text-white px-6 rounded-full">
                            Buscar
                        </Button>
                    </Link>
                </div>
            </Card>
        </div>
    )
}