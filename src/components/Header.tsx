import { FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center space-x-6">
                        <div>
                            <Link to="/">
                                <img
                                    src="..\src\img\Expedia_Logo_2023.svg.png"
                                    alt="Expedia"
                                    className="h-8 w-auto"
                                /></Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <nav className="hidden lg:flex space-x-8">
                        </nav>
                        <button className="hidden lg:flex items-center text-black-700 hover:text-blue-600 ">
                            Mis viajes
                        </button>
                        <button className="hidden lg:flex items-center text-black-700 hover:text-blue-600">
                            <FaBell className="mr-2" size={20} />
                        </button>
                        <button className="hidden lg:flex items-center text-black-700 hover:text-blue-600 ">
                            Iniciar sesión
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
