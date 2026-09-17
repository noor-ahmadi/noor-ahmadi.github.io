import { StrictMode, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const projects = [
  {
    name: "Earthquake Monitor",
    description: "Earthquake dashboard using USGS data.",
    stack: "Spring Boot / PostgreSQL / TypeScript",
    url: "https://github.com/noor-ahmadi/earthquake-monitor",
    icon: "compass_16",
  },
  {
    name: "Capitol Trade Watch",
    description: "Alerts for congressional trade disclosures.",
    stack: "Python",
    url: "https://github.com/noor-ahmadi/capitol-trade-watch",
    icon: "paper",
  },
];

function App() {
  const [screen, setScreen] = useState<"menu" | "projects">("menu");
  const [selected, setSelected] = useState(0);
  const [sounds, setSounds] = useState(true);
  const [music, setMusic] = useState(false);
  const [musicError, setMusicError] = useState(false);
  const clickAudio = useRef<HTMLAudioElement>(null);
  const musicAudio = useRef<HTMLAudioElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    heading.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setScreen("menu");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [screen]);

  useEffect(() => {
    const audio = musicAudio.current;
    if (!audio) return;
    let active = true;
    audio.volume = 0.15;
    if (music) {
      setMusicError(false);
      void audio.play().catch(() => {
        if (active) {
          setMusic(false);
          setMusicError(true);
        }
      });
    } else {
      audio.pause();
    }
    return () => { active = false; };
  }, [music]);

  function playClick() {
    const audio = clickAudio.current;
    if (!sounds || !audio) return;
    audio.volume = 0.3;
    audio.currentTime = 0;
    void audio.play().catch(() => {});
  }

  return (
    <div className={`game ${screen}`} onClickCapture={(event) => {
      if (event.target instanceof Element && event.target.closest("button, a")) {
        playClick();
      }
    }}>
      <audio ref={clickAudio} src="/minecraft/sounds/random/click.ogg" preload="auto" />
      <audio ref={musicAudio} src="/minecraft/sounds/music/menu/menu1.ogg" preload="none" loop />

      {screen === "menu" ? (
        <main className="title-screen">
          <header className="title">
            <h1 ref={heading} tabIndex={-1}>NOOR AHMADI</h1>
            <p className="edition">PORTFOLIO</p>
            <span className="splash" aria-hidden="true">Hello, world!</span>
          </header>
          <nav className="menu-controls" aria-label="Main menu">
            <button className="mc-button" onClick={() => setScreen("projects")}>Play</button>
            <a className="mc-button" href="https://github.com/noor-ahmadi" target="_blank" rel="noreferrer">GitHub</a>
            <div className="button-row sound-controls">
              <button className="mc-button" aria-pressed={sounds} onClick={() => setSounds(!sounds)}>
                Sounds: {sounds ? "ON" : "OFF"}
              </button>
              <button className="mc-button" aria-pressed={music} onClick={() => setMusic(!music)}>
                Music: {music ? "ON" : "OFF"}
              </button>
            </div>
            {musicError && <p className="audio-error" role="status">Music could not play. Try again.</p>}
          </nav>
        </main>
      ) : (
        <main className="project-screen">
          <h1 ref={heading} tabIndex={-1}>Select project</h1>
          <ul className="worlds" aria-label="Projects">
            {projects.map((project, index) => (
              <li key={project.url}>
                <button className="world" aria-pressed={selected === index} onClick={() => setSelected(index)}>
                  <img src={`/minecraft/textures/items/${project.icon}.png`} alt="" width="48" height="48" />
                  <span className="world-copy">
                    <span className="world-name">{project.name}</span>
                    <span>{project.description}</span>
                    <span>{project.stack}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="button-row project-controls">
            <a className="mc-button" href={projects[selected].url} target="_blank" rel="noreferrer">Open on GitHub</a>
            <button className="mc-button" onClick={() => setScreen("menu")}>Back</button>
          </div>
        </main>
      )}

      <footer>
        <span>Noor Ahmadi</span>
        <span>Unofficial Minecraft-inspired portfolio</span>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
