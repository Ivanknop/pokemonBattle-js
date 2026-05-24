import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { api } from "../api/client";

interface PokemonRow {
  name: string;
  type1: string;
  type2: string | null;
  hp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
}

export default function Characters() {
  const [data, setData] = useState<PokemonRow[]>([]);

  useEffect(() => {
    api.getPokemon().then(setData).catch(console.error);
  }, []);

  return (
    <>
      <Header />
      <h1 className="my-8 text-center font-['BADABOOM',Impact,sans-serif] text-5xl tracking-wider text-[#ffcb05] [text-shadow:3px_3px_0_#2a75bb,5px_5px_0_#1f2a44]">
        TABLA DE PERSONAJES
      </h1>
      <table className="w-[85%] mx-auto my-8 overflow-hidden border-separate border-spacing-0 bg-[#f8f8f8] border-[5px] border-[#1f2a44] rounded-2xl shadow-[6px_6px_0_rgba(0,0,0,0.35)]">
        <thead>
          <tr>
            <th className="p-3 bg-[#ffcb05] text-[#1f2a44] text-lg font-black border-b-4 border-[#1f2a44]">Nombre</th>
            <th className="p-3 bg-[#ffcb05] text-[#1f2a44] text-lg font-black border-b-4 border-[#1f2a44]">Tipo 1</th>
            <th className="p-3 bg-[#ffcb05] text-[#1f2a44] text-lg font-black border-b-4 border-[#1f2a44]">Tipo 2</th>
            <th className="p-3 bg-[#ffcb05] text-[#1f2a44] text-lg font-black border-b-4 border-[#1f2a44]">HP</th>
            <th className="p-3 bg-[#ffcb05] text-[#1f2a44] text-lg font-black border-b-4 border-[#1f2a44]">Attack</th>
            <th className="p-3 bg-[#ffcb05] text-[#1f2a44] text-lg font-black border-b-4 border-[#1f2a44]">Defense</th>
            <th className="p-3 bg-[#ffcb05] text-[#1f2a44] text-lg font-black border-b-4 border-[#1f2a44]">Sp. Attack</th>
            <th className="p-3 bg-[#ffcb05] text-[#1f2a44] text-lg font-black border-b-4 border-[#1f2a44]">Sp. Defense</th>
            <th className="p-3 bg-[#ffcb05] text-[#1f2a44] text-lg font-black border-b-4 border-[#1f2a44]">Speed</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.name} className="even:bg-[#eaf6fb] hover:bg-[#fff3a3]">
              <td className="p-3 text-center bg-white text-[#1f2a44] border-b border-[#c7d4df] even:bg-[#eaf6fb]">{row.name}</td>
              <td className="p-3 text-center bg-white text-[#1f2a44] border-b border-[#c7d4df] even:bg-[#eaf6fb]">{row.type1}</td>
              <td className="p-3 text-center bg-white text-[#1f2a44] border-b border-[#c7d4df] even:bg-[#eaf6fb]">{row.type2 || "-"}</td>
              <td className="p-3 text-center bg-white text-[#1f2a44] border-b border-[#c7d4df] even:bg-[#eaf6fb]">{row.hp}</td>
              <td className="p-3 text-center bg-white text-[#1f2a44] border-b border-[#c7d4df] even:bg-[#eaf6fb]">{row.attack}</td>
              <td className="p-3 text-center bg-white text-[#1f2a44] border-b border-[#c7d4df] even:bg-[#eaf6fb]">{row.defense}</td>
              <td className="p-3 text-center bg-white text-[#1f2a44] border-b border-[#c7d4df] even:bg-[#eaf6fb]">{row.spAttack}</td>
              <td className="p-3 text-center bg-white text-[#1f2a44] border-b border-[#c7d4df] even:bg-[#eaf6fb]">{row.spDefense}</td>
              <td className="p-3 text-center bg-white text-[#1f2a44] border-b border-[#c7d4df] even:bg-[#eaf6fb]">{row.speed}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Footer />
    </>
  );
}
