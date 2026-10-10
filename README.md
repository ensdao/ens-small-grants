# ENS Small Grants

ENS Small Grants has been **shut down**. The last rounds ran in June 2024.

This repository is now a static archive for [ensgrants.xyz](https://ensgrants.xyz). There is no application, no wallet connection, and no backend.

## Archive

The public API was exported before the app was removed:

- [`data/ens-small-grants.json`](data/ens-small-grants.json) — 24 rounds, 879 proposals, and Snapshot vote results from `hub.snapshot.org` (space `small-grants.eth`)
- [`data/ens-small-grants.csv`](data/ens-small-grants.csv) — one row per proposal

Verification: every round’s exported grant list length matches that round’s `grantsCount`. Payout addresses were never returned by the public API and are not in these files.

Historical votes: [snapshot.org/#/small-grants.eth](https://snapshot.org/#/small-grants.eth)

## Where ENS grants live now

ENS-specific funding is handled by the [ENS Ecosystem Working Group](https://basics.ensdao.org/ens-ecosystem-wg). See the [Term 6 grants thread](https://discuss.ens.domains/t/term-6-grants-summary/20320) and the [ENS DAO forum](https://discuss.ens.domains/).

Public Goods Builder Grants at [builder.ensgrants.xyz](https://builder.ensgrants.xyz/) are also closed as that working group sunsets.

## Local preview

This is a static site. From the repo root:

```bash
python3 -m http.server 3000
```

Then open [http://localhost:3000](http://localhost:3000).

## Vercel

The project should be served as a **static / no-framework** deployment with **no build command**. `vercel.json` redirects old app routes (`/rounds`, `/faq`, `/api/*`, etc.) to `/`.

After merge, decommission:

- The Postgres database used by the old Next.js API
- Environment secrets (`DB_CONNECTION_STRING`, and any others)
- The WalletConnect project ID (`NEXT_PUBLIC_WALLETCONNECT_ID`)

## History

The previous app used Next.js 13.4.2, RainbowKit 1, wagmi v1, WalletConnect, Kysely/Postgres, and Snapshot. That stack is gone from this repo so the domain is no longer a wallet-connect phishing surface.

Original materials:

- [Original grant proposal](https://discuss.ens.domains/t/pg-wg-proposal-ens-small-grants/12843)
- [Original product spec](https://metaphorxyz.notion.site/ENS-Small-Grants-3d75af5ba7a64954b81eed23191fbfd4)

## License

This project is licensed under both MIT and Apache 2.0.
