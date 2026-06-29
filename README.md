# linear-kintone-sync
Synchronize Linear.app and kintone.

## packages
- [lks-core](./packages/lks-core): core npm package

## Development

This repository uses [pnpm](https://pnpm.io/) (see `packageManager` in `package.json`) and Node.js (see `.tool-versions`).

```sh
corepack enable
pnpm install
pnpm --filter linear-kintone-sync test   # run tests (vitest)
pnpm exec biome check .                   # lint & format check (biome)
```

## Release

`lks-core` is published to npm by the `release` workflow when a GitHub Release is published.

1. Bump `version` in `packages/lks-core/package.json` and merge it to `main`.
2. Create a GitHub Release with a tag like `linear-kintone-sync-vX.Y.Z`.
3. The workflow builds and runs `pnpm publish` automatically.
