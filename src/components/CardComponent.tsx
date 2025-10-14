import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'

export function CardComponent() {
  return (
    <Card className="flex flex-col items-center w-full bg-gray-100 border-none shadow-none rounded-2xl py-10 text-center mb-6 gap-4">
      <div className="bg-[#dbe7f3] p-3 rounded-full">
        <Calendar className="w-6 h-6 text-[#003580]" />
      </div>

      <p className="text-lg text-gray-800">No tienes ningún viaje programado. ¿A dónde se te antoja ir?</p>

      <Link to="/">
        <Button className="mt-2 bg-[#006CE4] hover:bg-[#0055b8] text-white px-6 rounded-full">Buscar</Button>
      </Link>
    </Card>
  )
}
