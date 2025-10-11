import { useState } from "react"
import { FaBell, FaBars, FaTimes } from "react-icons/fa"
import { Link } from "react-router-dom"

export default function Header() {
    const [abrirMenu, setAbrirMenu] = useState(false)

    return (
        <header className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center space-x-6">
                        <Link to="/">
                            <img
                                src="/src/img/Expedia_Logo_2023.svg.png"
                                alt="Expedia"
                                className="h-8 w-auto"
                            />
                        </Link>
                    </div>
                    <div className="hidden lg:flex items-center space-x-6">
                        <Link
                            to="/trips"
                            className="text-gray-800 hover:text-blue-600 font-medium">
                            Mis viajes
                        </Link>
                        <button className="text-gray-800 hover:text-blue-600">
                            <FaBell size={20} />
                        </button>
                        <Link
                            to={"/login"}
                            className="text-gray-800 hover:text-blue-600 font-medium">
                            Iniciar sesión
                        </Link>
                    </div>
                    {/* Botón menú móvil */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setAbrirMenu(!abrirMenu)}
                            className="text-gray-800 hover:text-blue-600 focus:outline-none">
                            {abrirMenu ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>
            </div>
            {/* Menú móvil desplegable */}
            {abrirMenu && (
                <div className="lg:hidden bg-white border-t border-gray-200 shadow-md">
                    <div className="px-4 py-3 flex flex-col space-y-3">
                        <Link
                            to="/trips"
                            className="text-gray-800 hover:text-blue-600"
                            onClick={() => setAbrirMenu(false)}>
                            Mis viajes
                        </Link>
                        <button
                            className="flex items-center text-gray-800 hover:text-blue-600"
                            onClick={() => setAbrirMenu(false)}>
                            <FaBell className="mr-2" />
                            Notificaciones
                        </button>
                        <Link
                            to="/login"
                            className="text-gray-800 hover:text-blue-600"
                            onClick={() => setAbrirMenu(false)}>
                            Iniciar sesión
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}