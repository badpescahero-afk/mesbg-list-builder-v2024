import { AlertTitle } from "@mui/material";
import Alert, { AlertProps } from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { FunctionComponent, PropsWithChildren } from "react";
import { TranslatedText } from "../../../i18n/TranslatedText";
import { useThemeContext } from "../../../theme/ThemeContext.tsx";

export type CustomAlertProps = {
  title: string;
  severity: AlertProps["severity"];
  onClose?: AlertProps["onClose"];
};

export const CustomAlert: FunctionComponent<
  PropsWithChildren<CustomAlertProps>
> = ({ title, severity, onClose, children }) => {
  const { mode } = useThemeContext();
  return (
    <Alert
      severity={severity}
      variant={mode === "dark" ? "outlined" : "standard"}
      onClose={onClose}
      icon={false}
    >
      {title && (
        <AlertTitle>
          <Typography fontWeight="bold" component="div">
            <TranslatedText message={title} />
          </Typography>
        </AlertTitle>
      )}
      {children}
    </Alert>
  );
};
