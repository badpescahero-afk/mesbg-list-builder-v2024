import { TableSortLabel } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { MouseEvent } from "react";
import { useScreenSize } from "../../../hooks/calculations-and-displays/useScreenSize.ts";
import { useTranslation } from "../../../i18n/LanguageContext";
import { StatLabel } from "../../../i18n/StatLabel";
import { useThemeContext } from "../../../theme/ThemeContext.tsx";
import { DatabaseRow } from "../data.ts";
import { Order } from "../utils/sorting.ts";
import { DatabaseTableRow } from "./DatabaseTableRow.tsx";

interface DatabaseTableProps {
  order: Order;
  orderBy: string;
  createSortHandler: (property: string) => (event: MouseEvent<unknown>) => void;
  rows: DatabaseRow[];
}

export const DatabaseTable = ({
  order,
  orderBy,
  createSortHandler,
  rows,
}: DatabaseTableProps) => {
  const { t } = useTranslation();
  const screen = useScreenSize();
  const { mode } = useThemeContext();

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} stickyHeader size="small">
        <TableHead
          sx={{
            "& > tr > th": {
              backgroundColor: (theme) =>
                mode === "dark"
                  ? theme.palette.grey.A700
                  : theme.palette.grey.A200,
            },
          }}
        >
          <TableRow>
            <TableCell />
            <TableCell>
              <TableSortLabel
                active={orderBy === "name"}
                direction={orderBy === "name" ? order : "asc"}
                onClick={createSortHandler("name")}
              >
                {t("Name")}
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "profile_origin"}
                direction={orderBy === "profile_origin" ? order : "asc"}
                onClick={createSortHandler("profile_origin")}
              >
                {t("Origin")}
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">{t("Card")}</TableCell>
            {screen.isDesktop && (
              <>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === "Mv"}
                    direction={orderBy === "Mv" ? order : "asc"}
                    onClick={createSortHandler("Mv")}
                  >
                    <StatLabel stat="MoveOrRange" />
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === "profile.Fv"}
                    direction={orderBy === "profile.Fv" ? order : "asc"}
                    onClick={createSortHandler("profile.Fv")}
                  >
                    <StatLabel stat="Fv" />
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === "profile.Sv"}
                    direction={orderBy === "profile.Sv" ? order : "asc"}
                    onClick={createSortHandler("profile.Sv")}
                  >
                    <StatLabel stat="Sv" />
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === "profile.S"}
                    direction={orderBy === "profile.S" ? order : "asc"}
                    onClick={createSortHandler("profile.S")}
                  >
                    <StatLabel stat="S" />
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === "profile.D"}
                    direction={orderBy === "profile.D" ? order : "asc"}
                    onClick={createSortHandler("profile.D")}
                  >
                    <StatLabel stat="D" />
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === "profile.A"}
                    direction={orderBy === "profile.A" ? order : "asc"}
                    onClick={createSortHandler("profile.A")}
                  >
                    <StatLabel stat="A" />
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === "profile.W"}
                    direction={orderBy === "profile.W" ? order : "asc"}
                    onClick={createSortHandler("profile.W")}
                  >
                    <StatLabel stat="W" />
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === "profile.C"}
                    direction={orderBy === "profile.C" ? order : "asc"}
                    onClick={createSortHandler("profile.C")}
                  >
                    <StatLabel stat="C" />
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === "profile.I"}
                    direction={orderBy === "profile.I" ? order : "asc"}
                    onClick={createSortHandler("profile.I")}
                  >
                    <StatLabel stat="I" />
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === "M"}
                    direction={orderBy === "M" ? order : "asc"}
                    onClick={createSortHandler("M")}
                  >
                    <StatLabel stat="HM" />
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === "W"}
                    direction={orderBy === "W" ? order : "asc"}
                    onClick={createSortHandler("W")}
                  >
                    <StatLabel stat="HW" />
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === "F"}
                    direction={orderBy === "F" ? order : "asc"}
                    onClick={createSortHandler("F")}
                  >
                    <StatLabel stat="HF" />
                  </TableSortLabel>
                </TableCell>
              </>
            )}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <DatabaseTableRow
              key={`${row.name}-${row.profile_origin}`}
              row={row}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
