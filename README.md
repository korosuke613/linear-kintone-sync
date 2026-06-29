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

`lks-core` is published to npm via OIDC trusted publishing with a manual approval step (staged publishing).

1. Bump `version` in `packages/lks-core/package.json` and merge it to `main`.
2. Create a GitHub Release with a tag like `linear-kintone-sync-vX.Y.Z` (this triggers the `release` workflow; it can also be run manually via `workflow_dispatch`).
3. The workflow builds and **stages** the publish (`pnpm stage publish`) — it does not go live yet.
4. Approve the staged package on npmjs.com (Staged Packages tab) or via `pnpm stage approve <id>` (requires 2FA) to make it live.
