import { Language } from "./locale";

// Presentation only. W (Wounds) and HW (Will) deliberately have separate keys.
const labels = {
  Mv: ["Mv", "Move", "Mov", "Movimiento"],
  Fv: ["Fv", "Fight Value", "C", "Combate"],
  Sv: ["Sv", "Shoot Value", "Dis", "Disparo"],
  S: ["S", "Strength", "F", "Fuerza"],
  D: ["D", "Defence", "D", "Defensa"],
  A: ["A", "Attacks", "A", "Ataques"],
  W: ["W", "Wounds", "H", "Heridas"],
  C: ["C", "Courage", "Cor", "Coraje"],
  I: ["I", "Intelligence", "I", "Inteligencia"],
  HM: ["M", "Might", "P", "Poder"],
  HW: ["W", "Will", "V", "Voluntad"],
  HF: ["F", "Fate", "D", "Destino"],
  Range: ["Range", "Range", "Alcance", "Alcance"],
  MoveOrRange: [
    "Mv / Range",
    "Move / Range",
    "Mov / Alcance",
    "Movimiento / Alcance",
  ],
} as const;

export type StatKey = keyof typeof labels;

export function statLabel(
  language: Language,
  stat: StatKey,
  full = false,
): string {
  return labels[stat][(language === "es" ? 2 : 0) + (full ? 1 : 0)];
}
