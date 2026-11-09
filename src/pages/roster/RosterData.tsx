import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useEffect, useRef } from "react";
import {
  drawerWidth,
  RosterInfoDrawer,
} from "../../components/common/roster-info/RosterInfoDrawer.tsx";
import { MobileRosterInfoToolbar } from "../../components/common/toolbar/MobileRosterInfoToolbar.tsx";
import { MobileRosterWarningsToolbar } from "../../components/common/toolbar/MobileRosterWarningsToolbar.tsx";
import { WarbandList } from "../../components/common/warbands/WarbandList.tsx";
import { useRosterWarnings } from "../../hooks/calculations-and-displays/useRosterWarnings.ts";
import { useScreenSize } from "../../hooks/calculations-and-displays/useScreenSize.ts";
import { useRosterSync } from "../../hooks/cloud-sync/RosterCloudSyncProvider.tsx";
import { LockContextProvider } from "../../hooks/lock/LockContext.tsx";
import { useUserPreferences } from "../../state/preference";
import { Roster } from "../../types/roster.ts";
import { RosterBreadcrumbs } from "./RosterBreadcrumbs.tsx";
import { RosterFloatingButton } from "./RosterFloatingButton.tsx";
import { RosterLockButton } from "./RosterLockButton.tsx";
import { RosterSidebarButton } from "./RosterSidebarButton.tsx";
import { StartGameButton } from "./StartGameButton.tsx";

export const RosterData = ({ roster }: { roster: Roster }) => {
  const prevRoster = useRef<typeof roster>();
  const firstRenderRef = useRef(true);

  const warnings = useRosterWarnings();
  const screen = useScreenSize();
  const { sync } = useRosterSync();
  const displayMobileToolbar = useUserPreferences(
    ({ preferences }) => preferences.mobileRosterToolbar,
  );
  useEffect(() => {
    if (!roster) return;

    if (
      prevRoster.current !== undefined &&
      roster !== prevRoster.current &&
      !firstRenderRef.current
    ) {
      sync(roster);
    }

    prevRoster.current = roster;
    firstRenderRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roster]);

  return (
    <>
      <Stack
        sx={{
          position: "sticky",
          top: { xs: 56, sm: 64 },
          "@media (max-width: 599.95px) and (orientation: landscape)": {
            top: 48,
          },
          zIndex: "100",
        }}
      >
        {displayMobileToolbar && <MobileRosterInfoToolbar />}
        {warnings.length > 0 && <MobileRosterWarningsToolbar />}
      </Stack>
      <Container
        maxWidth={false}
        sx={{
          p: { xs: 1, sm: 2 },
        }}
      >
        <LockContextProvider settingsKey="dragAndDropRosters">
          <Box
            sx={{
              width: screen.isDesktop
                ? `calc(100% - ${drawerWidth}ch)`
                : "100%",
            }}
          >
            <Stack direction="column" sx={{ mb: 2 }}>
              <RosterBreadcrumbs roster={roster} />
              <Stack
                gap={1}
                direction="row"
                justifyContent="end"
                flexWrap="wrap"
              >
                <StartGameButton roster={roster} />
                <RosterLockButton />
                <RosterSidebarButton />
              </Stack>
            </Stack>
            <WarbandList warbands={roster.warbands} />
          </Box>
        </LockContextProvider>
        <RosterInfoDrawer roster={roster} editable={true} />
        <RosterFloatingButton roster={roster} />
      </Container>
    </>
  );
};
