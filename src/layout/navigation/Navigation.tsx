import { ChevronLeftOutlined } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import title from "../../assets/images/title-v2024.png";
import { AccountAvatar } from "../../components/common/user-avatar/AccountAvatar.tsx";
import { OpenNavigationDrawerEvent } from "../../events/OpenNavigationDrawerEvent.ts";
import { useScreenSize } from "../../hooks/calculations-and-displays/useScreenSize.ts";
import { useTranslation } from "../../i18n/LanguageContext";
import { LanguageSelector } from "../../i18n/LanguageSelector";
import { AppBar } from "./AppBar.tsx";
import { MenuDrawer } from "./MenuDrawer.tsx";
import { MenuDrawerHeader } from "./MenuDrawerHeader.tsx";
import { NavigationMenu } from "./menu/NavigationMenu.tsx";

export const drawerWidth = 320;

const baseMenuIconStyles = {
  fontSize: "2rem",
  position: "absolute",
  transition: "opacity 0.3s ease, transform 0.3s ease",
};

export const Navigation: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const { t: translateUI } = useTranslation();

  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { isMobile } = useScreenSize();
  const { pathname } = useLocation();

  const closeMenuDrawer = () => {
    setOpen(false);
    window.dispatchEvent(new OpenNavigationDrawerEvent(false));
  };

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
      window.dispatchEvent(new OpenNavigationDrawerEvent(false));
    }
  }, [pathname, isMobile]);

  const toggleMenuDrawer = () => {
    setOpen(!open);
    window.dispatchEvent(new OpenNavigationDrawerEvent(!open));
  };

  useEffect(() => {
    function openMenuDrawer() {
      setOpen(true);
      window.dispatchEvent(new OpenNavigationDrawerEvent(true));
    }

    window.addEventListener(
      "mlb-event--open-navigation-drawer",
      openMenuDrawer,
    );
    return () =>
      window.removeEventListener(
        "mlb-event--open-navigation-drawer",
        openMenuDrawer,
      );
  }, []);

  return (
    <Stack direction="row">
      <AppBar
        position="fixed"
        sx={{ backgroundColor: "#1c1c1e" }}
        open={open && !isMobile}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label={translateUI("open drawer")}
            onClick={toggleMenuDrawer}
            edge="start"
            sx={{
              marginRight: { xs: 1, sm: 5 },
              position: "relative",
              width: "2rem",
            }}
          >
            <MenuIcon
              sx={{
                ...baseMenuIconStyles,
                opacity: open ? 0 : 1,
                transform: open ? "rotate(-180deg)" : "rotate(0deg)",
              }}
            />
            <ChevronLeftOutlined
              sx={{
                ...baseMenuIconStyles,
                opacity: open ? 1 : 0,
                transform: open ? "rotate(0deg)" : "rotate(180deg)",
              }}
            />
          </IconButton>
          {/* Logo */}
          <Button
            aria-label={translateUI("logo")}
            sx={{ mr: { xs: 0.5, sm: 2 }, minWidth: 0 }}
            href={window.location.protocol + "//" + window.location.host}
          >
            <Box
              component="img"
              src={logo}
              alt={translateUI("Logo")}
              sx={{ height: { xs: 36, sm: 50 } }}
            />
            <Box
              component="img"
              src={title}
              alt="MESBG List Builder"
              sx={{
                display: { xs: "none", sm: "block" },
                maxHeight: "42px",
                margin: "0 .25rem",
              }}
            />
          </Button>
          <Box flexGrow={1} />
          <Box
            sx={{
              "& .MuiInputBase-root, & .MuiInputLabel-root, & .MuiSvgIcon-root":
                { color: "#fff" },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#888" },
            }}
          >
            <LanguageSelector />
          </Box>
          <AccountAvatar />
        </Toolbar>
      </AppBar>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={open}
          onClose={closeMenuDrawer}
          id="navigation-drawer"
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              maxWidth: "calc(100% - 32px)",
            },
          }}
        >
          <MenuDrawerHeader>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {t("Menu")}
            </Typography>
            <IconButton onClick={closeMenuDrawer} aria-label={t("Close")}>
              <ChevronLeftOutlined />
            </IconButton>
          </MenuDrawerHeader>
          <Divider />
          <NavigationMenu open={true} />
        </Drawer>
      ) : (
        <MenuDrawer variant="permanent" open={open} id="navigation-drawer">
          <MenuDrawerHeader>
            <Typography
              variant="h6"
              className="middle-earth"
              sx={{ textAlign: "start" }}
            >
              {t("Menu")}
            </Typography>
          </MenuDrawerHeader>
          <Divider />
          <NavigationMenu open={open} />
        </MenuDrawer>
      )}
      <Box sx={{ flex: "1 1 0", minWidth: 0 }}>
        <MenuDrawerHeader />
        {children}
      </Box>
    </Stack>
  );
};
