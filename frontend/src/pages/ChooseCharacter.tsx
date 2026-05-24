import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { api } from "../api/client";

interface PokemonOption {
  name: string;
  type1: string;
  type2: string | null;
}

export default function ChooseCharacter() {
  const [pokemonList, setPokemonList] = useState<PokemonOption[]>([]);
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.getPokemon().then((data) => {
      const shuffled = [...data].sort(() => Math.random() - 0.5);
      setPokemonList(shuffled);
      if (shuffled.length > 0) setSelected(shuffled[0].name);
    }).catch(console.error);
  }, []);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    try {
      const result = await api.startFight(selected);
      navigate(`/fight/${result.battleId}`);
    } catch (err) {
      console.error("Failed to start fight:", err);
    }
  };

  return (
    <>
      <Header />
      <h1 className="my-8 text-center font-['BADABOOM',Impact,sans-serif] text-5xl tracking-wider text-[#ffcb05] [text-shadow:3px_3px_0_#2a75bb,5px_5px_0_#1f2a44]">
        ELIJA A SU POKEMON Y PREPARESE PARA PELEAR
      </h1>
      <form onSubmit={handleStart} className="w-[70%] mx-auto my-8 p-5 bg-white border-[5px] border-[#1f2a44] rounded-2xl shadow-[6px_6px_0_rgba(0,0,0,0.35)]">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-3 bg-[#ffcb05] text-[#1f2a44] text-lg font-black border-b-4 border-[#1f2a44]">PERSONAJE PRINCIPAL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-5 text-center">
                <label htmlFor="jugador" className="block mb-2 text-[#1f2a44] text-lg font-bold">Elegi tu Pokemon</label>
                <select
                  id="jugador"
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  className="w-full mb-5 p-3 bg-white text-[#1f2a44] border-3 border-[#1f2a44] rounded-xl font-sans text-base"
                >
                  {pokemonList.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name} - {p.type1}{p.type2 ? ` / ${p.type2}` : ""}
                    </option>
                  ))}
                </select>
                <button type="submit" className="mx-auto my-6 px-6 py-3 bg-[#ffcb05] text-[#1f2a44] border-4 border-[#1f2a44] rounded-xl shadow-[4px_4px_0_rgba(0,0,0,0.35)] font-black text-lg cursor-pointer hover:bg-[#ef5350] hover:text-white">
                  Elegir Pokemon
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <Footer />
    </>
  );
}
