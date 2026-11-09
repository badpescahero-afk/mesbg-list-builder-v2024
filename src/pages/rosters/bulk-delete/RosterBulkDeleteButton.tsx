import { Delete, DeleteForever } from "@mui/icons-material";
import { Badge, Button } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTranslation } from "../../../i18n/LanguageContext";
import { TranslatedText } from "../../../i18n/TranslatedText";

export const RosterBulkDeleteButton = ({
  toggleBulkDelete,
  isDeleting,
  selectedRosters,
}: {
  toggleBulkDelete: () => void;
  isDeleting: boolean;
  selectedRosters: string[];
}) => {
  const { t: translateUI } = useTranslation();

  return (
    <>
      <Badge badgeContent={selectedRosters.length} color="error">
        <Button
          sx={{ width: "5ch" }}
          variant="outlined"
          color={
            isDeleting
              ? selectedRosters.length > 0
                ? "error"
                : "warning"
              : "inherit"
          }
          aria-label={translateUI("bulk delete")}
          onClick={toggleBulkDelete}
        >
          <Stack alignItems="center" sx={{ pt: 0.4 }}>
            {!isDeleting ? <Delete /> : <DeleteForever />}
            <Typography variant="subtitle1" sx={{ fontSize: "0.65rem" }}>
              <TranslatedText message="bulk" />
            </Typography>
          </Stack>
        </Button>
      </Badge>
    </>
  );
};
