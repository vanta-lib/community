# Routines

A **Routine** is a user-facing product: one or more Methods + declarative
orchestration + storage. Each lives in its own folder, `routines/<id>/`.

```
routines/<id>/
  routine.json    { name, description, version, owner, tags: [],
                    mode: "one-shot" | "accumulate",
                    storage: { journal: bool, gallery: bool },
                    deps:  [ { methodId, version } ],          // Methods it uses, version-pinned
                    flow:  [ { id, methodId, from: "journal" | "previous" | "static", value? } ],
                    view?  }                                   // optional presentation spec
  manifest.json   { "permissions": { "network": false, "readFiles": false } }
  examples/        *.json  (regression fixtures)
```

- Orchestration is **declarative only** (v1 = a straight linear chain): step 1 takes the user's input, each later step takes the previous step's output.
- A Routine **pins the version** of every Method it uses, so an upstream Method update never silently changes it.
- A single-Method Routine is the trivial one-step case.
