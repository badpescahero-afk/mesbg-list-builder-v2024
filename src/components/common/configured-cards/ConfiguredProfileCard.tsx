import { keywords } from "../../../assets/data.ts";
import fallbackLogo from "../../../assets/images/default.png";
import { Profile } from "../../../hooks/profiles/profile-utils/profile.type.ts";
import { translateGameText } from "../../../i18n/game-text";
import { ConfiguredCard, STAT_KEYS } from "./card-model";
import { cardName } from "./card-names";
import "./configured-cards.css";

const approvedRuleNames: Record<string, string> = {
  "Heroic Strength": "Fuerza heroica",
  "Leader (Citadel Guard)": "Líder (Guardia de la Ciudadela)",
};
const gameText = (text: string) =>
  approvedRuleNames[text] || translateGameText("es", text);
const typeNames: Record<string, string> = {
  "Hero of Legend": "Héroe de Leyenda",
  "Hero of Valour": "Héroe de Valor",
  "Hero of Fortitude": "Héroe de Fortaleza",
  "Minor Hero": "Héroe menor",
  "Independent Hero": "Héroe independiente",
  Warrior: "Guerrero",
  "Siege Engine": "Máquina de asedio",
};

function StatLine({ profile }: { profile: Profile }) {
  const heroic = [profile.HM, profile.HW, profile.HF].some(
    (value) => value != null && value !== "-",
  );
  return (
    <table className="configured-card-stats">
      <thead>
        <tr>
          {STAT_KEYS.map((key) => (
            <th key={key}>{key === "Mv" && profile.Range ? "Range" : key}</th>
          ))}
          {heroic && ["M", "W", "F"].map((key) => <th key={key}>{key}</th>)}
        </tr>
      </thead>
      <tbody>
        <tr>
          {STAT_KEYS.map((key) => (
            <td key={key} data-stat={key}>
              {key === "Mv" && profile.Range ? profile.Range : profile[key]}
            </td>
          ))}
          {heroic &&
            [profile.HM, profile.HW, profile.HF].map((value, index) => (
              <td key={index}>
                <span className="configured-card-resource">{value}</span>
              </td>
            ))}
        </tr>
      </tbody>
    </table>
  );
}

function ProfileRules({ profile }: { profile: Profile }) {
  const rules = profile.active_or_passive_rules || [];
  return (
    <>
      {!!profile.wargear?.length && (
        <section>
          <h3>Equipamiento base</h3>
          <p>{profile.wargear.map(gameText).join(", ")}.</p>
        </section>
      )}
      {!!profile.additional_text?.length &&
        profile.additional_text.map((text, index) => (
          <p className="configured-card-note" key={index}>
            {gameText(text)}
          </p>
        ))}
      {(rules.length > 0 || profile.special_rules?.length > 0) && (
        <section>
          <h3>Reglas especiales</h3>
          {!!profile.special_rules?.length && (
            <p>
              <b>{profile.special_rules.map(gameText).join(", ")}</b>
            </p>
          )}
          {rules.map((rule, index) => (
            <div className="configured-card-rule" key={index}>
              <h4>
                {gameText(rule.name)} —{" "}
                {rule.type === "Active" ? "Activa" : "Pasiva"}
              </h4>
              <p
                dangerouslySetInnerHTML={{
                  __html: gameText(rule.description).replaceAll("\n", "<br />"),
                }}
              />
            </div>
          ))}
        </section>
      )}
      {!!profile.magic_powers?.length && (
        <section>
          <h3>Poderes mágicos</h3>
          <table className="configured-card-powers">
            <thead>
              <tr>
                <th>Poder</th>
                <th>Range</th>
                <th>Lanzamiento</th>
              </tr>
            </thead>
            <tbody>
              {profile.magic_powers.map((power, index) => (
                <tr key={index}>
                  <td>{gameText(power.name)}</td>
                  <td>{power.range}</td>
                  <td>{power.cast}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {profile.magic_powers.map((power, index) => {
            const rule = keywords.find(
              (keyword) =>
                keyword.name === power.name.replace(/\(.*?\)/g, "(X)"),
            );
            return rule ? (
              <div className="configured-card-rule" key={index}>
                <h4>{gameText(power.name)}</h4>
                <p
                  dangerouslySetInnerHTML={{
                    __html: gameText(rule.description).replaceAll(
                      "\n",
                      "<br />",
                    ),
                  }}
                />
              </div>
            ) : null;
          })}
        </section>
      )}
    </>
  );
}

function AdditionalProfile({ profile }: { profile: Profile }) {
  return (
    <section className="configured-card-additional">
      <h3>{cardName(gameText(profile.name))}</h3>
      <StatLine profile={profile} />
      <ProfileRules profile={profile} />
      {profile.additional_stats?.map((extra, index) => (
        <AdditionalProfile profile={extra} key={index} />
      ))}
    </section>
  );
}

/** A real text layout, so equipment/stats come from data rather than a JPG. */
export function ConfiguredProfileCard({ card }: { card: ConfiguredCard }) {
  const primary = card.profiles[0];
  const image = encodeURI(
    `${RESOURCES_URL}/images/profiles/${card.origin}/pictures/${card.name}.png`,
  );
  return (
    <div className="configured-card-shell">
      <article
        className="configured-profile-card"
        data-configured-card
        data-model-id={card.modelId}
      >
        <header className="configured-card-header">
          <div>
            <h1>
              {cardName(card.name)}{" "}
              <span className="configured-card-cost" data-card-points>
                {card.points} pts
              </span>
            </h1>
            <p className="configured-card-subtitle">
              {card.origin} |{" "}
              {typeNames[primary.type] || primary.type || "Perfil"} |{" "}
              {card.quantity} en la lista
            </p>
            <StatLine profile={primary} />
          </div>
          <img
            className="configured-card-portrait"
            src={image}
            alt={cardName(card.name)}
            onError={(event) => {
              if (event.currentTarget.getAttribute("src") !== fallbackLogo)
                event.currentTarget.src = fallbackLogo;
            }}
          />
        </header>
        <div className="configured-card-upper">
          <section>
            <h3>Opciones aplicadas</h3>
            {card.options.length ? (
              <ul className="configured-card-options">
                {card.options.map((option) => (
                  <li key={option.id}>
                    <span>
                      {option.quantity > 1 ? `${option.quantity} × ` : ""}
                      {gameText(option.name)}
                    </span>
                    <span>
                      {option.points === 0
                        ? "Incluida / gratis"
                        : `${option.points * option.quantity} pts`}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Sin opciones adicionales.</p>
            )}
            <p className="configured-card-note">
              Las opciones se aplican al equipo base, incluidos los cambios de
              equipo indicados.
            </p>
          </section>
          {!!primary.heroic_actions?.length && (
            <section>
              <h3>Acciones heroicas</h3>
              <ul>
                {primary.heroic_actions.map((action) => (
                  <li key={action}>{gameText(action)}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <ProfileRules profile={primary} />
        <div className="configured-card-extras">
          {[...(primary.additional_stats || []), ...card.profiles.slice(1)].map(
            (profile, index) => (
              <AdditionalProfile key={index} profile={profile} />
            ),
          )}
        </div>
        <footer>
          MESBG 2024 · Carta en español · Equipo elegido · Coste por miniatura
        </footer>
      </article>
    </div>
  );
}
