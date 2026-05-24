import type { PokemonData } from "../types/pokemon";

interface Props {
  pokemon: PokemonData;
  label?: string;
}

export default function PokemonCard({ pokemon, label }: Props) {
  return (
    <div className="min-h-[180px] p-5 text-center bg-[#f8f8f8] border-[5px] border-[#1f2a44] rounded-2xl shadow-[6px_6px_0_rgba(0,0,0,0.35)]">
      {label && <p className="text-sm font-bold text-[#1f2a44] mb-1">{label}</p>}
      <h2 className="text-[#2a75bb] text-2xl font-bold m-0 mb-3">{pokemon.name}</h2>
      <p className="text-[#1f2a44] font-bold my-1">
        Tipo: {pokemon.type1}{pokemon.type2 ? ` / ${pokemon.type2}` : ""}
      </p>
      <div className="w-4/5 mx-auto mt-4 px-4 py-3 flex items-center justify-between bg-[#1f2a44] border-4 border-[#ffcb05] rounded-xl">
        <span className="text-[#ffcb05] text-sm font-black">HP</span>
        <span className="text-white text-3xl font-black">{pokemon.hp}</span>
      </div>
    </div>
  );
}
