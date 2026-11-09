import { forwardRef, useImperativeHandle } from "react";
import { armyListData } from "../../../assets/data.ts";
import { useRosterInformation } from "../../../hooks/calculations-and-displays/useRosterInformation.ts";
import { useTranslation } from "../../../i18n/LanguageContext";
import { translateGameText } from "../../../i18n/game-text";
import {
  FreshUnit,
  isSelectedUnit,
  Roster,
  SelectedUnit,
} from "../../../types/roster.ts";
import { getSumOfUnits } from "./totalUnits.ts";

export type RosterTextViewProps = {
  roster: Roster;
  showArmyBonus: boolean;
  showUnitTotals: boolean;
};
export type RosterTextViewHandlers = {
  copyToClipboard: () => void;
};

export const RosterTextView = forwardRef<
  RosterTextViewHandlers,
  RosterTextViewProps
>(({ roster, showArmyBonus, showUnitTotals }, ref) => {
  const { t, language } = useTranslation();
  const { getAdjustedMetaData } = useRosterInformation();
  const { additional_rules, special_rules, break_point } =
    armyListData[roster.armyList];

  const heroToText = (hero: FreshUnit | SelectedUnit, isLeader: boolean) => {
    if (!isSelectedUnit(hero)) return "";

    const name = isLeader
      ? `  ${hero.name} *GENERAL* (${hero.pointsTotal} ${t("points")})`
      : `  ${hero.name} (${hero.pointsTotal} ${t("points")})`;

    const options = hero.options
      .map((option) => {
        if (!option.quantity || option.quantity === 0) return null;
        return `    ~ ${option.max > 1 ? option.quantity + " " + translateGameText(language, option.name) : translateGameText(language, option.name)}  `;
      })
      .filter((o) => !!o);

    if (options.length === 0) return `${name}  `;
    return `${name}  \n${options.join("  \n")}`;
  };

  const unitsToText = (units: SelectedUnit[]) => {
    const lines = units
      .map((unit) => {
        const quantity = !unit.unique ? `${unit.quantity}x ` : ``;
        const name = `  ${quantity}${translateGameText(language, unit.name)} (${unit.pointsTotal} ${t("points")})`;
        const options = unit.options
          .map((option) => {
            if (!option.quantity || option.quantity === 0) return null;
            return `    ~ ${option.max > 1 ? option.quantity + " " + translateGameText(language, option.name) : translateGameText(language, option.name)}  `;
          })
          .filter((o) => !!o);
        if (options.length === 0) return `${name}  `;
        return `${name}  \n${options.join("  \n")}`;
      })
      .join("\n");
    return lines ? lines + "\n" : "";
  };

  const armyBonus = () => {
    if (!showArmyBonus) return "";
    const header = `  
      ===== ${t("Army Bonuses")} =====

      `;

    const additionalRules = additional_rules
      ?.map((rule) => `~ ${translateGameText(language, rule.description)}\n`)
      ?.join("  ");
    const specialRules = special_rules
      ?.map(
        (rule) =>
          `*${translateGameText(language, rule.title)}*\n${translateGameText(language, rule.description)}\n`,
      )
      ?.join("  \n");

    return (
      header +
      (additionalRules ? `${additionalRules}  \n  ` : "") +
      (specialRules ? `${specialRules}  \n  ` : "")
    );
  };

  const admission = () => {
    return `
    ----------------------------------------
    ${t("Created with MESBG List Builder")}
    https://mesbg-list-builder.com/
    `;
  };

  const createTextView = () => {
    const { might, will, fate, units, points, leader, bows, throwingWeapons } =
      getAdjustedMetaData(roster);

    const unitSections = showUnitTotals
      ? `    
        ----------------------------------------\n        
        ${unitsToText(getSumOfUnits(roster))}
        `
      : roster.warbands
          .map((warband) => {
            return `    
              ----------------------------------------
              ${t("Warband")} ${warband.meta.num} (${warband.meta.points} ${t("points")})
              ${heroToText(warband.hero, warband.id === leader)}
              ${unitsToText(warband.units.filter(isSelectedUnit))}`;
          })
          .join("  ");

    return `
    ${roster.armyList}
    ----------------------------------------
    | ${t("Points:")} ${points} | ${t("Units:")} ${units} | ${t("Broken:")} ${units > 0 ? Math.floor(units * (break_point ?? 0.5)) + 1 : 0} ${t("dead")} | ${t("Quartered:")} ${Math.floor(0.25 * units)} ${t("left")} |
    | ${t("Bows:")} ${bows} | ${t("Throwing weapons:")} ${throwingWeapons} | Might/Will/Fate: ${might} / ${will} / ${fate} |
    ${unitSections}${armyBonus()}${admission()}
    `;
  };

  const trimMultiline = (input: string) => {
    return input.replace(/^[ \t]+/gm, "");
  };

  const rosterText = trimMultiline(createTextView());

  useImperativeHandle(ref, () => ({
    copyToClipboard: () => window.navigator.clipboard.writeText(rosterText),
  }));

  return <pre style={{ whiteSpace: "pre-wrap" }}>{rosterText}</pre>;
});
