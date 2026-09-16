# Noor's portfolio

A portfolio for my projects and open source contributions, built around the
classic Minecraft Java menu. Play will open a world-selection-style project list.

## Status

The Java 1.12.2 asset sources are pinned in
[`assets/minecraft-1.12.2.json`](assets/minecraft-1.12.2.json).
The asset importer is ready. The website is not implemented yet.

The design uses original game textures, pixel glyphs, UI clicks, and optional
menu music. No AI-generated images or audio.

## Assets

The manifest records official download locations, SHA-1 checksums, and resource
paths. Game files and converted assets stay local and are excluded from Git.

With Python 3.10 or newer, run:

```sh
python scripts/import_assets.py
```

This downloads the official client, asset index, and selected audio. It verifies
their checksums and imports 10 textures, the font atlas, and 5 recordings into
`public/minecraft/`, preserving their original bytes and resource directories.
Downloads are cached under `.cache/minecraft/` and verified again on reuse.
No extra Python packages are needed. The script works from any working directory.

Minecraft assets belong to their respective rights holders. Public use needs to
follow the [Minecraft usage guidelines](https://www.minecraft.net/en-us/usage-guidelines).
This repository does not grant permission to redistribute them.

Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.
