import { useState } from "react";
import type { Ref } from "react";
import "./about.css";

type Props = {
  headingRef: Ref<HTMLHeadingElement>;
  onBack: () => void;
};

export function About({ headingRef, onBack }: Props) {
  const [videoError, setVideoError] = useState(false);

  return (
    <main className="content-screen about-screen">
      <h1 ref={headingRef} tabIndex={-1}>About Me</h1>
      <div className="about-layout">
        <section className="about-copy" aria-labelledby="about-name">
          <p className="about-label">Player profile</p>
          <h2 id="about-name">Noor Ahmadi</h2>
          <p>
            Hi, I'm Noor. This is where I keep my projects, open-source
            contributions, and the occasional Minecraft edit.
          </p>
          <p className="about-pending">More about me soon.</p>
          <div className="button-row about-links">
            <a className="mc-button" href="https://github.com/noor-ahmadi" target="_blank" rel="noreferrer">GitHub</a>
            <button className="mc-button" disabled>Resume (soon)</button>
          </div>
        </section>

        <figure className="about-edit">
          {videoError ? (
            <p className="video-error" role="status">The video couldn't load. Try reloading this page.</p>
          ) : (
            <video
              src="/media/minecraft-edit.mp4"
              poster="/media/minecraft-edit-poster.jpg"
              controls
              muted
              playsInline
              preload="metadata"
              width="1080"
              height="1920"
              aria-label="My Minecraft edit, a silent 10-second clip"
              aria-describedby="edit-description"
              onError={() => setVideoError(true)}
            />
          )}
          <p className="sr-only" id="edit-description">
            Minecraft items float above a person lying in a grassy mountain landscape.
          </p>
          <figcaption>A Minecraft edit I made.<br />10 seconds / Silent</figcaption>
        </figure>
      </div>
      <button className="mc-button back-button" onClick={onBack}>Back</button>
    </main>
  );
}
