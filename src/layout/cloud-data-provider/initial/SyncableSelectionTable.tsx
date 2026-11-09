import { Checkbox, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useNavigate } from "react-router-dom";
import { CustomAlert } from "../../../components/atoms/alert/CustomAlert.tsx";
import { useTranslation } from "../../../i18n/LanguageContext";
import { TranslatedText } from "../../../i18n/TranslatedText";
import { SyncItem } from "./sync-item.ts";

type SyncableSelectionTableProps = {
  unsyncedItems?: SyncItem[];
  toggleCheckbox?: (row: SyncItem, index: number) => void;
  toggleAllCheckboxes?: () => void;
  startSyncing?: () => void;
};

export const SyncableSelectionTable = ({
  unsyncedItems,
  toggleCheckbox,
  toggleAllCheckboxes,
  startSyncing,
}: SyncableSelectionTableProps) => {
  const { t: translateUI } = useTranslation();

  const navigate = useNavigate();

  const allSelected = unsyncedItems.every((item) => item.sync);
  const noneSelected = unsyncedItems.every((item) => !item.sync);
  const unselected = unsyncedItems.filter((item) => !item.sync).length;

  return (
    <>
      <Typography>
        <TranslatedText message="We noticed you still have some data saved locally on your device. Let’s sync it to your account so you can always access it, no matter where you log in." />
      </Typography>

      <Typography>
        <TranslatedText message="Select the items you want to save your account below." />
      </Typography>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 650 }}
          size="small"
          aria-label={translateUI("table with all the unsynced items")}
        >
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={!allSelected && !noneSelected}
                  checked={allSelected}
                  onChange={toggleAllCheckboxes}
                />
              </TableCell>
              <TableCell component="th">
                <Typography fontWeight="bold">
                  <TranslatedText message="Type" />
                </Typography>
              </TableCell>
              <TableCell component="th">
                <Typography fontWeight="bold">
                  <TranslatedText message="Info" />
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {unsyncedItems.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={row.sync}
                    onChange={() => toggleCheckbox(row, index)}
                  />
                </TableCell>
                <TableCell>
                  <TranslatedText message={row.type} />
                </TableCell>
                <TableCell>{row.id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {unselected > 0 && (
        <CustomAlert
          title={translateUI("{{count}} items will be deleted!", {
            count: unselected,
          })}
          severity="warning"
        >
          <TranslatedText message="Items you do not sync to your account will get lost and will have to be manually created again." />
        </CustomAlert>
      )}
      {noneSelected ? (
        <Button
          color="warning"
          variant="contained"
          onClick={() => navigate("/rosters")}
        >
          <TranslatedText message="Delete all unsynced items" />
        </Button>
      ) : (
        <Button variant="contained" onClick={startSyncing}>
          <TranslatedText message="Save" />{" "}
          {unselected === 0 ? (
            <TranslatedText message="all" />
          ) : (
            unsyncedItems.length - unselected
          )}{" "}
          <TranslatedText message="items to your account" />
        </Button>
      )}
    </>
  );
};
