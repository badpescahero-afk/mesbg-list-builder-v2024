// Names approved in the supplied Spanish design references. Unknown names keep
// their canonical spelling; this map never participates in model lookup.
const names: Record<string, string> = {
  "Boromir, Captain of the White Tower": "Boromir, capitán de la Torre Blanca",
  Faramir: "Faramir, capitán de Gondor",
  "Faramir, Captain of Gondor": "Faramir, capitán de Gondor",
  "Knight of Minas Tirith": "Caballero de Minas Tirith",
  "Warrior of Minas Tirith": "Guerrero de Minas Tirith",
  "Ranger of Gondor": "Montaraz de Gondor",
};
export function cardName(name: string) {
  return names[name] || name;
}
