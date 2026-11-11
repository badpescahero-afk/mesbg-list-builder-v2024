import { charts } from "../../../constants/charts";
import { useTranslation } from "../../../i18n/LanguageContext";
import content from "../../../i18n/content/charts.es.json";
import "./reference-charts.css";

type Cell = string | { title: string; text: string };
type Chart = { columns: string[]; rows: Cell[][] };
const spanishCharts: Record<string, Chart> = content;

export function SpanishReferenceChart({ chartId }: { chartId: string }) {
  const { t } = useTranslation();
  const chart = spanishCharts[chartId];
  if (!chart) return null;
  const diceTable = chart.columns[0] === "D6";
  return (
    <section
      className="reference-chart"
      data-reference-chart={chartId}
      lang="es"
    >
      <table
        className={
          diceTable ? "reference-chart-dice" : "reference-chart-values"
        }
      >
        <caption>{t(charts[chartId])}</caption>
        <thead>
          <tr>
            {chart.columns.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {chart.rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, column) => {
                const text =
                  typeof cell === "string" ? (
                    cell
                  ) : (
                    <>
                      <strong>{cell.title}:</strong> {cell.text}
                    </>
                  );
                return column === 0 ? (
                  <th key={column} scope="row">
                    {text}
                  </th>
                ) : (
                  <td key={column}>{text}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
