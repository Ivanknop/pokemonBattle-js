import { Link } from "react-router-dom";

interface Props {
  winner: string;
  winnerRole: string;
}

export default function WinnerBanner({ winner, winnerRole }: Props) {
  return (
    <>
      <section className="w-[90%] max-w-[900px] mx-auto my-4 p-6 text-center bg-[#ffcb05] text-[#1f2a44] text-3xl font-black border-[5px] border-[#1f2a44] rounded-2xl shadow-[6px_6px_0_rgba(0,0,0,0.35)]">
        Ganador: {winner} Pokémon ({winnerRole})
      </section>
      <section className="max-w-[600px] mx-auto my-8 p-5 text-center bg-[#ffcb05] border-[5px] border-[#1f2a44] rounded-2xl shadow-[6px_6px_0_rgba(0,0,0,0.35)]">
        <h2 className="text-[#1f2a44] text-2xl font-bold m-0 mb-4">Vencedor: {winner}</h2>
        <Link to="/choose" className="inline-block mx-auto my-4 px-6 py-3 bg-[#ffcb05] text-[#1f2a44] border-4 border-[#1f2a44] rounded-xl shadow-[4px_4px_0_rgba(0,0,0,0.35)] font-black text-lg no-underline cursor-pointer hover:bg-[#ef5350] hover:text-white">
          Nueva batalla
        </Link>
      </section>
    </>
  );
}
