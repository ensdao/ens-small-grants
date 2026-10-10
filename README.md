# ENS Small Grants

ENS Small Grants has been **shut down**. Rounds ran from July 2022 through June 2024.

This repository is now a static archive for [ensgrants.xyz](https://ensgrants.xyz). There is no application, no wallet connection, and no backend.

## Archive

The public API was exported before the app was removed:

- [`data/ens-small-grants.json`](data/ens-small-grants.json) — 24 rounds, 879 proposals, Snapshot vote results from `hub.snapshot.org` (space `small-grants.eth`), **173.7 ETH** allocated across 23 ETH prize pools, and a **6,000 USDC** Public Goods Scholarships pool
- [`data/ens-small-grants.csv`](data/ens-small-grants.csv) — one row per proposal

Verification: every round’s exported grant list length matches that round’s `grantsCount`. Allocation totals are summed from each round’s `allocationTokenAmount` (ETH at 18 decimals for `0x000`; USDC at 6 decimals). Payouts are not recorded in the public API and are not in these files.

Historical votes: [snapshot.org/#/small-grants.eth](https://snapshot.org/#/small-grants.eth)

## License

This project is licensed under both MIT and Apache 2.0.
