"""Import the pinned Minecraft assets without modifying their contents."""

import hashlib
import io
import json
import sys
import urllib.request
import zipfile
from pathlib import Path, PurePosixPath


ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / ".cache" / "minecraft"
OUTPUT = ROOT / "public" / "minecraft"
MANIFEST = ROOT / "assets" / "minecraft-1.12.2.json"


def download(url: str, expected_sha1: str) -> bytes:
    cached = CACHE / expected_sha1
    if cached.is_file():
        data = cached.read_bytes()
        if hashlib.sha1(data).hexdigest() == expected_sha1:
            return data

    print(f"Downloading {url}", flush=True)
    request = urllib.request.Request(url, headers={"User-Agent": "noor-portfolio"})
    with urllib.request.urlopen(request, timeout=30) as response:
        data = response.read()
    if hashlib.sha1(data).hexdigest() != expected_sha1:
        raise ValueError(f"Checksum mismatch: {url}")

    CACHE.mkdir(parents=True, exist_ok=True)
    cached.write_bytes(data)
    return data


def destination(resource: str, prefix: str) -> Path:
    relative = PurePosixPath(resource).relative_to(prefix)
    target = OUTPUT.joinpath(*relative.parts)
    if not target.resolve().is_relative_to(OUTPUT.resolve()):
        raise ValueError(f"Asset path escapes the output directory: {resource}")
    return target


def import_assets() -> int:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    index_source = manifest["assetIndex"]
    index = json.loads(download(index_source["url"], index_source["sha1"]))
    client_source = manifest["client"]
    client = download(client_source["url"], client_source["sha1"])

    # Verify everything before replacing any assets in the public directory.
    assets: dict[Path, bytes] = {}
    with zipfile.ZipFile(io.BytesIO(client)) as archive:
        for resource in [*manifest["textures"], manifest["font"]]:
            assets[destination(resource, "assets/minecraft")] = archive.read(resource)

    for sound in manifest["audio"]:
        resource = sound["resource"]
        checksum = sound["sha1"]
        if index["objects"][resource]["hash"] != checksum:
            raise ValueError(f"Audio reference does not match the asset index: {resource}")
        url = f"https://resources.download.minecraft.net/{checksum[:2]}/{checksum}"
        assets[destination(resource, "minecraft")] = download(url, checksum)

    for target, data in assets.items():
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
    return len(assets)


if __name__ == "__main__":
    try:
        count = import_assets()
    except (OSError, ValueError, KeyError, zipfile.BadZipFile) as error:
        print(f"Asset import failed: {error}", file=sys.stderr)
        sys.exit(1)
    print(f"Imported {count} original assets into {OUTPUT}")
