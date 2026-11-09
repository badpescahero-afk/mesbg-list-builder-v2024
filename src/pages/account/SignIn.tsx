import {
  Button,
  FormControl,
  FormLabel,
  Link,
  Stack,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import googleIcon from "../../assets/images/google-icon.png";
import { CustomAlert } from "../../components/atoms/alert/CustomAlert.tsx";
import { ModalTypes } from "../../components/modal/modals.tsx";
import { useAuth } from "../../firebase/FirebaseAuthContext.tsx";
import { useTranslation } from "../../i18n/LanguageContext";
import { TranslatedText } from "../../i18n/TranslatedText";
import { useAppState } from "../../state/app";

const errorMap = {
  "auth/invalid-credential":
    "Invalid login details. Check your email and password and try again.",
  "auth/email-already-exists":
    "An account with this email already exists. Sign in or use a different email.",
  "auth/invalid-email":
    "That doesn’t look like a valid email address. Please check and try again.",
  "auth/invalid-password":
    "Your password must be at least 6 characters long and include a mix of letters, numbers, and special characters.",
  "auth/invalid-display-name":
    "You display name cannot be empty. Please provide us with you name",
  "auth/too-many-requests": "",
};

export const SignIn = () => {
  const { t: translateUI } = useTranslation();

  const auth = useAuth();
  const { setCurrentModal } = useAppState();
  const [signInError, setSignInError] = useState(null);
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.user) {
      navigate(`/rosters?asksync=true`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (emailError || passwordError) return;

    const data = new FormData(event.currentTarget);
    auth
      .signIn(data.get("email") as string, data.get("password") as string)
      .then((response) => console.debug(response))
      .catch((error) =>
        setSignInError(
          errorMap[error.code] ??
            "Oops! We encountered an error. Please refresh the page and try again.",
        ),
      );
  };

  const validateInputs = () => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value) {
      setPasswordError(true);
      setPasswordErrorMessage("You must enter a password to sign in.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  return (
    <Container maxWidth="md" sx={{ mt: 2, mb: 5 }}>
      <Typography variant="h4" className="middle-earth">
        <TranslatedText message="Sign In" />
      </Typography>
      <Typography sx={{ mb: 3 }}>
        <TranslatedText message="Sign in with a personal account to easily sync your data between devices." />
      </Typography>

      <Button
        color="inherit"
        variant="outlined"
        fullWidth
        startIcon={
          <img
            src={googleIcon}
            alt={translateUI("google icon")}
            style={{ width: "2.5rem", aspectRatio: "1 / 1" }}
          />
        }
        onClick={auth.signInWithGoogle}
      >
        <TranslatedText message="Sign in With Google" />
      </Button>

      <Divider sx={{ my: 2 }}>
        <Typography variant="h6" className="middle-earth">
          <TranslatedText message="or use" />
        </Typography>
      </Divider>

      {signInError && (
        <Box sx={{ my: 2 }}>
          <CustomAlert
            title={translateUI("Authentication error")}
            severity="error"
          >
            {translateUI(signInError)}
          </CustomAlert>
        </Box>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: 2,
        }}
      >
        <FormControl>
          <FormLabel htmlFor="email">
            <TranslatedText message="Email" />
          </FormLabel>
          <TextField
            error={emailError}
            helperText={translateUI(emailErrorMessage)}
            id="email"
            type="email"
            name="email"
            placeholder={translateUI("your@email.com")}
            autoComplete="email"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={emailError ? "error" : "primary"}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">
            <TranslatedText message="Password" />
          </FormLabel>
          <TextField
            error={passwordError}
            helperText={translateUI(passwordErrorMessage)}
            name="password"
            placeholder="••••••"
            type="password"
            id="password"
            autoComplete="current-password"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={passwordError ? "error" : "primary"}
          />
        </FormControl>
        <Link
          component="button"
          type="button"
          onClick={() =>
            setCurrentModal(ModalTypes.RESET_PASSWORD, {
              email:
                (document.getElementById("email") as HTMLInputElement)?.value ??
                "",
            })
          }
          variant="body2"
          sx={{ textAlign: "right" }}
        >
          <TranslatedText message="Forgot your password?" />
        </Link>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          onClick={validateInputs}
        >
          <TranslatedText message="Sign in" />
        </Button>
        <Stack
          direction="row"
          gap={2}
          justifyContent="center"
          alignItems="center"
        >
          <Typography>
            <TranslatedText message={"Don't have an account?"} />
          </Typography>
          <Button
            onClick={() =>
              navigate("/sign-up", { state: { allowNavigation: true } })
            }
          >
            <TranslatedText message="Sign up" />
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};
