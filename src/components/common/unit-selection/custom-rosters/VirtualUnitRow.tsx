import { Box } from "@mui/material";
import { useTranslation } from "../../../../i18n/LanguageContext";
import { Unit } from "../../../../types/mesbg-data.types.ts";
import { UnitSelectionButton } from "../UnitSelectionButton.tsx";
import { WithRibbon } from "../WithRibbon.tsx";

export function VirtualUnitRow({
  unit,
  selectUnit,
}: {
  unit: Unit;
  selectUnit: (unit: Unit) => void;
}) {
  const { t: translateUI } = useTranslation();

  return (
    <Box sx={{ my: 1 }}>
      <WithRibbon
        key={unit.model_id}
        label={translateUI("Legacy")}
        hideRibbon={!unit.legacy}
      >
        <UnitSelectionButton unit={unit} onClick={() => selectUnit(unit)} />
      </WithRibbon>
    </Box>
  );
}
