import type { Ref } from "react";
import { portfolio } from "./portfolio";
import type { Collection } from "./portfolio";
import "./work-browser.css";

type Props = {
  collection: Collection;
  selectedId: string;
  headingRef: Ref<HTMLHeadingElement>;
  onCollectionChange: (collection: Collection) => void;
  onSelect: (id: string) => void;
  onBack: () => void;
};

const mergeDate = new Intl.DateTimeFormat("en-US", {
  month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
});

export function WorkBrowser({ collection, selectedId, headingRef, onCollectionChange, onSelect, onBack }: Props) {
  const entries = portfolio[collection];
  const selected = entries.find((entry) => entry.id === selectedId) ?? entries[0];

  return (
    <main className="project-screen">
      <h1 ref={headingRef} tabIndex={-1}>
        {collection === "projects" ? "Select project" : "Select contribution"}
      </h1>
      <div className="button-row collection-controls" role="group" aria-label="Work collections">
        <button className="mc-button" aria-pressed={collection === "projects"} onClick={() => onCollectionChange("projects")}>
          Projects
        </button>
        <button className="mc-button" aria-pressed={collection === "contributions"} onClick={() => onCollectionChange("contributions")}>
          Open source
        </button>
      </div>

      <div className="work-layout">
        <fieldset className="worlds">
          <legend className="sr-only">{collection === "projects" ? "Projects" : "Contributions"}</legend>
          {entries.map((entry) => (
            <label className="world" data-selected={selected.id === entry.id} key={entry.id}>
              <input
                className="sr-only"
                type="radio"
                name="work-selection"
                value={entry.id}
                checked={selected.id === entry.id}
                aria-controls="work-details"
                aria-label={entry.kind === "contribution" ? `${entry.name} #${entry.pullRequest}` : entry.name}
                onChange={() => onSelect(entry.id)}
              />
              <img src={`/minecraft/textures/items/${entry.icon}.png`} alt="" width="48" height="48" />
              <span className="world-copy">
                <span className="world-name">{entry.name}</span>
                <span>{entry.summary}</span>
                <span className="world-meta">
                  {entry.kind === "contribution" ? `#${entry.pullRequest} / Merged` : entry.technologies.slice(0, 2).join(" / ")}
                </span>
              </span>
            </label>
          ))}
        </fieldset>

        <section className="work-details" id="work-details" aria-labelledby="work-title">
          <div className="work-kind">
            {selected.kind === "contribution" ? `Pull request #${selected.pullRequest}` : "Personal project"}
          </div>
          <h2 id="work-title">{selected.name}</h2>
          <p>{selected.description}</p>
          <ul className="work-highlights">
            {selected.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
          </ul>
          <p className="work-stack">{selected.technologies.join(" / ")}</p>
          {selected.kind === "contribution" && (
            <p className="merge-date">
              Merged <time dateTime={selected.mergedOn}>{mergeDate.format(new Date(`${selected.mergedOn}T00:00:00Z`))}</time>
            </p>
          )}
          <a className="mc-button" href={selected.url} target="_blank" rel="noreferrer">
            {selected.kind === "contribution" ? "View pull request" : "Open on GitHub"}
          </a>
        </section>
      </div>

      <button className="mc-button browser-back" onClick={onBack}>Back</button>
    </main>
  );
}
