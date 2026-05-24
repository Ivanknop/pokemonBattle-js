const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.statusText}`);
  return res.json();
}

export const api = {
  getPokemon: (limit = 0, offset = 0) =>
    fetchJson<any[]>(`/pokemon?limit=${limit}&offset=${offset}`),

  getRandomPokemon: () => fetchJson<any>("/pokemon/random"),

  getRandomExcluding: (name: string) =>
    fetchJson<any>(`/pokemon/random-excluding?name=${encodeURIComponent(name)}`),

  getPokemonByName: (name: string) =>
    fetchJson<any>(`/pokemon/${encodeURIComponent(name)}`),

  startFight: (playerName: string) =>
    fetchJson<{ battleId: string; fighterOne: any; fighterTwo: any }>("/fight/start", {
      method: "POST",
      body: JSON.stringify({ playerName }),
    }),

  getBattle: (id: string) => fetchJson<any>(`/fight/${id}`),

  nextTurn: (id: string) =>
    fetchJson<any>(`/fight/${id}/turn`, { method: "POST" }),

  rollLuck: (id: string) =>
    fetchJson<any>(`/fight/${id}/luck`, { method: "POST" }),

  acceptLuck: (id: string) =>
    fetchJson<any>(`/fight/${id}/luck/accept`, { method: "POST" }),

  rejectLuck: (id: string) =>
    fetchJson<any>(`/fight/${id}/luck/reject`, { method: "POST" }),

  getTypeChart: () =>
    fetchJson<{ typeChart: Record<string, Record<string, number>>; types: string[] }>("/type-chart"),
};
