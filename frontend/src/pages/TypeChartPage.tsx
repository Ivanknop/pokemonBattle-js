import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { api } from "../api/client";

export default function TypeChartPage() {
  const [typeChart, setTypeChart] = useState<Record<string, Record<string, number>>>({});
  const [types, setTypes] = useState<string[]>([]);

  useEffect(() => {
    api.getTypeChart().then((data) => {
      setTypeChart(data.typeChart);
      setTypes(data.types);
    }).catch(console.error);
  }, []);

  const cellClass = (multiplier: number) => {
    if (multiplier === 0) return "bg-[#ef5350] text-white";
    if (multiplier < 1) return "bg-[#ffcb05] text-[#1f2a44]";
    if (multiplier > 1) return "bg-green-600 text-white";
    return "bg-white text-[#1f2a44]";
  };

  return (
    <>
      <Header />
      <h1 className="my-8 text-center font-['BADABOOM',Impact,sans-serif] text-5xl tracking-wider text-[#ffcb05] [text-shadow:3px_3px_0_#2a75bb,5px_5px_0_#1f2a44]">
        Tabla de tipos
      </h1>

      <section className="w-[95%] max-w-[900px] mx-auto my-4 flex flex-wrap justify-center gap-4 bg-white border-[5px] border-[#1f2a44] rounded-2xl shadow-[6px_6px_0_rgba(0,0,0,0.35)] p-4">
        <p className="flex items-center gap-2 font-black"><span className="w-6 h-6 inline-block border-2 border-[#1f2a44] rounded-md bg-green-600"></span> Súper efectivo</p>
        <p className="flex items-center gap-2 font-black"><span className="w-6 h-6 inline-block border-2 border-[#1f2a44] rounded-md bg-[#ffcb05]"></span> Poco efectivo</p>
        <p className="flex items-center gap-2 font-black"><span className="w-6 h-6 inline-block border-2 border-[#1f2a44] rounded-md bg-[#ef5350]"></span> Sin efecto</p>
        <p className="flex items-center gap-2 font-black"><span className="w-6 h-6 inline-block border-2 border-[#1f2a44] rounded-md bg-white"></span> Normal</p>
      </section>

      <section className="w-[95%] max-w-[1200px] mx-auto my-8 overflow-x-auto bg-white border-[5px] border-[#1f2a44] rounded-2xl shadow-[6px_6px_0_rgba(0,0,0,0.35)] p-4">
        <table className="w-full min-w-[900px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-2 border-[#1f2a44] p-2 text-center bg-[#ffcb05] text-[#1f2a44] font-black">Ataque \ Defensa</th>
              {types.map((t) => (
                <th key={t} className="border-2 border-[#1f2a44] p-2 text-center bg-[#ffcb05] text-[#1f2a44] font-black">{t}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {types.map((atk) => (
              <tr key={atk}>
                <th className="border-2 border-[#1f2a44] p-2 text-center bg-[#2a75bb] text-white font-black">{atk}</th>
                {types.map((def) => {
                  const mult = typeChart[atk]?.[def] ?? 1;
                  return (
                    <td key={def} className={`border-2 border-[#1f2a44] p-2 text-center font-black ${cellClass(mult)}`}>
                      {mult}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <Footer />
    </>
  );
}
