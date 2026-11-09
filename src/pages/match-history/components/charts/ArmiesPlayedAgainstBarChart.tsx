import { useTheme } from "@mui/material/styles";
import { Bar } from "react-chartjs-2";
import { useTranslation } from "../../../../i18n/LanguageContext";
import { translateGameText } from "../../../../i18n/game-text";
import { PastGame } from "../../../../state/recent-games/history";

interface ArmiesPlayedProps {
  data: PastGame[];
}

export const ArmiesPlayedAgainstBarChart = ({ data }: ArmiesPlayedProps) => {
  const { t: translateUI, language } = useTranslation();

  const { palette } = useTheme();

  const barColors = [
    palette.success.light,
    palette.warning.light,
    palette.error.light,
  ];

  const armiesPlayed: Record<
    string,
    { won: number; lost: number; draw: number }
  > = data
    .filter((game) => !!game.opponentArmies)
    .flatMap((game) => ({
      armies: game.opponentArmies.split(",").map((a) => a.trim()),
      result: game.result.toLowerCase(),
    }))
    .reduce((acc, { armies, result }) => {
      armies.forEach((army) => {
        if (!acc[army]) {
          acc[army] = { won: 0, lost: 0, draw: 0 };
        }
        acc[army][result]++;
      });
      return acc;
    }, {});

  const victoryPointsData = {
    labels: Object.keys(armiesPlayed).map((army) =>
      translateGameText(language, army),
    ),
    datasets: ["won", "draw", "lost"].map((key, index) => ({
      label: translateUI(key),
      data: Object.values(armiesPlayed).map((wld) => wld[key]),
      yAxisID: "y1",
      backgroundColor: barColors[index],
    })),
  };

  return (
    <Bar
      data={victoryPointsData}
      options={{
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: {
            display: true,
            text: translateUI("Armies Played Against (with WLD)"),
          },
        },
        scales: {
          y1: {
            beginAtZero: true,
            stacked: true,
            ticks: {
              stepSize: 1,
            },
          },
          x: {
            stacked: true,
          },
        },
      }}
    />
  );
};
