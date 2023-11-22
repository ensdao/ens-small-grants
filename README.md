# ENS Small Grants

This is a platforms designed to help ENS DAO Working Groups distribute grants to a wider range of projects at a regular rate.

- [Original grant proposal](https://discuss.ens.domains/t/pg-wg-proposal-ens-small-grants/12843)
- [Original product spec](https://metaphorxyz.notion.site/ENS-Small-Grants-3d75af5ba7a64954b81eed23191fbfd4)

## Run locally

Install dependencies:

```bash
yarn install
```

Set the environment variables:

```bash
cp .env.example .env.local
```

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Creating a Round

There is no UI for creating a new round, so you will need to do this manually via the `rounds` table in the database.

Some things to keep in mind:

- `allocation_token_amount` is in wei
- To distribute ETH, set `allocation_token_address` to `0x00`
- `snapshot_space_id` is the ENS name of the Snapshot space to use for voting (eg. small-grants.eth)
- `snapshot_proposal_id` is the ID of the Snapshot proposal that will be created between `proposal_end` and `voting_start`. It should be empty when creating the round.

## Setting up Snapshot

When the proposal period is done (after `proposal_end` and before `voting_start`), you'll need to set up the Snapshot Space for voting. This can be done with one click in the UI by going to /rounds/{round_id}/snapshot. It will ask you to sign a message and that should create the compatible Snapshot space with all the proposals as options.

Your wallet address must be an admin on the Snapshot space specified in `snapshot_space_id` during the setup of the round.

You will also need the [ArConnect Chrome Extension](https://chrome.google.com/webstore/detail/arconnect/einnioafmpimabjcddiinlhmijaionap) installed to upload the proposals to Arweave for Snapshot.

## Architecture

For the initial implementation, the focus is on speed of deployment, while retaining independent vote audit-ability.

- During the Proposal Stage, proposal text is stored in a Supabase database.
- Once Proposal Stage is complete, an admin must create a Snapshot Proposal where each Grant Proposal is a "choice".
- Once on Voting Stage, the app uses Snapshot as the source of truth for counting votes and applying different voting strategies.

## License

This project is licensed under both MIT and Apache 2.0
