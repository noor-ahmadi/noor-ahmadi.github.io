import { StrictMode, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Panorama } from "./Panorama";
import { WorkBrowser } from "./WorkBrowser";
import { portfolio } from "./portfolio";
import type { Collection } from "./portfolio";
import "./styles.css";

function App() {
  const [screen, setScreen] = useState<"menu" | "projects">("menu");
  const [collection, setCollection] = useState<Collection>("projects");
  const [selection, setSelection] = useState<Record<Collection, string>>({
    projects: portfolio.projects[0].id,
    contributions: portfolio.contributions[0].id,
  });
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

  function openBrowser(nextCollection: Collection) {
    setCollection(nextCollection);
    setScreen("projects");
  }

  return (
    <div className={`game ${screen}`} onClickCapture={(event) => {
      if (event.target instanceof Element && event.target.closest('button, a, input[type="radio"]')) {
        playClick();
      }
    }}>
      {screen === "menu" && <Panorama />}
      <audio ref={clickAudio} src="/minecraft/sounds/random/click.ogg" preload="auto" />
      <audio ref={musicAudio} src="/minecraft/sounds/music/menu/menu1.ogg" preload="none" loop />

      {screen === "menu" ? (
        <main className="title-screen">
          <header className="title">
            <h1 ref={heading} tabIndex={-1}>
              <span className="title-depth" aria-hidden="true">NOOR AHMADI</span>
              <span className="title-face">NOOR AHMADI</span>
            </h1>
            <p className="edition">PORTFOLIO</p>
            <span className="splash" aria-hidden="true">Hello, world!</span>
          </header>
          <nav className="menu-controls" aria-label="Main menu">
            <button className="mc-button" onClick={() => openBrowser("projects")}>Play</button>
            <button className="mc-button" onClick={() => openBrowser("contributions")}>Contributions</button>
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
        <WorkBrowser
          collection={collection}
          selectedId={selection[collection]}
          headingRef={heading}
          onCollectionChange={setCollection}
          onSelect={(id) => setSelection((current) => ({ ...current, [collection]: id }))}
          onBack={() => setScreen("menu")}
        />
      )}

      <footer>
        <span>Noor Ahmadi</span>
        <span>Unofficial Minecraft-inspired portfolio</span>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
