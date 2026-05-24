import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PokemonCard from "../components/PokemonCard";
import BattleEvents from "../components/BattleEvents";
import LuckPanel from "../components/LuckPanel";
import WinnerBanner from "../components/WinnerBanner";
import { api } from "../api/client";
import type { BattleState } from "../types/pokemon";

export default function Fight() {
  const { id } = useParams<{ id: string }>();
  const [battle, setBattle] = useState<BattleState | null>(null);

  const refresh = async () => {
    if (!id) return;
    const data = await api.getBattle(id);
    setBattle(data);
  };

  useEffect(() => {
    refresh();
  }, [id]);

  const handleNextTurn = async () => {
    if (!id) return;
    const data = await api.nextTurn(id);
    setBattle((prev) => prev ? { ...prev, ...data } : null);
  };

  const handleRollLuck = async () => {
    if (!id) return;
    const data = await api.rollLuck(id);
    setBattle((prev) => prev ? { ...prev, ...data } : null);
  };

  const handleAcceptLuck = async () => {
    if (!id) return;
    const data = await api.acceptLuck(id);
    setBattle((prev) => prev ? { ...prev, ...data, pendingPlayerLuck: null, pendingOpponentLuck: null } : null);
  };

  const handleRejectLuck = async () => {
    if (!id) return;
    const data = await api.rejectLuck(id);
    setBattle((prev) => prev ? { ...prev, ...data, pendingPlayerLuck: null, pendingOpponentLuck: null } : null);
  };

  if (!battle) {
    return (
      <>
        <Header />
        <div className="text-center text-white text-2xl mt-20">Cargando batalla...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      {battle.finished && battle.winner && battle.winnerRole && (
        <WinnerBanner winner={battle.winner} winnerRole={battle.winnerRole} />
      )}

      <h1 className="my-8 text-center font-['BADABOOM',Impact,sans-serif] text-5xl tracking-wider text-[#ffcb05] [text-shadow:3px_3px_0_#2a75bb,5px_5px_0_#1f2a44]">
        Batalla Pokemon
      </h1>

      <section className="w-full max-w-[950px] mx-auto my-8 grid grid-cols-[minmax(260px,360px)_100px_minmax(260px,360px)] gap-6 items-center justify-center max-md:grid-cols-1 max-md:max-w-[420px]">
        <PokemonCard pokemon={battle.fighterOne} />
        <div className="text-center font-['BADABOOM',Impact,sans-serif] text-4xl text-[#ffcb05] [text-shadow:3px_3px_0_#2a75bb,5px_5px_0_#1f2a44]">VS</div>
        <PokemonCard pokemon={battle.fighterTwo} />
      </section>

      {!battle.finished && (
        <>
          <LuckPanel
            playerLuck={battle.playerLuck}
            opponentLuck={battle.opponentLuck}
            pendingPlayerLuck={battle.pendingPlayerLuck}
            pendingOpponentLuck={battle.pendingOpponentLuck}
            luckUsedThisTurn={battle.luckUsedThisTurn}
            onRoll={handleRollLuck}
            onAccept={handleAcceptLuck}
            onReject={handleRejectLuck}
          />
          <form onSubmit={(e) => { e.preventDefault(); handleNextTurn(); }} className="w-full max-w-[850px] mx-auto mt-4 flex justify-center">
            <button type="submit" className="mx-auto px-6 py-3 bg-[#ffcb05] text-[#1f2a44] border-4 border-[#1f2a44] rounded-xl shadow-[4px_4px_0_rgba(0,0,0,0.35)] font-black text-lg cursor-pointer hover:bg-[#ef5350] hover:text-white">
              Nuevo turno
            </button>
          </form>
        </>
      )}

      <BattleEvents events={battle.events} />
      <Footer />
    </>
  );
}
