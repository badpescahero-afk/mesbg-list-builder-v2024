import { CheckCircleOutline, InstallMobile } from "@mui/icons-material";
import { Alert, Button, Container, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { LocalSaveNotice } from "../components/common/LocalSaveNotice";
import { useTranslation } from "../i18n/LanguageContext";
import { installApp, useInstallation } from "../pwa/install";

export function InstallApp() {
  const { t } = useTranslation();
  const { available, installed, offlineReady, updateReady } = useInstallation();
  const [failed, setFailed] = useState(false);
  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Stack gap={2} alignItems="flex-start">
        <img
          src="/icons/icon-es-192x192.png"
          width={96}
          height={96}
          alt="MESBG ES"
        />
        <Typography variant="h4" component="h1">
          {t("Install app")}
        </Typography>
        <Typography>
          {t("Keep MESBG ES on your home screen and open it like an app.")}
        </Typography>
        <LocalSaveNotice />
        {installed ? (
          <Alert icon={<CheckCircleOutline />} severity="success">
            {t("The app is installed.")}
          </Alert>
        ) : (
          <>
            {available && (
              <Button
                variant="contained"
                startIcon={<InstallMobile />}
                onClick={async () => {
                  setFailed(false);
                  try {
                    await installApp();
                  } catch {
                    setFailed(true);
                  }
                }}
              >
                {t("Install on this device")}
              </Button>
            )}
            <Typography component="h2" variant="h6">
              Android
            </Typography>
            <Typography>
              {t(
                "Open this site in Chrome. Tap Install on this device, or use the browser menu → Add to home screen → Install.",
              )}
            </Typography>
            <Typography component="h2" variant="h6">
              iPhone / iPad
            </Typography>
            <Typography>
              {t(
                "Open this site in Safari. Tap Share → Add to Home Screen, then confirm Add.",
              )}
            </Typography>
            <Typography>
              {t(
                "If you opened the link inside another app, open it in Chrome or Safari first.",
              )}
            </Typography>
          </>
        )}
        {failed && (
          <Alert severity="info">
            {t("Use the browser menu to add the app to your home screen.")}
          </Alert>
        )}
        <Alert severity={offlineReady ? "success" : "info"}>
          {offlineReady
            ? t(
                "Ready for offline use: your lists, profiles and translated rules are available on this device.",
              )
            : t(
                "Keep the app open with an internet connection until it is ready for offline use.",
              )}
        </Alert>
        <Typography>
          {t(
            "Pictures and original cards are saved as you view them, within a storage limit. Pictures not yet saved need an internet connection.",
          )}
        </Typography>
        <Typography>
          {t(
            "Export your lists as JSON to keep a backup. Clearing browser or app data can remove locally saved lists.",
          )}
        </Typography>
        {updateReady && (
          <Alert severity="info">
            {t(
              "An update is ready. Close all app windows and reopen it to apply the update.",
            )}
          </Alert>
        )}
      </Stack>
    </Container>
  );
}
