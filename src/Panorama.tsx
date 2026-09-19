import { useState } from "react";
import "./panorama.css";

// Original order: front, right, back, left, top, bottom. Faces point inward.
const rotations = [
  "rotateY(0deg)",
  "rotateY(-90deg)",
  "rotateY(-180deg)",
  "rotateY(90deg)",
  "rotateX(-90deg)",
  "rotateX(90deg)",
];

export function Panorama() {
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set());
  const [failed, setFailed] = useState(false);
  const ready = !failed && loaded.size === rotations.length;

  return (
    <div className="panorama" data-ready={ready} aria-hidden="true">
      <div className="panorama-camera">
        <div className="panorama-cube">
          {rotations.map((rotation, index) => (
            <img
              key={index}
              className="panorama-face"
              src={`/minecraft/textures/gui/title/background/panorama_${index}.png`}
              alt=""
              width="256"
              height="256"
              draggable={false}
              style={{ transform: `${rotation} translateZ(-50vmax)` }}
              onLoad={() => setLoaded((current) => new Set(current).add(index))}
              onError={() => setFailed(true)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
