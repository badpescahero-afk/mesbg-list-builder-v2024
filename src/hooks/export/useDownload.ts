import { saveAs } from "file-saver";
import JSZip from "jszip";
import { useState } from "react";
import { heroConstraintData, profileData } from "../../assets/data.ts";
import { isSelectedUnit } from "../../types/roster.ts";
import { useRosterInformation } from "../calculations-and-displays/useRosterInformation.ts";

export function download(
  content: string,
  fileName: string,
  contentType: string,
) {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}

export const useDownload = () => {
  const [isDownloading, setDownloading] = useState(false);
  const { roster } = useRosterInformation();

  const downloadProfileCards = async () => {
    setDownloading(true);
    const profileCards = [];
    roster.warbands.map((_warband) => {
      if (_warband.hero) {
        profileCards.push(
          [_warband.hero.profile_origin, _warband.hero.name].join("|"),
        );
        if (
          _warband.hero.unit_type !== "Siege Engine" &&
          (heroConstraintData[_warband.hero.model_id]?.extra_profiles || [])
            .length > 0
        ) {
          heroConstraintData[_warband.hero.model_id]["extra_profiles"].map(
            (_profile) => {
              profileCards.push(
                [_warband.hero.profile_origin, _profile].join("|"),
              );
              return null;
            },
          );
        }
      }
      _warband.units.filter(isSelectedUnit).map((_unit) => {
        if (_unit.name != null && _unit.unit_type !== "Siege Equipment") {
          profileCards.push([_unit.profile_origin, _unit.name].join("|"));
        }
        return null;
      });
      return null;
    });
    for (const unit of roster.warbands
      .flatMap((warband) => [warband.hero, ...warband.units])
      .filter(isSelectedUnit)) {
      for (const overflow of profileData[unit.profile_origin]?.[unit.name]
        ?.overflow_cards || []) {
        profileCards.push([unit.profile_origin, overflow].join("|"));
      }
    }
    const profileCardsSet = new Set(profileCards);
    const finalProfileCards = [...profileCardsSet];

    try {
      const zip = new JSZip();
      for (const card of finalProfileCards) {
        const [origin, profile] = card.split("|");
        const cardUrl = encodeURI(
          `${RESOURCES_URL}/images/profiles/${origin}/cards/${profile}.jpg`,
        );
        const response = await fetch(cardUrl);
        if (
          !response.ok ||
          !response.headers.get("content-type")?.startsWith("image/")
        )
          throw new Error(`Missing original card: ${origin}/${profile}`);
        zip.file(`${origin}/${profile}.jpg`, await response.blob(), {
          binary: true,
        });
      }
      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(
        blob,
        "MESBG-Army-Profiles-" +
          new Date().toISOString().substring(0, 19).replaceAll(":", "-") +
          ".zip",
      );
    } finally {
      setDownloading(false);
    }
  };

  return {
    downloadProfileCards,
    isDownloading,
  };
};
