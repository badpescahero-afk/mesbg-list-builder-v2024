import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Profile } from "../../../../hooks/profiles/profile-utils/profile.type.ts";
import { GameText } from "../../../../i18n/GameText";
import { StatLabel } from "../../../../i18n/StatLabel";

export const Stats = ({ profile }: { profile: Profile }) => {
  const skippedParentRow = [
    "Vault Warden Team",
    "Uruk-Hai Demolition Team",
    "Bard's Family",
  ].includes(profile.name);
  return (
    <TableContainer component="div" sx={{ mb: 2 }}>
      <Table
        size="small"
        sx={{ "& th, & td": { px: { xs: 0.5, sm: 2 }, textAlign: "center" } }}
      >
        <TableHead>
          <TableRow>
            {profile.additional_stats && <TableCell />}
            <TableCell>
              <StatLabel stat="Mv" />
            </TableCell>
            <TableCell>
              <StatLabel stat="Fv" />
            </TableCell>
            <TableCell>
              <StatLabel stat="Sv" />
            </TableCell>
            <TableCell>
              <StatLabel stat="S" />
            </TableCell>
            <TableCell>
              <StatLabel stat="D" />
            </TableCell>
            <TableCell>
              <StatLabel stat="A" />
            </TableCell>
            <TableCell>
              <StatLabel stat="W" />
            </TableCell>
            <TableCell>
              <StatLabel stat="C" />
            </TableCell>
            <TableCell>
              <StatLabel stat="I" />
            </TableCell>
            {(profile.HM || profile.HW || profile.HF) && (
              <>
                <TableCell>
                  <StatLabel stat="HM" />
                </TableCell>
                <TableCell>
                  <StatLabel stat="HW" />
                </TableCell>
                <TableCell>
                  <StatLabel stat="HF" />
                </TableCell>
              </>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {!skippedParentRow && (
            <TableRow>
              {profile.additional_stats && (
                <TableCell>
                  <GameText text={profile.name} />
                </TableCell>
              )}
              <TableCell>{profile.Mv}</TableCell>
              <TableCell>{profile.Fv}</TableCell>
              <TableCell>{profile.Sv}</TableCell>
              <TableCell>{profile.S}</TableCell>
              <TableCell>{profile.D}</TableCell>
              <TableCell>{profile.A}</TableCell>
              <TableCell>{profile.W}</TableCell>
              <TableCell>{profile.C}</TableCell>
              <TableCell>{profile.I}</TableCell>
              {(profile.HM || profile.HW || profile.HF) && (
                <>
                  <TableCell>{profile.HM ?? "-"}</TableCell>
                  <TableCell>{profile.HW ?? "-"}</TableCell>
                  <TableCell>{profile.HF ?? "-"}</TableCell>
                </>
              )}
            </TableRow>
          )}
          {profile.additional_stats?.map((stats, index) => (
            <TableRow key={index}>
              <TableCell>
                <GameText text={stats.name} />
              </TableCell>
              <TableCell>{stats.Mv}</TableCell>
              <TableCell>{stats.Fv}</TableCell>
              <TableCell>{stats.Sv}</TableCell>
              <TableCell>{stats.S}</TableCell>
              <TableCell>{stats.D}</TableCell>
              <TableCell>{stats.A}</TableCell>
              <TableCell>{stats.W}</TableCell>
              <TableCell>{stats.C}</TableCell>
              <TableCell>{stats.I}</TableCell>
              {(stats.HM ||
                stats.HW ||
                stats.HF ||
                profile.HM ||
                profile.HW ||
                profile.HF) && (
                <>
                  <TableCell>{stats.HM ?? "-"}</TableCell>
                  <TableCell>{stats.HW ?? "-"}</TableCell>
                  <TableCell>{stats.HF ?? "-"}</TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
