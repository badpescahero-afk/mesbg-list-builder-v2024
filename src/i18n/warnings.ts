import { translateGameText } from "./game-text";
import { Language } from "./locale";
import { spanishWarnings } from "./warnings.es";

// Only match the engine's known message formats; never alter its output, state
// or validation. Numbers stay literal; names are localised only in the view.
const patterns: [RegExp, (...values: string[]) => string][] = [
  [
    /^The army general should always be the hero with the highest tier available\. You should select a (.+) to be your army general\.$/,
    (tier) =>
      `El general debe ser el héroe de mayor rango disponible. Debes seleccionar un ${translateGameText("es", tier)} como general.`,
  ],
  [
    /^(.+) may not include more Fledgeling Great Eagles than Great Eagles\. There are currently (\d+) Fledgeling Great Eagle too many\.$/,
    (army, count) =>
      `${translateGameText("es", army)} no puede incluir más Crías de Gran Águila que Grandes Águilas. Actualmente sobran ${count} Crías de Gran Águila.`,
  ],
  [
    /^This Army may not include more Goblin models than Orc models\. Currently counting (\d+) Orcs and (\d+) Goblins\.$/,
    (orcs, goblins) =>
      `El ejército no puede incluir más Trasgos que Orcos. Actualmente hay ${orcs} Orcos y ${goblins} Trasgos.`,
  ],
  [
    /^Warbands without a hero require 6 or more models\. Warband (\d+) only has (\d+)$/,
    (warband, count) =>
      `Las compañías sin héroe necesitan 6 miniaturas o más. La compañía ${warband} solo tiene ${count}.`,
  ],
  [
    /^Warbands without a hero require 10 to 12 models\. Warband (\d+) is outside this range\.$/,
    (warband) =>
      `Las compañías sin héroe necesitan entre 10 y 12 miniaturas. La compañía ${warband} está fuera de ese intervalo.`,
  ],
  [
    /^Only 33% of this army can have the Lothlórien keyword\. The current roster has ([\d.]+)% models with the Lothlórien keyword$/,
    (percentage) =>
      `Solo el 33% del ejército puede tener la palabra clave Lothlórien. La lista actual tiene un ${percentage}% de miniaturas con esa palabra clave.`,
  ],
];

export function translateWarning(language: Language, message: string): string {
  if (language === "en") return message;
  if (Object.prototype.hasOwnProperty.call(spanishWarnings, message)) {
    return spanishWarnings[message as keyof typeof spanishWarnings];
  }
  for (const [pattern, format] of patterns) {
    const match = pattern.exec(message);
    if (match) return format(...match.slice(1));
  }
  return message;
}
