import { Link } from "react-router-dom";

export default function Header() {
  return (
    <>
      <h2 className="text-center text-white text-2xl font-bold py-4 bg-[#1f2a44] m-0">
        SUPER POKEMON BATTLE
      </h2>
      <nav className="flex justify-center gap-4 px-4 py-3 bg-[#ef5350] border-b-[5px] border-[#1f2a44] shadow-md">
        <Link to="/" className="px-4 py-2 bg-[#2a75bb] text-white border-3 border-[#1f2a44] rounded-xl font-bold text-lg no-underline hover:bg-[#ffcb05] hover:text-[#1f2a44]">
          Inicio
        </Link>
        <Link to="/type-chart" className="px-4 py-2 bg-[#2a75bb] text-white border-3 border-[#1f2a44] rounded-xl font-bold text-lg no-underline hover:bg-[#ffcb05] hover:text-[#1f2a44]">
          Tabla de tipos
        </Link>
        <Link to="/characters" className="px-4 py-2 bg-[#2a75bb] text-white border-3 border-[#1f2a44] rounded-xl font-bold text-lg no-underline hover:bg-[#ffcb05] hover:text-[#1f2a44]">
          Pokemons Disponibles
        </Link>
        <Link to="/choose" className="px-4 py-2 bg-[#2a75bb] text-white border-3 border-[#1f2a44] rounded-xl font-bold text-lg no-underline hover:bg-[#ffcb05] hover:text-[#1f2a44]">
          Elegir Pokemon
        </Link>
      </nav>
    </>
  );
}
