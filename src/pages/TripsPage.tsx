import { CardComponent } from '@/components/CardComponent'
import { PlaneaViaje } from '@/components/PlaneaViaje'
import { useState } from 'react'

export default function TripsPage() {
  const [viajes, setViajes] = useState<{ nombre: string; descripcion: string }[]>([])

  const handleAgregarViaje = (nuevoViaje: { nombre: string; descripcion: string }) => {
    setViajes(prev => [...prev, nuevoViaje])
  }
  return (
    <>
      <title>Viajes</title>

      <div className="flex justify-between w-full">
        <h1 className="text-3xl font-bold mb-8">Organizador de viajes</h1>

        <PlaneaViaje onGuardarViaje={handleAgregarViaje} />
      </div>

      <div className="flex flex-col items-center w-full">
        {viajes.length === 0 ? (
          <CardComponent />
        ) : (
          <div className="w-full max-w-5xl">
            <h2 className="text-xl font-semibold mb-4">Guardado</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {viajes.map((viaje, index) => (
                <div
                  key={index}
                  className="relative rounded-2xl overflow-hidden bg-gray-200 h-56 flex flex-col justify-end"
                  style={{
                    backgroundColor: '#dce0e5',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="bg-gradient-to-t from-gray-800/70 to-transparent p-4">
                    <h3 className="text-white font-bold text-2xl">{viaje.nombre}</h3>
                    <p className="text-sm text-white/90">{'Aún no hay elementos guardados'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center w-full border border-gray-200 rounded-2xl p-4 hover:shadow-sm">
        <h2 className="font-semibold text-gray-900">Busca tu reservación </h2>
        <p className="text-sm text-gray-500">Busca con tu número de itinerario</p>
      </div>
    </>
  )
}
