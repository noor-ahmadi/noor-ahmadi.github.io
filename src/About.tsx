import { useEffect, useState } from "react";
import type { Ref } from "react";
import "./about.css";

type Props = {
  headingRef: Ref<HTMLHeadingElement>;
  onBack: () => void;
};

export function About({ headingRef, onBack }: Props) {
  const [videoError, setVideoError] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  return (
    <main className="content-screen about-screen">
      <h1 ref={headingRef} tabIndex={-1}>About Me</h1>
      <div className="about-layout" tabIndex={0} role="region" aria-label="About me and my interests">
        <section className="about-copy" aria-labelledby="about-name" tabIndex={0}>
          <h2 id="about-name">Noor Ahmadi</h2>
          <p>
            Hi, my name is Noor Ahmadi! I'm a software engineer at Invesco,
            where I've been working for the past two years. Before that,
            I studied computer science at Georgia Tech.
          </p>
          <div className="button-row about-links">
            <a className="mc-button" href="/NOOR_AHMADI_RESUME.pdf" target="_blank" rel="noreferrer">Resume</a>
            <a className="mc-button" href="https://github.com/noor-ahmadi" target="_blank" rel="noreferrer">GitHub</a>
          </div>
          <p>
            Outside of work, I love hiking and traveling. I've done lots of
            hikes in the Pacific Northwest and a few in Hawaii and Switzerland.
            I've also visited Japan, France, and Costa Rica.
          </p>
          <p>
            I love to read. East of Eden is a recent favorite, and I also love
            sci fi and fantasy. The Sword of Kaigen is another book I really
            enjoyed. I read a lot of manhwa and watch anime too.
            {" "}<a className="text-link" href="https://www.goodreads.com/user/show/170681793" target="_blank" rel="noreferrer">Here's my Goodreads</a>
            {" "}if you want to see what else I've been reading.
          </p>
          <p>
            I also like playing Marvel Rivals and Valorant, but lately I've
            been really into Palworld.
          </p>
        </section>

        <figure className="about-edit">
          {videoError ? (
            <p className="video-error" role="status">The video couldn't load. Try reloading this page.</p>
          ) : reduceMotion ? (
            <img src="/media/minecraft-edit-poster.jpg" width="540" height="960" alt="Me in Switzerland with Minecraft items floating above me and the Matterhorn in the background" />
          ) : (
            <video
              src="/media/minecraft-edit.mp4"
              poster="/media/minecraft-edit-poster.jpg"
              autoPlay
              loop
              muted
              playsInline
              disablePictureInPicture
              preload="metadata"
              width="1080"
              height="1920"
              aria-label="My silent Minecraft edit in Switzerland"
              aria-describedby="edit-description"
              onError={() => setVideoError(true)}
            />
          )}
          <p className="sr-only" id="edit-description">
            Minecraft items float above a person lying in a grassy mountain landscape.
          </p>
          <figcaption>This is a little edit I made of me in Switzerland with the Matterhorn in the back!</figcaption>
        </figure>
      </div>
      <button className="mc-button back-button" onClick={onBack}>Back</button>
    </main>
  );
}
