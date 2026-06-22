# Vanta Library Community

The shared warehouse of **Methods** and **Routines** for [Vanta](https://github.com/oskar617-cmyk/vanta-agent) — the self-hosted, local-first personal AI agent.

- **Method** = one small, reusable, **declarative** capability (a recipe + input/output schema + growing examples).
- **Routine** = a user-facing product made of one or more Methods + declarative orchestration.

## How it works

```
This repo (definition)  →  Cloudflare (index.json, served)  →  the Vanta app (reads CF only)
```

- A GitHub Action rebuilds `index.json` (the catalogue the app searches) whenever `methods/` or `routines/` change.
- The Vanta app reads the catalogue from **Cloudflare**, never from GitHub directly.
- Installing pulls just the one Routine you want (plus its Method dependencies) — never the whole repo.

## Layout

```
methods/<id>/      method.json · recipe.md · schema.json · manifest.json · examples/
routines/<id>/     routine.json · manifest.json · examples/
index.json         generated — do not edit by hand
```

See [`methods/README.md`](methods/README.md) and [`routines/README.md`](routines/README.md) for the folder contracts.

## Contributing

- Most content is published from inside the Vanta app (the app commits on your behalf — you never touch Git).
- Direct contributors may open a Pull Request. Content is **declarative only** — no executable code — which is what makes an open, family-facing store safe.

## Safety

- Trust binds to the exact **content hash** of each item (verified on-device), not to any badge.
- Everything here is public; never put private data in a Method/Routine or its examples.
