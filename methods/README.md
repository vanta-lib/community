# Methods

A **Method** is one small, reusable, declarative capability. Each lives in its own
folder, `methods/<id>/`, where the folder name is the canonical `id`.

```
methods/<id>/
  method.json     { name, description, version, owner, tags: [] }
  recipe.md       the declarative instructions a model follows (plain text — never code)
  schema.json     { "input": <JSON Schema>, "output": <JSON Schema> }
  manifest.json   { "permissions": { "network": false, "readFiles": false } }
  examples/        *.json  →  { "input": ..., "output": ..., "note"? }  (few-shot + tests)
```

- **`recipe.md` is what actually runs** — the model reads it and follows it. There is no executable code.
- The **content hash** (recipe + schema + manifest + version) is what trust binds to; `name`/`tags`/`owner` are not hashed, so relabelling never breaks anything depending on it.
- Bump `version` in `method.json` for a real change. Examples grow freely and are not part of the hash.
