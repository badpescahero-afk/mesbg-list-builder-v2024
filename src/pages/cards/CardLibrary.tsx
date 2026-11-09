import {
  Button,
  Container,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { profileData } from "../../assets/data";
import { cardName } from "../../components/common/configured-cards/card-names";
import { ModalTypes } from "../../components/modal/modals";
import { useTranslation } from "../../i18n/LanguageContext";
import { useAppState } from "../../state/app";

const entries = Object.entries(profileData).flatMap(([origin, profiles]) =>
  Object.keys(profiles).map((name) => ({ origin, name })),
);

export function CardLibrary() {
  const { t, language } = useTranslation();
  const { setCurrentModal } = useAppState();
  const [query, setQuery] = useState("");
  const [origin, setOrigin] = useState("");
  const filtered = useMemo(
    () =>
      entries.filter(
        (entry) =>
          (!origin || entry.origin === origin) &&
          `${entry.name} ${cardName(entry.name)} ${entry.origin}`
            .toLocaleLowerCase()
            .includes(query.trim().toLocaleLowerCase()),
      ),
    [query, origin],
  );
  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h4" component="h1">
        {t("Card library")}
      </Typography>
      <Typography sx={{ my: 2 }}>
        {t(
          "Browse every profile, including mounts, passengers and siege equipment. Add models to a roster to export cards with the chosen equipment and points.",
        )}
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} gap={2} sx={{ mb: 2 }}>
        <TextField
          label={t("Search...")}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          fullWidth
        />
        <TextField
          select
          label={t("Profile origin")}
          value={origin}
          onChange={(event) => setOrigin(event.target.value)}
          sx={{ minWidth: 230 }}
        >
          <MenuItem value="">{t("All")}</MenuItem>
          {Object.keys(profileData).map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <Typography role="status">
        {filtered.length} {t("profiles")}
      </Typography>
      <Stack component="ul" gap={1} sx={{ p: 0, listStyle: "none" }}>
        {filtered.map(({ origin, name }) => (
          <li key={`${origin}:${name}`}>
            <Button
              fullWidth
              variant="outlined"
              sx={{ justifyContent: "flex-start", textAlign: "left" }}
              onClick={() =>
                setCurrentModal(ModalTypes.PROFILE_CARD, {
                  unit: { name, profile_origin: origin },
                  title: language === "es" ? cardName(name) : name,
                })
              }
            >
              <span>
                {language === "es" ? cardName(name) : name}
                <Typography component="span" variant="caption" display="block">
                  {name} · {origin}
                </Typography>
              </span>
            </Button>
          </li>
        ))}
      </Stack>
    </Container>
  );
}
