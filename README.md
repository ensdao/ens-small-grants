# ENS Small Grants

This is a semi-autonomous grant application designed to help ENS DAO distribute small grants to a wider range of projects at a regular rate.

- [ENS Public Goods Working Group grant proposal](https://discuss.ens.domains/t/pg-wg-proposal-ens-small-grants/12843)
- [Metaphor Product Spec](https://metaphorxyz.notion.site/ENS-Small-Grants-3d75af5ba7a64954b81eed23191fbfd4)

## Setup

Pre-requisites:

- [Docker](https://www.docker.com/products/docker-desktop/)
- [supabase cli](https://github.com/supabase/cli#install-the-cli)

Running the project:

1. Open docker
2. Start a local instance of Supabase from the config file with `supabase start`
3. Rename `.env.example` to `.env` and enter the Supabase credentials from the previous step
4. Install dependencies with `yarn install`
5. Run the project with `yarn dev`
6. In another terminal, run `supabase functions serve rpc` to serve our edge function

## Creating a Round

1. Go to the Supabase Studio UI
2. Go to Tables -> `rounds`
3. Create a new row in the `rounds` table
4. Fill out the information needed, using integers in wei for token amounts and hex addresses for addresses (use 0x00 for `allocation_token_address` for ETH)
5. Use the ENS name for the snapshot space as the `snapshot_space_id` (eg. small-grants.eth)
6. Save the new row

## Setting up Snapshot

When the proposal period is done, you need to set up the Snapshot Space for voting. This can be done with one click in the UI by going to /rounds/{round_id}/snapshot and clicking the button on that page. It will ask you to sign a message and that should create the compatible Snapshot space with all the proposals as options. 

Your wallet address must be an admin on the Snapshot space specified in `snapshot_space_id` during the setup of the round. Your address should also be added to the `adminAddressList` array in the [Supabase RPC function](/supabase/funcions/rpc/index.ts) for the proposal id to get updated in the database.

You will also need the [ArConnect Chrome Extension](https://chrome.google.com/webstore/detail/arconnect/einnioafmpimabjcddiinlhmijaionap) installed to upload the proposals to Arweave for Snapshot.

## Architecture

For the initial implementation, the focus is on speed of deployment, while retaining independent vote audit-ability.

- During the Proposal Stage, proposal text is stored in a Supabase database.
- Once Proposal Stage is complete, an admin must create a Snapshot Proposal where each Grant Proposal is a "choice".
- Once on Voting Stage, the app uses Snapshot as the source of truth for counting votes and applying different voting strategies.

## License

This project is licensed under both MIT and Apache 2.0
