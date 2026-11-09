import { saveAs } from "file-saver";
import { toBlob } from "html-to-image";
import JSZip from "jszip";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { ConfiguredProfileCard } from "./ConfiguredProfileCard";
import { ConfiguredCard } from "./card-model";

/** Render at a stable size, independently of the preview's viewport. */
export async function configuredCardPng(card: ConfiguredCard): Promise<Blob> {
  const host = document.createElement("div");
  host.style.cssText =
    "position:fixed;left:-100000px;top:0;width:1280px;pointer-events:none;";
  document.body.appendChild(host);
  const root = createRoot(host);
  try {
    flushSync(() => root.render(<ConfiguredProfileCard card={card} />));
    await document.fonts.ready;
    await Promise.all(
      [...host.querySelectorAll("img")].map(async (img) => {
        if (img.complete && img.naturalWidth > 0) return;
        await new Promise<void>((resolve, reject) => {
          const timer = window.setTimeout(() => {
            cleanup();
            reject(new Error("No se pudo cargar la imagen de la carta."));
          }, 10000);
          function cleanup() {
            window.clearTimeout(timer);
            img.removeEventListener("load", loaded);
          }
          function loaded() {
            cleanup();
            resolve();
          }
          img.addEventListener("load", loaded);
          // Cover a load completing between the first check and the listener.
          if (img.complete && img.naturalWidth > 0) loaded();
        });
      }),
    );
    const node = host.querySelector<HTMLElement>("[data-configured-card]");
    const blob = await toBlob(node, {
      pixelRatio: 2,
      skipFonts: true,
      backgroundColor: "#fbf8f0",
    });
    if (!blob) throw new Error("No se pudo generar la carta.");
    return blob;
  } finally {
    root.unmount();
    host.remove();
  }
}

export async function downloadConfiguredCards(cards: ConfiguredCard[]) {
  const zip = new JSZip();
  // Index keeps variants and equal names in different factions from overwriting.
  for (const [index, card] of cards.entries()) {
    const filename = `${String(index + 1).padStart(3, "0")}-${card.name.replace(/[\\/:*?"<>|]/g, "-")}.png`;
    zip.file(filename, await configuredCardPng(card));
  }
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `MESBG-Cartas-ES-${new Date().toISOString().slice(0, 10)}.zip`);
}
