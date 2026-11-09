import {
  AutoAwesome,
  CategoryOutlined,
  Info,
  InstallMobile,
  Segment,
  Settings,
} from "@mui/icons-material";
import BugReportIcon from "@mui/icons-material/BugReport";
import { AiFillTrophy } from "react-icons/ai";
import { FaDatabase } from "react-icons/fa";
import { GiSwordsEmblem } from "react-icons/gi";
import { HiIdentification } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { DrawerTypes } from "../../../components/drawer/drawers.tsx";
import { ADAPTATION_ISSUES } from "../../../project-links";
import { useAppState } from "../../../state/app";
import { useChartMenuItems } from "./useChartMenuItems.tsx";
import { useRosterMenuItems } from "./useRosterMenuItems.tsx";

export const useMenuItems = () => {
  const navigate = useNavigate();
  const openSidebar = useAppState((state) => state.openSidebar);
  const rosterMenuItems = useRosterMenuItems();
  const chartMenuItems = useChartMenuItems();

  return [
    {
      icon: <Segment />,
      label: "My Rosters",
      translateLabel: true,
      action: () => navigate("/rosters"),
      active: location.pathname === "/rosters",
      children: rosterMenuItems,
      showCaret: false,
    },
    {
      icon: <InstallMobile />,
      label: "Install app",
      translateLabel: true,
      action: () => navigate("/install"),
      active: location.pathname === "/install",
    },
    { divider: true },
    {
      icon: <AiFillTrophy style={{ fontSize: "1.5rem" }} />,
      label: "Match History",
      translateLabel: true,
      action: () => navigate("/match-history"),
      active: location.pathname === "/match-history",
    },
    {
      icon: <CategoryOutlined />,
      label: "My Collection",
      translateLabel: true,
      action: () => navigate("/collection"),
      active: location.pathname === "/collection",
    },
    {
      icon: <FaDatabase style={{ fontSize: "1.25rem", margin: "0 auto" }} />,
      label: "Profile Database",
      translateLabel: true,
      action: () => navigate("/database"),
      active: location.pathname === "/database",
    },
    {
      icon: <HiIdentification />,
      label: "Card library",
      translateLabel: true,
      action: () => navigate("/cards"),
      active: location.pathname === "/cards",
    },
    { divider: true },
    {
      icon: <HiIdentification style={{ fontSize: "1.5rem" }} />,
      label: "Profiles",
      translateLabel: true,
      action: () => openSidebar(DrawerTypes.PROFILE_SEARCH),
      active: false,
    },
    {
      icon: <AutoAwesome />,
      label: "Special rules & Magic",
      translateLabel: true,
      action: () => openSidebar(DrawerTypes.KEYWORD_SEARCH),
      active: false,
    },
    {
      icon: <GiSwordsEmblem style={{ fontSize: "1.5rem" }} />,
      label: "Charts",
      translateLabel: true,
      action: () => {},
      active: false,
      children: chartMenuItems,
      showCaret: true,
    },
    { divider: true },
    {
      icon: <Info />,
      label: "Credits and legal notices",
      translateLabel: true,
      action: () => navigate("/about"),
      active: location.pathname === "/about",
    },
    {
      icon: <BugReportIcon />,
      label: "Report a Bug / Correction",
      translateLabel: true,
      action: () =>
        window.open(ADAPTATION_ISSUES, "_blank", "noopener,noreferrer"),
      active: false,
    },
    {
      icon: <Settings />,
      label: "App Settings",
      translateLabel: true,
      action: () => navigate("/settings"),
      active: location.pathname === "/settings",
    },
  ];
};
