interface Props {
  playerLuck: number;
  opponentLuck: number;
  pendingPlayerLuck: number | null;
  pendingOpponentLuck: number | null;
  luckUsedThisTurn: boolean;
  onRoll: () => void;
  onAccept: () => void;
  onReject: () => void;
}

export default function LuckPanel({
  playerLuck,
  opponentLuck,
  pendingPlayerLuck,
  pendingOpponentLuck,
  luckUsedThisTurn,
  onRoll,
  onAccept,
  onReject,
}: Props) {
  return (
    <section className="w-full max-w-[850px] mx-auto my-8 p-5 bg-white border-[5px] border-[#1f2a44] rounded-2xl shadow-[6px_6px_0_rgba(0,0,0,0.35)] text-center">
      <h3 className="text-[#1f2a44] text-xl font-bold m-0 mb-4">Suerte del turno</h3>
      <div className="flex justify-center gap-4 my-4">
        <div className="min-w-[140px] p-3 bg-[#1f2a44] border-4 border-[#ffcb05] rounded-xl">
          <span className="block text-[#ffcb05] font-black mb-1">Jugador</span>
          <span className="block text-white text-3xl font-black">{playerLuck}</span>
        </div>
        <div className="min-w-[140px] p-3 bg-[#1f2a44] border-4 border-[#ffcb05] rounded-xl">
          <span className="block text-[#ffcb05] font-black mb-1">Rival</span>
          <span className="block text-white text-3xl font-black">{opponentLuck}</span>
        </div>
      </div>

      {pendingPlayerLuck !== null ? (
        <div className="mt-4 p-4 bg-[#eaf6fb] border-3 border-[#1f2a44] rounded-xl">
          <h4 className="font-bold mb-3">Nueva tirada</h4>
          <div className="flex justify-center gap-4 mb-4">
            <div className="min-w-[140px] p-3 bg-[#1f2a44] border-4 border-[#ffcb05] rounded-xl">
              <span className="block text-[#ffcb05] font-black mb-1">Jugador</span>
              <span className="block text-white text-3xl font-black">{pendingPlayerLuck}</span>
            </div>
            <div className="min-w-[140px] p-3 bg-[#1f2a44] border-4 border-[#ffcb05] rounded-xl">
              <span className="block text-[#ffcb05] font-black mb-1">Rival</span>
              <span className="block text-white text-3xl font-black">{pendingOpponentLuck}</span>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <button onClick={onAccept} className="px-6 py-3 bg-green-600 text-white border-4 border-[#1f2a44] rounded-xl font-black cursor-pointer hover:bg-green-700">
              Aceptar nueva suerte
            </button>
            <button onClick={onReject} className="px-6 py-3 bg-[#ef5350] text-white border-4 border-[#1f2a44] rounded-xl font-black cursor-pointer hover:bg-red-700">
              Quedarme con la suerte actual
            </button>
          </div>
        </div>
      ) : !luckUsedThisTurn ? (
        <button onClick={onRoll} className="mx-auto my-6 px-6 py-3 bg-[#ffcb05] text-[#1f2a44] border-4 border-[#1f2a44] rounded-xl shadow-[4px_4px_0_rgba(0,0,0,0.35)] font-black text-lg cursor-pointer hover:bg-[#ef5350] hover:text-white">
          Tirar suerte
        </button>
      ) : (
        <p className="mt-4 text-[#1f2a44] font-black">
          Ya usaste la tirada de suerte este turno.
        </p>
      )}
    </section>
  );
}
