interface Props {
  events: string[];
}

export default function BattleEvents({ events }: Props) {
  return (
    <section className="w-full max-w-[850px] mx-auto my-8 p-5 bg-white border-[5px] border-[#1f2a44] rounded-2xl shadow-[6px_6px_0_rgba(0,0,0,0.35)]">
      <h3 className="text-[#1f2a44] text-xl font-bold m-0 mb-4">Historial de batalla</h3>
      {events.length > 0 ? (
        <ul className="list-none p-0">
          {events.map((event, i) => (
            <li key={i} className="mb-2 p-3 bg-[#eaf6fb] border-2 border-[#1f2a44] rounded-xl font-bold">
              {event}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[#1f2a44] font-bold">La batalla está por comenzar.</p>
      )}
    </section>
  );
}
